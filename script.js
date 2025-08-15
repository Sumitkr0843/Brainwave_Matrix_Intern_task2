/* ------------------------------
   UTIL & STATE
------------------------------ */
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const state = {
  products: [
    // Swap these image URLs with your exact assets to make it pixel-perfect
    { id: 1,  name: "Chocolate Cake",       price: 35.00, img: "https://i.pinimg.com/1200x/71/47/26/7147269f1c6d9baf1263cfbe18ce937d.jpg" },
    { id: 2,  name: "Strawberry Cupcake",   price: 4.00,  img:"https://i.pinimg.com/1200x/78/e4/ba/78e4ba593d3b763afcacddd384b50c00.jpg"},
    { id: 3,  name: "Glazed Donut",         price: 2.00,  img: "https://i.pinimg.com/736x/e0/99/d7/e099d71734470ca70f4ae0a67c5de898.jpg" },
    { id: 4,  name: "Macarons Assorted",    price: 1.50,  img: "https://i.pinimg.com/1200x/5c/3b/30/5c3b3081266dcbad49a5f3c9439389d1.jpg" },
    { id: 5,  name: "Rustic Bread Loaf",    price: 3.00,  img: "https://i.pinimg.com/1200x/43/7e/29/437e2915f6e306321d38a3b3204c88d9.jpg" },
    { id: 6,  name: "Blueberry Cheesecake", price: 5.50,  img: "https://i.pinimg.com/1200x/b5/62/2f/b5622fa55f21f2b2b503ba27ed67fe40.jpg" },
    { id: 7,  name: "Chocolate Muffin",     price: 2.00,  img: "https://i.pinimg.com/1200x/c4/5e/e1/c45ee159c63686dfd15665793af84d38.jpg" },
    { id: 8,  name: "Strawberry Tart",      price: 4.50,  img: "https://i.pinimg.com/736x/b6/58/d8/b658d81c77690fedf1ac200a559e5a47.jpg" },
    { id: 9,  name: "Vanilla Cupcake",      price: 3.50,  img: "https://i.pinimg.com/736x/63/8a/39/638a39dfa173cc37f2d980cda7639c09.jpg" },
    { id:10,  name: "Walnut Brownie",       price: 2.75,  img: "https://i.pinimg.com/736x/7c/de/ca/7cdecaa1bcec9ea8c5f7d6ea27d44f61.jpg" },
    { id:11,  name: "Choco Chip Cookie",    price: 1.80,  img: "https://i.pinimg.com/1200x/11/33/a7/1133a7302f65a10d38995446be3e07ac.jpg" },
    { id:12,  name: "Red Velvet Slice",     price: 4.80,  img: "https://i.pinimg.com/1200x/c0/d4/90/c0d4905ece6a5a548a58f71989788dad.jpg" },
  ],
  shown: 8,
  cart: {}
};

/* ------------------------------
   NAV / BURGER
------------------------------ */
const burger = $("#burger");
const navLinks = $(".nav__links");
if (burger){
  burger.addEventListener("click", () => {
    const open = navLinks.style.display === "flex";
    navLinks.style.display = open ? "none" : "flex";
  });
}

/* ------------------------------
   YEAR FOOTER
------------------------------ */
$("#year").textContent = new Date().getFullYear();

/* ------------------------------
   CATEGORIES: SHOW MORE
------------------------------ */
$("#showMoreCats").addEventListener("click", () => {
  const grid = $("#catGrid");
  // Add 3 more similar tiles (for the “more like screenshot but extended” look)
  const extra = [
    {t:"Party Platters",img:"https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=800&auto=format&fit=crop"},
    {t:"Breakfast Bakes",img:"https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=800&auto=format&fit=crop"},
    {t:"Festive Specials",img:"https://images.unsplash.com/photo-1541782814455-55b8d6dc0c67?q=80&w=800&auto=format&fit=crop"},
  ];
  extra.forEach(e=>{
    const card = document.createElement("article");
    card.className = "cat-card";
    card.innerHTML = `
      <img src="${e.img}" alt="${e.t}">
      <div class="cat-card__body">
        <h3>${e.t}</h3>
        <p>Handpicked favorites</p>
        <a href="#shop" class="btn btn--small">Shop Now</a>
      </div>`;
    grid.appendChild(card);
  });
  $("#showMoreCats").disabled = true;
  $("#showMoreCats").textContent = "All categories shown";
});

