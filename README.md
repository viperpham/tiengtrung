# Học tiếng Trung 汉语学习

Website học tiếng Trung tĩnh (Astro + TailwindCSS), deploy miễn phí trên Cloudflare Pages, quản lý nội dung bằng Sveltia CMS.

## Tính năng

- Bài học theo cấp độ HSK 1–6 (từ vựng, ngữ pháp, ví dụ)
- Audio phát âm cho từng từ (sinh tự động, miễn phí bằng Edge TTS)
- Quiz trắc nghiệm làm trực tiếp trên web
- Flashcard với thuật toán ôn tập ngắt quãng (SRS), lưu tiến độ trên máy học viên
- Admin panel tại `/admin` — thêm/sửa nội dung, tự động commit lên GitHub

## Cấu trúc nội dung

```
src/content/
├── lessons/     # Bài học (Markdown, frontmatter: title, level, order)
├── vocabulary/  # Từ vựng (JSON: hanzi, pinyin, meaning_vi, audio...)
├── grammar/     # Ngữ pháp (JSON: structure, explanation, examples)
└── quizzes/     # Bài kiểm tra (JSON: questions, options, answer)
```

## Lệnh thường dùng

| Lệnh | Ý nghĩa |
|---|---|
| `npm run dev` | Chạy server dev tại localhost:4321 |
| `npm run build` | Build site tĩnh vào `dist/` |
| `npm run tts` | Sinh audio cho từ vựng chưa có audio (Edge TTS, free) |
| `npm run tts:tw` | Sinh audio giọng nam (Yunxi) |

## Thêm nội dung mới

**Cách 1 — Qua CMS (khuyên dùng):** vào `/admin`, đăng nhập GitHub, thêm qua form.

**Cách 2 — Sửa file trực tiếp:** thêm file JSON/Markdown vào `src/content/`, chạy `npm run tts` để sinh audio nếu cần, rồi commit + push.

## Deploy

- Cloudflare Pages: connect repo, build command `npm run build`, output `dist`
- CMS cần GitHub OAuth App (xem hướng dẫn trong README khi setup lần đầu)
