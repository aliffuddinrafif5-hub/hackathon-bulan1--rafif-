const $ = s => document.querySelector(s);
const rp = n => "Rp" + Math.round(n).toLocaleString("id-ID");
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
function toast(t) { const e = $("#toast"); e.textContent = t; e.classList.add("show"); setTimeout(() => e.classList.remove("show"), 2400); }

/* ---------- Katalog ---------- */
const EMOJI = { Bakso: "🍜", Tambahan: "🥟", Minuman: "🧋" };
let produk = load("produk", [
  { id: 1, nama: "Bakso Urat", harga: 15000, kat: "Bakso" },
  { id: 2, nama: "Bakso Halus", harga: 13000, kat: "Bakso" },
  { id: 3, nama: "Bakso Telur", harga: 17000, kat: "Bakso" },
  { id: 4, nama: "Mie Ayam Bakso", harga: 18000, kat: "Bakso" },
  { id: 5, nama: "Tahu Bakso", harga: 4000, kat: "Tambahan" },
  { id: 6, nama: "Pangsit Goreng", harga: 3000, kat: "Tambahan" },
  { id: 7, nama: "Es Teh Manis", harga: 5000, kat: "Minuman" },
  { id: 8, nama: "Es Jeruk", harga: 6000, kat: "Minuman" }
]);
let kat = "Semua", cart = {};

function renderFilter() {
  $("#filter").innerHTML = ["Semua", "Bakso", "Tambahan", "Minuman"]
    .map(k => `<button class="chip ${k === kat ? "on" : ""}" data-k="${k}">${k}</button>`).join("");
}
function renderGrid() {
  const q = $("#cari").value.toLowerCase();
  const list = produk.filter(p => (kat === "Semua" || p.kat === kat) && p.nama.toLowerCase().includes(q));
  $("#grid").innerHTML = list.length ? list.map(p => `
    <div class="card"><span class="em">${EMOJI[p.kat] || "🍽️"}</span>
      <h3>${p.nama}</h3><span class="price">${rp(p.harga)}</span>
      <div class="row"><button data-add="${p.id}">Tambah</button><button class="del" data-del="${p.id}" aria-label="Hapus ${p.nama}">✕</button></div>
    </div>`).join("") : "<p>Menu tidak ditemukan. Coba kata kunci lain.</p>";
}
function renderCart() {
  const ids = Object.keys(cart);
  $("#cartList").innerHTML = ids.length ? ids.map(id => {
    const p = produk.find(x => x.id == id);
    return `<li><span>${p.nama}</span><span class="qty"><button data-m="${id}">−</button><span>${cart[id]}</span><button data-p="${id}">+</button></span></li>`;
  }).join("") : '<li class="empty">Belum ada menu dipilih.</li>';
  $("#cartTotal").textContent = rp(ids.reduce((s, id) => s + produk.find(x => x.id == id).harga * cart[id], 0));
}
$("#filter").onclick = e => { if (e.target.dataset.k) { kat = e.target.dataset.k; renderFilter(); renderGrid(); } };
$("#cari").oninput = renderGrid;
$("#grid").onclick = e => {
  const a = e.target.dataset.add, d = e.target.dataset.del;
  if (a) { cart[a] = (cart[a] || 0) + 1; renderCart(); }
  if (d && confirm("Hapus menu ini dari katalog?")) { produk = produk.filter(p => p.id != d); delete cart[d]; save("produk", produk); renderGrid(); renderCart(); }
};
$("#cartList").onclick = e => {
  const p = e.target.dataset.p, m = e.target.dataset.m;
  if (p) cart[p]++;
  if (m && --cart[m] <= 0) delete cart[m];
  renderCart();
};
$("#formMenu").onsubmit = e => {
  e.preventDefault();
  produk.push({ id: Date.now(), nama: $("#mNama").value.trim(), harga: +$("#mHarga").value, kat: $("#mKat").value });
  save("produk", produk); e.target.reset(); renderGrid(); toast("Menu ditambahkan");
};

