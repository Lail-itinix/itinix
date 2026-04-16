/* =========================================
   DASHBOARD.JS FINAL ITINIX (FIX TOTAL)
   - CSV backend connect
   - Foto auto match lengkap
   - Semua destinasi tampil
   - Search aktif
   - Anti flicker / anti kedip
   - Detail page support
========================================= */

console.log("dashboard final aktif");

let semuaData = [];
let photos = {};
let loaded = false;

/* =========================================
LOAD DATA
========================================= */
async function loadData(){

  if(loaded) return;
  loaded = true;

  try{

    const res = await fetch("http://localhost:5000/api/wisata");
    semuaData = await res.json();

    const foto = await fetch("data/photos.json");
    photos = await foto.json();

    renderData(semuaData);

  }catch(err){
    console.log("Load gagal:", err);
  }
}

/* =========================================
AMBIL KOLOM CSV AMAN
========================================= */
function ambilKolom(obj,nama){

  for(let key in obj){

    const bersih = key
      .replace(/\uFEFF/g,"")
      .trim()
      .toLowerCase();

    if(bersih === nama.toLowerCase()){
      return String(obj[key]).trim();
    }
  }

  return "";
}

/* =========================================
GET DATA
========================================= */
function getNama(x){
  return ambilKolom(x,"Nama") || "Wisata";
}

function getHarga(x){
  return Number(ambilKolom(x,"Tiket")) || 0;
}

function getRating(x){
  return ambilKolom(x,"Rating") || "-";
}

function getKategori(x){
  return ambilKolom(x,"Kategori") || "Wisata";
}

function getJam(x){

  const buka = ambilKolom(x,"Jam Buka") || "-";
  const tutup = ambilKolom(x,"Jam Tutup") || "-";

  return buka + " - " + tutup;
}

/* =========================================
NORMAL NAMA
========================================= */
function normalNama(teks){

  return String(teks)
    .toLowerCase()
    .replace(/jatim/g,"jawatimur")
    .replace(/baloga/g,"batulovegarden")
    .replace(/warna warni/g,"warnawarni")
    .replace(/museum tubuh/g,"museumtubuh")
    .replace(/\(.*?\)/g,"")
    .replace(/&/g,"dan")
    .replace(/[^a-z0-9]/g,"");
}

/* =========================================
AUTO FOTO FIX TOTAL
========================================= */
function cariFoto(nama){

  const target = normalNama(nama);

  const manual = {

    "jawatimurpark1":"images/Jatim Park 1.webp",
    "jawatimurpark2":"images/jatim park 2.jpg",
    "jawatimurpark3":"images/jatim park 3.webp",

    "batunightspectacular":"images/Batu Night Spectacular.webp",
    "bns":"images/Batu Night Spectacular.webp",

    "ecogreenpark":"images/Eco Green Park.jpg",
    "hawaiwaterpark":"images/Hawai Waterpark.jpg",

    "tamanrekreasiselecta":"images/Selecta.jpg",
    "florawisatasanterra":"images/Santera De Laponte.jpg",
    "kusumaagrowisata":"images/Kusuma Agrowisata.jpg",

    "airterjuncobanrondo":"images/Air Terjun Coban Rondo.webp",
    "cobanrondo":"images/Coban Rondo.jpg",
    "cobantalun":"images/COBAN TALUN.jpg",
    "cobanpelangi":"images/Coban Pelangi.jpeg",
    "cobantrisula":"images/Coban Trisula.png",

    "pantaitigawarna":"images/Pantai Tiga Warna.webp",
    "pantaigoacina":"images/Pantai Goa Cina.jpg",
    "pantaingliyep":"images/Pantai Ngliyep.jpg",
    "pantaibalekambang":"images/Pantai Balekembang.webp",
    "pantaitelukasmara":"images/Pantai Teluk Asmara.jpg",
    "pantaisendangbiru":"images/Pantai Sendang Biru.jpg",
    "pantaiwatuleter":"images/Pantai Watu Leter.jpg",
    "pantaibatubengkung":"images/Pantai Batu Bengkung.jpg",

    "sumbersirah":"images/Sumber Sira.jpg",
    "sumbermaron":"images/Sumber Maron.jpg",
    "sumberjenon":"images/Sumber Jenon.jpg",

    "kayutanganheritage":"images/Kayutangan Heritage.jpg",
    "malangcreativecenter":"images/Malang Creative Center.jpg",

    "alunalunkotamalang":"images/Alun-Alun Kota Malang.jpg",
    "alunaluntugu":"images/Alun-Alun Tugu.webp",

    "kampungarema":"images/Kampung Arema.jpg",
    "museumangkut":"images/Museum Angkut.jpg",
    "museumbrawijaya":"images/Museum Brawijaya.jpg",
    "kampungwarnawarnijodipan":"images/kampung warna warni.webp",

    "predatorfunpark":"images/predator fun park_.jpg",

    "bukitkuneer":"images/Bukit Kuneer.webp",
    "bukitnirwana":"images/Bukit Nirwana.jpg",
    "bukitparalayangbatu":"images/Bukit Paralayang Batu.jpeg",
    "bukitteletubbiesbromo":"images/Bukit Teletubbies Bromo.webp",

    "bromo":"images/bromo.jpg",

    "bumiperkemahanbedengan":"images/Bumi Perkemahan Bedengan1.jpg",
    "ledokombocampground":"images/Ledok Ombo Camp Ground.jpg",

    "desawisatangadas":"images/Desa Wisata Ngadas.jpg",

    "batulovegarden":"images/Batu Love Garden.jpg",
    "batulovegardenbaloga":"images/Batu Love Garden.jpg",

    "thebagongadventuremuseumtubuh":"images/museum tubuh.webp",
    "museumtubuh":"images/museum tubuh.webp",

    "lembahindahmalang":"images/Lembah Indah Malang.webp",
    "tamanrekreasisengkaling":"images/Taman Rekreasi Sengkaling.png",

    "lumbungstroberiponcokusumo":"images/Lumbung Stroberi Poncokusumo.jpg",

    "malangnightparadise":"images/Malang Night Paradise.jpg",
    "kampungtopengmalangan":"images/Kampung Topeng Malangan.jpg",
    "museummusikindonesia":"images/Museum Musik Indonesia.jpg",
    "mpupurwamuseum":"images/Mpu Purwa Museum.jpg",
    "wenditwaterparksumberair":"images/Wendit Waterpark.jpg",
    "kidsplaygroundhawaimall":"images/Kids Playground Hawai Mall.jpg"
  };

  if(manual[target]) return manual[target];

  for(let key in photos){
    if(normalNama(key) === target){
      return photos[key];
    }
  }

  for(let key in photos){

    const db = normalNama(key);

    if(db.includes(target) || target.includes(db)){
      return photos[key];
    }
  }

  return "images/default.jpg";
}

