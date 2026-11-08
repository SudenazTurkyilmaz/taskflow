# TaskFlow Backend API

TaskFlow, ekip içerisindeki görevleri ve çalışanların sorumluluklarını takip etmek amacıyla geliştirilmiş Node.js ve Express tabanlı bir REST API'dir. Kullanıcılar görev oluşturabilir, listeleyebilir, görüntüleyebilir, güncelleyebilir ve silebilir. Görevlere kişi atanabilir; durum ve öncelik bilgileri belirlenebilir. Görev verileri `data/tasks.json` dosyasında saklanır.

Görevler durum, öncelik veya atanan kişiye göre filtrelenebilir. Search parametresiyle görev başlığı ve açıklamasında büyük/küçük harf duyarlılığı olmadan arama yapılabilir. Sayfalama sayesinde görevler belirli sayıda listelenebilir. Ayrıca raporlama özelliği, toplam görev sayısını ve görevlerin durum, öncelik ve atanan kişiye göre dağılımını gösterir.

Örnekler:

- Filtreleme: `GET /tasks?status=pending&priority=high`
- Arama: `GET /tasks?search=backend`
- Sayfalama: `GET /tasks?page=1&limit=10`
- Raporlama: `GET /tasks/report`

## Gereksinimler

- Node.js
- npm

## Kurulum ve çalıştırma

Projeyi GitHub'dan indirdikten sonra terminalde proje klasörüne geç ve bağımlılıkları yükle:

```bash
cd backend
npm install
```

Normal modda başlatmak için:

```bash
npm start
```

Geliştirme modunda Nodemon ile başlatmak için:

```bash
npm run dev
```

Sunucu `http://localhost:3000` adresinde çalışır.