/* ---------- Antrian ---------- */
let antrian = load("antrian", []);
function renderQueue() {
  const now = antrian.find(a => a.status === "dilayani");
  $("#nowServing").textContent = now ? "#" + now.no : "–";
  $("#queueList").innerHTML = antrian.length ? antrian.map(a => `
    <li class="${a.status}"><b>#${a.no}</b> ${a.nama}<small>${a.items} item · ${rp(a.total)}</small><small>${a.status}</small></li>`).join("")
    : '<li>Belum ada antrian. Pesan dari katalog untuk mengambil nomor.</li>';
  save("antrian", antrian);
}
$("#pesan").onclick = () => {
  const ids = Object.keys(cart);
  if (!ids.length) return toast("Pilih menu dulu");
  const nama = $("#nama").value.trim() || "Pelanggan";
  const total = ids.reduce((s, id) => s + produk.find(x => x.id == id).harga * cart[id], 0);
  const items = ids.reduce((s, id) => s + cart[id], 0);
  const no = (antrian.length ? antrian[antrian.length - 1].no : 0) + 1;
  antrian.push({ no, nama, total, items, status: "menunggu" });
  cart = {}; $("#nama").value = ""; renderCart(); renderQueue();
  toast(`Nomor antrian kamu: #${no}`);
};
$("#next").onclick = () => {
  const now = antrian.find(a => a.status === "dilayani"); if (now) now.status = "selesai";
  const nx = antrian.find(a => a.status === "menunggu");
  renderQueue(); toast(nx ? "" : "Antrian kosong");
  if (nx) { nx.status = "dilayani"; renderQueue(); toast(`Panggil nomor #${nx.no}`); }
};
$("#resetQ").onclick = () => { if (confirm("Hapus semua antrian hari ini?")) { antrian = []; renderQueue(); } };

/* ---------- Kalkulator biaya ---------- */
let bahan = load("bahan", [
  { n: "Daging sapi giling", h: 120000, p: 0.08 },
  { n: "Mie / bihun", h: 15000, p: 0.1 },
  { n: "Bumbu & kuah", h: 40000, p: 0.05 },
  { n: "Sayur & pelengkap", h: 20000, p: 0.05 },
  { n: "Gas, mangkok, kemasan", h: 5000, p: 1 }
]);
function renderBahan() {
  $("#bahan").innerHTML = '<div class="bahan-row bahan-head"><span>Bahan</span><span>Harga beli (Rp)</span><span>Pakai per porsi</span></div>' +
    bahan.map((b, i) => `<div class="bahan-row"><span>${b.n}</span>
      <input type="number" min="0" value="${b.h}" data-i="${i}" data-f="h" aria-label="Harga ${b.n}">
      <input type="number" min="0" step="0.01" value="${b.p}" data-i="${i}" data-f="p" aria-label="Pemakaian ${b.n}"></div>`).join("");
  hitung();
}
function hitung() {
  const hpp = bahan.reduce((s, b) => s + b.h * b.p, 0), m = +$("#margin").value || 0, jual = hpp * (1 + m / 100);
  $("#hpp").textContent = rp(hpp); $("#saran").textContent = rp(Math.ceil(jual / 500) * 500);
  $("#untung").textContent = rp(Math.ceil(jual / 500) * 500 - hpp);
}
$("#bahan").oninput = e => { const { i, f } = e.target.dataset; if (i) { bahan[i][f] = +e.target.value; save("bahan", bahan); hitung(); } };
$("#margin").oninput = hitung;

/* ---------- Pitch deck ---------- */
let sl = 0; const slides = [...document.querySelectorAll(".slide")];
function show(n) {
  sl = (n + slides.length) % slides.length;
  slides.forEach((s, i) => s.classList.toggle("on", i === sl));
  $("#pg").textContent = `${sl + 1} / ${slides.length}`;
}
$("#nxt").onclick = () => show(sl + 1);
$("#prev").onclick = () => show(sl - 1);
document.addEventListener("keydown", e => { if (e.key === "ArrowRight") show(sl + 1); if (e.key === "ArrowLeft") show(sl - 1); });

renderFilter(); renderGrid(); renderCart(); renderQueue(); renderBahan();
