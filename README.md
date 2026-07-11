# Geo Moment Diary
Buku harian digital berbasis lokasi (LBS). Setiap catatan menyimpan teks, foto, dan koordinat GPS tempat momen itu terjadi.

Link Video Demo Aplikasi
https://youtube.com/shorts/cMPU76MMcug

Link Laporan 
https://drive.google.com/file/d/1XfOc4ZRk6NAFWH2Bp7yRiSZFer7ZSX2u/view?usp=drive_link

## Instalasi & Menjalankan Aplikasi

### Prasyarat
- [Node.js](https://nodejs.org) (versi LTS)
- Git
- App **Expo Go** di HP Android (dari Play Store)
- HP dan komputer terhubung ke **WiFi yang sama**

### Langkah-langkah

1. **Clone repository**
   ```bash
   git clone https://github.com/USERNAME/nama-repo.git
   cd nama-repo
   ```

2. **Install dependency**
   ```bash
   npm install
   ```
   Kalau muncul error seperti `Cannot find module '@expo/config-plugins'`, bersihkan dulu lalu install ulang:
   ```bash
   rm -rf node_modules
   rm -f package-lock.json
   npm install
   ```

3. **Jalankan project**
   ```bash
   npx expo start
   ```
   Kalau ada masalah cache/reload aneh, tambahkan flag clear cache:
   ```bash
   npx expo start -c
   ```

4. **Buka di HP**
   - Buka app **Expo Go**
   - Scan QR code yang muncul di terminal
   - Tunggu proses bundling selesai

5. **Izinkan permission**
   Saat pertama kali dibuka, aplikasi akan meminta izin **Kamera** dan **Lokasi** — izinkan keduanya supaya semua fitur berjalan. Aplikasi mungkin reload sekali secara otomatis saat izin pertama kali diberikan — ini perilaku normal Expo Go (lihat bagian Catatan Teknis).