/* =========================================
RENDER DATA FIX ANTI KEDIP
========================================= */
function renderData(data){

  const box = document.getElementById("wisataList");
  if(!box) return;

  box.innerHTML = "";

  const fragment = document.createDocumentFragment();

  data.forEach((item,index)=>{

    const nama = getNama(item);
    const harga = getHarga(item);
    const rating = getRating(item);
    const kategori = getKategori(item);
    const jam = getJam(item);
    const gambar = cariFoto(nama);

    const card = document.createElement("div");
    card.className = "card";

    card.onclick = ()=> bukaDetail(index);

    const img = new Image();
    img.src = gambar;

    img.onload = ()=>{

      card.innerHTML = `
        <img src="${gambar}">

        <div class="card-body">

          <h3>${nama}</h3>

          <div class="info">
            <span>⭐ ${rating}</span>
            <span>💰 Rp ${harga.toLocaleString("id-ID")}</span>
          </div>

          <div class="info">
            <span>🕒 ${jam}</span>
          </div>

          <div class="badge">${kategori}</div>

        </div>
      `;
    };

    img.onerror = ()=>{

      card.innerHTML = `
        <img src="images/default.jpg">

        <div class="card-body">

          <h3>${nama}</h3>

          <div class="info">
            <span>⭐ ${rating}</span>
            <span>💰 Rp ${harga.toLocaleString("id-ID")}</span>
          </div>

          <div class="info">
            <span>🕒 ${jam}</span>
          </div>

          <div class="badge">${kategori}</div>

        </div>
      `;
    };

    fragment.appendChild(card);

  });

  box.appendChild(fragment);
}

/* =========================================
SEARCH
========================================= */
function cariDestinasi(){

  const input = document.getElementById("searchBox");
  if(!input) return;

  const key = input.value.toLowerCase().trim();

  if(key === ""){
    renderData(semuaData);
    return;
  }

  const hasil = semuaData.filter(item =>
    getNama(item).toLowerCase().includes(key)
  );

  renderData(hasil);
}

/* =========================================
LANGUAGE
========================================= */
function changeLanguage(){

  const lang = document.getElementById("language").value;

  if(lang === "en"){
    titleText.innerText = "Plan Your Vacation";
    detailText.innerText = "Destination Details";
    searchBox.placeholder = "Search destination...";
  }else{
    titleText.innerText = "Rencanakan Liburan";
    detailText.innerText = "Detail Destinasi";
    searchBox.placeholder = "Cari destinasi...";
  }
}

/* =========================================
NAVIGASI
========================================= */
function bukaDetail(id){

  localStorage.setItem(
    "detailWisata",
    JSON.stringify(semuaData[id])
  );

  location.href = "detail.html?id=" + id;
}

function bukaProfil(){
  popupProfil.style.display = "flex";
}

function tutupProfil(){
  popupProfil.style.display = "none";
}

function bukaSearchPage(){
  location.href = "search.html";
}

/* =========================================
RUN
========================================= */
window.onload = loadData;

document.addEventListener("DOMContentLoaded",()=>{

  const input = document.getElementById("searchBox");

  if(input){
    input.addEventListener("keyup", cariDestinasi);
  }
});