/* ------------------------------
   SHOP: RENDER PRODUCTS
------------------------------ */
const productGrid = $("#productGrid");
function fmt(n){ return "$" + n.toFixed(2); }

function renderProducts() {
  const term = $("#searchInput").value.trim().toLowerCase();
  const sort = $("#sortSelect").value;

  let items = state.products.filter(p => p.name.toLowerCase().includes(term));

  if (sort === "low") items.sort((a,b)=>a.price-b.price);
  if (sort === "high") items.sort((a,b)=>b.price-a.price);
  if (sort === "az") items.sort((a,b)=>a.name.localeCompare(b.name));
  if (sort === "za") items.sort((a,b)=>b.name.localeCompare(a.name));

  const slice = items.slice(0, state.shown);

  productGrid.innerHTML = "";
  slice.forEach(p => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="product-card__body">
        <h4 class="product-card__title">${p.name}</h4>
        <div class="product-card__meta">
          <span class="product-card__price">${fmt(p.price)}</span>
          <button class="btn btn--ivory product-card__btn" data-id="${p.id}">Add</button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });

  $("#loadMore").style.display = items.length > state.shown ? "inline-flex" : "none";
}
renderProducts();

$("#searchInput").addEventListener("input", ()=>{ state.shown = 8; renderProducts(); });
$("#sortSelect").addEventListener("change", ()=>{ state.shown = 8; renderProducts(); });
$("#loadMore").addEventListener("click", ()=>{ state.shown += 8; renderProducts(); });

/* Add to cart (event delegation) */
productGrid.addEventListener("click", (e)=>{
  const btn = e.target.closest("[data-id]");
  if (!btn) return;
  const id = +btn.dataset.id;
  state.cart[id] = (state.cart[id] || 0) + 1;
  updateCartBadge();
  renderCart();
});

/* ------------------------------
   CART
------------------------------ */
const cartDrawer = $("#cartDrawer");
const overlay = $("#overlay");
$("#openCart").addEventListener("click", openCart);
$("#closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

function openCart(){ cartDrawer.classList.add("open"); overlay.classList.add("active"); }
function closeCart(){ cartDrawer.classList.remove("open"); overlay.classList.remove("active"); }

function updateCartBadge(){
  const count = Object.values(state.cart).reduce((a,b)=>a+b,0);
  $("#cartCount").textContent = count;
}

function renderCart(){
  const wrap = $("#cartItems");
  wrap.innerHTML = "";
  let subtotal = 0;

  Object.entries(state.cart).forEach(([id, qty])=>{
    const prod = state.products.find(p=>p.id===+id);
    if (!prod) return;
    subtotal += prod.price * qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${prod.img}" alt="${prod.name}">
      <div>
        <h4>${prod.name}</h4>
        <div class="ci__price">${fmt(prod.price)}</div>
      </div>
      <div class="ci__qty">
        <button class="qty-btn" data-act="dec" data-id="${id}">−</button>
        <span>${qty}</span>
        <button class="qty-btn" data-act="inc" data-id="${id}">+</button>
      </div>
    `;
    wrap.appendChild(row);
  });

  $("#cartSubtotal").textContent = fmt(subtotal);
}
renderCart(); updateCartBadge();

/* Quantity buttons */
$("#cartItems").addEventListener("click",(e)=>{
  const btn = e.target.closest(".qty-btn");
  if (!btn) return;
  const id = +btn.dataset.id;
  const act = btn.dataset.act;
  if (act==="inc") state.cart[id] = (state.cart[id]||0) + 1;
  if (act==="dec") {
    state.cart[id] = (state.cart[id]||0) - 1;
    if (state.cart[id] <= 0) delete state.cart[id];
  }
  updateCartBadge(); renderCart();
});

/* Checkout demo */
$("#checkoutBtn").addEventListener("click", ()=>{
  if (!Object.keys(state.cart).length) { alert("Your cart is empty."); return; }
  alert("Checkout is a demo in this template. Hook up your payment later.");
});

/* Contact form demo */
$("#contactForm").addEventListener("submit",(e)=>{
  e.preventDefault();
  alert("Thanks for reaching out! We'll get back to you soon.");
  e.target.reset();
});