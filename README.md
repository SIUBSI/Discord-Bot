# Instalasi
***

[Unduh Versi terbaru](https://github.com/SIUBSI/Discord-Bot/releases/tag/v1.0.0) | [Lihat Daftar Versi Tersedia](https://github.com/SIUBSI/Discord-Bot/releases)

#### Atau Dengan Menggunakan Git

- Diperlukan untuk memiliki **Git** terlebih dahulu pada Sistem Operasi anda, [Unduh Git disini](https://git-scm.com/downloads)
- Eksekusi perintah dibawah, Bisa melalui Terminal milik Sistem Operasi atau Terminal milik Penyunting Kode (Code Editor)
- git clone https://github.com/SIUBSI/Discord-Bot.git

***

### Tanpa menggunakan .env
- Hapus file `.env.example`
- Hapus kode pada baris 1 di file `index.js`
```js
require('dotenv').config('./.env');
```
- Ubah kode pada baris 28 di file `index.js`
```js
client.login(process.env.TOKEN);
// menjadi
client.login("paste_token_disini");
```

***
Copyright &copy;Reighpuy:SIUBSI