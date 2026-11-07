# TaskFlow Backend API

TaskFlow, görevleri JSON dosyasında saklayan Node.js ve Express tabanlı bir REST API'dir. Görevler oluşturulabilir, listelenebilir, görüntülenebilir, güncellenebilir ve silinebilir.

## Gereksinimler

- Node.js
- npm

## Kurulum ve çalıştırma

```bash
npm install express
```

Geliştirme modunda Nodemon ile başlat:

```bash
npm install --save-dev nodemon
npm pkg set scripts.start="node app.js" scripts.dev="nodemon app.js"
npm run dev
```

Normal modda başlatmak için:

```bash
npm start
```

Sunucu `http://localhost:3000` adresinde çalışır.