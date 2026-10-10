# FocusFlow — AI Destekli Görev ve Odaklanma Asistanı

Modern, dark mode odaklı, mobil uyumlu (PWA) bir odaklanma asistanı.

## Özellikler

- **Kanban Board**: Sürükle-bırak ile görev yönetimi (Yapılacaklar / Yapılıyor / Tamamlandı)
- **Öncelik etiketleri**: Düşük, Orta, Yüksek
- **Pomodoro Sayacı**: 25/5 dakikalık çalışma-mola döngüsü, tarayıcı bildirimi ve sesli uyarı
- **Ortam Sesleri**: Yağmur ve Lo-Fi müzik çalar (ses kontrolü ile)
- **AI Performans Koçu**: Günlük görev ve Pomodoro verilerine göre akıllı geri bildirimler (Mock — API'ye hazır)
- **localStorage**: Sayfa yenilense bile veriler kaybolmaz
- **Glassmorphism** + neon cyan (#00d2ff) tema
- Gelecekte Supabase / Firebase bağlantısına hazır temiz veri yapıları

## Teknoloji

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Lucide React
- @dnd-kit (drag & drop)
- localStorage

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) açın.

## PWA

`public/manifest.json` hazır. Üretimde ikonlar ekleyerek tam PWA haline getirebilirsiniz.

## Lisans

MIT
