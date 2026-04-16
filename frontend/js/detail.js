/* =========================================
   DETAIL.JS FINAL PREMIUM
   - Ambil data CSV dari backend
   - Semua destinasi sesuai database
   - Deskripsi otomatis unik
   - Gambar sesuai photos.json
========================================= */

let semuaData = [];
let photos = {};

/* ===============================
   LOAD
================================= */
document.addEventListener("DOMContentLoaded", async () => {

  try {

    const res = await fetch("http://localhost:5000/api/wisata");
    semuaData = await res.json();

    const foto = await fetch("data/photos.json");
    photos = await foto.json();

    tampilkanDetail();

  } catch (err) {
    console.log(err);
  }

});

/* ===============================
   GET PARAM
================================= */
function getId() {
  const url = new URLSearchParams(location.search);
  return Number(url.get("id")) || 0;
}

/* ===============================
   NORMAL
================================= */
function normal(text) {
  return String(text)
    .toLowerCase()
    .replace(/jatim/g, "jawa timur")
    .replace(/[^a-z0-9]/g, "");
}

/* ===============================
   FOTO
================================= */
function cariFoto(nama) {

  const target = normal(nama);

  for (let key in photos) {
    if (normal(key) === target) {
      return photos[key];
    }
  }

  return "images/default.jpg";
}

/* ===============================
   FORMAT
================================= */
function rupiah(n) {
  return "Rp " + Number(n).toLocaleString("id-ID");
}

/* ===============================
   DESKRIPSI AI
================================= */
function buatDeskripsi(item) {

  const nama = item.Nama;
  const kategori = item.Kategori;

  if (kategori.toLowerCase().includes("alam")) {
    return `${nama} merupakan destinasi wisata alam populer di Malang Raya dengan panorama indah, udara segar, dan cocok untuk healing bersama keluarga maupun pasangan.`;
  }

  if (
    kategori.toLowerCase().includes("rekreasi") ||
    kategori.toLowerCase().includes("buatan")
  ) {
    return `${nama} adalah tempat wisata favorit dengan banyak wahana hiburan menarik, cocok untuk liburan keluarga, anak-anak, dan rombongan.`;
  }

  if (
    kategori.toLowerCase().includes("budaya") ||
    kategori.toLowerCase().includes("sejarah")
  ) {
    return `${nama} menawarkan pengalaman budaya dan sejarah khas Malang yang edukatif serta menarik untuk dijelajahi.`;
  }

  if (
    kategori.toLowerCase().includes("edukasi")
  ) {
    return `${nama} merupakan destinasi wisata edukasi yang memberikan pengalaman belajar interaktif sekaligus menyenangkan.`;
  }

  return `${nama} adalah salah satu destinasi wisata menarik di Malang Raya yang layak masuk wishlist perjalanan Anda.`;

}

/* ===============================
   TAMPILKAN
================================= */
function tampilkanDetail() {

  const id = getId();

  const item = semuaData[id];
  if (!item) return;

  const nama = item.Nama;
  const gambar = cariFoto(nama);

  document.getElementById("judul").innerText = nama;
  document.getElementById("gambar").src = gambar;
  document.getElementById("rating").innerText = item.Rating;
  document.getElementById("harga").innerText = rupiah(item.Tiket);
  document.getElementById("jam").innerText =
    item["Jam Buka"] + " - " + item["Jam Tutup"];

  document.getElementById("kategori").innerText =
    item.Kategori;

  document.getElementById("deskripsi").innerText =
    buatDeskripsi(item);

}

/* ===============================
   MAPS
================================= */
function bukaMaps() {

  const id = getId();
  const item = semuaData[id];
  if (!item) return;

  const tujuan =
    item.Latitude + "," + item.Longitude;

  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(pos => {

      const asal =
        pos.coords.latitude + "," +
        pos.coords.longitude;

      const url =
        "https://www.google.com/maps/dir/?api=1" +
        "&origin=" + asal +
        "&destination=" + tujuan +
        "&travelmode=driving";

      window.open(url, "_blank");

    });

  } else {

    window.open(
      "https://www.google.com/maps/search/?api=1&query=" +
      tujuan,
      "_blank"
    );

  }

}