import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import fs from 'node:fs/promises';
import path from 'node:path';

const VOCAB_DIR = 'src/content/vocabulary';
const AUDIO_DIR = 'public/audio';
const VOICE = process.env.TTS_VOICE || 'zh-CN-XiaoxiaoNeural';

function slugifyPinyin(pinyin) {
  return pinyin
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function collectVocabFiles(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await collectVocabFiles(p)));
    else if (entry.name.endsWith('.json')) out.push(p);
  }
  return out;
}

async function main() {
  const files = await collectVocabFiles(VOCAB_DIR);
  const targets = [];

  for (const file of files) {
    const vocab = JSON.parse(await fs.readFile(file, 'utf8'));
    const entries = [
      { text: vocab.hanzi, relPath: vocab.audio },
      ...(vocab.example_sentence ? [{ text: vocab.example_sentence, relPath: null }] : []),
    ];

    const main = entries[0];
    if (main.relPath) {
      targets.push({ text: main.text, absPath: path.join('public', main.relPath) });
    } else {
      const level = (vocab.level || 'hsk1').toLowerCase();
      const name = slugifyPinyin(vocab.pinyin) || slugifyPinyin(vocab.hanzi) || Date.now().toString(36);
      const rel = `/audio/${level}/${name}.mp3`;
      targets.push({ text: main.text, absPath: path.join('public', rel) });
      vocab.audio = rel;
      await fs.writeFile(file, JSON.stringify(vocab, null, 2) + '\n', 'utf8');
      console.log(`  ↳ cập nhật audio trong ${file}: ${rel}`);
    }
  }

  const missing = [];
  for (const t of targets) {
    try {
      await fs.access(t.absPath);
    } catch {
      missing.push(t);
    }
  }

  if (missing.length === 0) {
    console.log(`✔ Tất cả ${targets.length} file audio đã tồn tại — không cần sinh mới.`);
    return;
  }

  const tts = new MsEdgeTTS();
  await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  for (const t of missing) {
    await fs.mkdir(path.dirname(t.absPath), { recursive: true });
    const { audioStream } = tts.toStream(t.text);
    const chunks = [];
    for await (const chunk of audioStream) chunks.push(chunk);
    await fs.writeFile(t.absPath, Buffer.concat(chunks));
    console.log(`🔊 ${t.text} → ${t.absPath} (${Buffer.concat(chunks).length} bytes)`);
  }

  console.log(`✔ Hoàn thành: sinh ${missing.length} file audio (giọng ${VOICE}).`);
}

main().catch((err) => {
  console.error('✘ Lỗi:', err);
  process.exit(1);
});
