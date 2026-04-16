/* =========================================
   DASHBOARD.JS FINAL ITINIX (FULL FIX)
   FIX:
   ✅ Profil ambil akun signup/login
   ✅ Traveler hilang
   ✅ Destinasi tampil normal
   ✅ Tidak menimpa popup profile
   ✅ Search aktif
   ✅ Detail aktif
========================================= */

console.log("dashboard final aktif");

let semuaData = [];
let photos = {};
let loaded = false;

/* =========================================
LOAD DATA
========================================= */
async function loadData() {

  if (loaded) return;
  loaded = true;

  try {

    const res = await fetch("http://localhost:5000/api/wisata");
    semuaData = await res.json();

    const foto = await fetch("data/photos.json");
    photos = await foto.json();

    renderData(semuaData);

  } catch (err) {

    console.log("Load gagal:", err);

  }

}

/* =========================================
AMBIL DATA CSV AMAN
========================================= */
function ambilKolom(obj, nama) {

  for (let key in obj) {

    const bersih = key
      .replace(/\uFEFF/g, "")
      .trim()
      .toLowerCase();

    if (bersih === nama.toLowerCase()) {
      return String(obj[key]).trim();
    }

  }

  return "";
}

/* =========================================
GET DATA
========================================= */
function getNama(x) {
  return ambilKolom(x, "Nama") || "Wisata";
}

function getHarga(x) {
  return Number(ambilKolom(x, "Tiket")) || 0;
}

function getRating(x) {
  return ambilKolom(x, "Rating") || "-";
}

function getKategori(x) {
  return ambilKolom(x, "Kategori") || "Wisata";
}

function getJam(x) {

  const buka = ambilKolom(x, "Jam Buka") || "-";
  const tutup = ambilKolom(x, "Jam Tutup") || "-";

  return buka + " - " + tutup;
}

/* =========================================
NORMAL NAMA
========================================= */
function normalNama(teks) {

  return String(teks)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

}

/* =========================================
CARI FOTO
========================================= */
function cariFoto(nama) {

  const target = normalNama(nama);

  for (let key in photos) {

    if (normalNama(key) === target) {
      return photos[key];
    }

  }

  return "images/default.jpg";
}

/* =========================================
RENDER DESTINASI
========================================= */
function renderData(data) {

  const box = document.getElementById("wisataList");
  if (!box) return;

  box.innerHTML = "";

  data.forEach((item, index) => {

    const nama = getNama(item);
    const harga = getHarga(item);
    const rating = getRating(item);
    const kategori = getKategori(item);
    const jam = getJam(item);
    const gambar = cariFoto(nama);

    box.innerHTML += `
      <div class="card" onclick="bukaDetail(${index})">

        <img src="${gambar}" onerror="this.src='images/default.jpg'">

        <div class="card-content">

          <h3>${nama}</h3>

          <div class="meta">
            <span>⭐ ${rating}</span>
            <span>💰 Rp ${harga.toLocaleString("id-ID")}</span>
          </div>

          <div class="meta">
            <span>🕒 ${jam}</span>
          </div>

          <div class="tag">${kategori}</div>

        </div>

      </div>
    `;

  });

}

/* =========================================
SEARCH
========================================= */
function cariDestinasi() {

  const input = document.getElementById("searchBox");
  if (!input) return;

  const key = input.value.toLowerCase().trim();

  if (key === "") {
    renderData(semuaData);
    return;
  }

  const hasil = semuaData.filter(item =>
    getNama(item).toLowerCase().includes(key)
  );

  renderData(hasil);
}

/* =========================================
DETAIL
========================================= */
function bukaDetail(id) {

  localStorage.setItem(
    "detailWisata",
    JSON.stringify(semuaData[id])
  );

  location.href = "detail.html?id=" + id;
}

/* =========================================
PROFILE (FIX TIDAK TIMPA DATA)
========================================= */
function bukaProfil() {

  const popup = document.getElementById("popupProfil");
  popup.style.display = "flex";

  let user = JSON.parse(localStorage.getItem("userLogin"));

  if (!user) {

    user = {
      nama: localStorage.getItem("userNama") || "Traveler",
      email: localStorage.getItem("userEmail") || "traveler@email.com",
      password: localStorage.getItem("userPassword") || "",
      history: []
    };

    localStorage.setItem("userLogin", JSON.stringify(user));
  }

  document.getElementById("namaUser").innerText = user.nama;
  document.getElementById("emailUser").innerText = user.email;
  document.getElementById("usernameText").innerText = user.nama;
  document.getElementById("emailText").innerText = user.email;
  document.getElementById("pass").value = user.password;

  const list = document.getElementById("historyList");

  if (!user.history || user.history.length === 0) {

    list.innerHTML = `<li>Belum ada riwayat perjalanan</li>`;

  } else {

    list.innerHTML = "";

    user.history.forEach(item => {
      list.innerHTML += `<li>${item}</li>`;
    });

  }

}

function tutupProfil() {
  document.getElementById("popupProfil").style.display = "none";
}

/* =========================================
PASSWORD
========================================= */
function lihatPassword() {

  const pass = document.getElementById("pass");
  const eye = document.getElementById("eyeIcon");

  if (pass.type === "password") {
    pass.type = "text";
    eye.className = "fa-solid fa-eye-slash";
  } else {
    pass.type = "password";
    eye.className = "fa-solid fa-eye";
  }

}

function lupaSandi() {

  const user = JSON.parse(localStorage.getItem("userLogin"));

  alert("Password akun kamu: " + user.password);

}

/* =========================================
LOGOUT
========================================= */
function logoutUser() {

  localStorage.removeItem("isLogin");
  localStorage.removeItem("userLogin");

  location.href = "login.html";

}

/* =========================================
SEARCH PAGE
========================================= */
function bukaSearchPage() {
  location.href = "search.html";
}

/* =========================================
LANGUAGE
========================================= */
function changeLanguage() {

  const lang = document.getElementById("language").value;

  if (lang === "en") {

    document.getElementById("titleText").innerText = "Plan Your Vacation";
    document.getElementById("detailText").innerText = "Destination Details";
    document.getElementById("searchBox").placeholder = "Search destination...";

  } else {

    document.getElementById("titleText").innerText = "Rencanakan Liburan";
    document.getElementById("detailText").innerText = "Detail Destinasi";
    document.getElementById("searchBox").placeholder = "Cari destinasi...";

  }

}

/* =========================================
RUN
========================================= */
window.onload = function () {

  if (localStorage.getItem("isLogin") !== "true") {
    location.href = "login.html";
    return;
  }

  loadData();

};

document.addEventListener("DOMContentLoaded", () => {

  const input = document.getElementById("searchBox");

  if (input) {
    input.addEventListener("keyup", cariDestinasi);
  }

});