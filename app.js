/* ==========================================================
   FreshBite — APP LOGIC (state, router, views)
   ========================================================== */

/* ---------------- STATE ---------------- */
const STORAGE_KEY = "freshbite_state_v1";
function defaultState(){
  return { cart:[], wishlist:[], user:null, orders:[], nextCartId:1, nextOrderId:9001 };
}
let STATE = loadState();

function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return Object.assign(defaultState(), JSON.parse(raw));
  }catch(e){}
  return defaultState();
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
  updateCartCount();
}
function updateCartCount(){
  const n = STATE.cart.reduce((s,c)=>s+c.qty,0);
  document.getElementById("cartCount").textContent = n;
}

/* ---------------- TOAST ---------------- */
function toast(msg, icon){
  const wrap = document.getElementById("toast-wrap");
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<span>${icon||"✅"}</span><span>${msg}</span>`;
  wrap.appendChild(el);
  setTimeout(()=>{ el.style.opacity="0"; el.style.transition="opacity .3s"; setTimeout(()=>el.remove(),300); }, 2400);
}

/* ---------------- ROUTER ---------------- */
function navigate(path){ window.location.hash = "#"+path; }
function goAccount(){ navigate(STATE.user ? "/account" : "/login"); }

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", ()=>{ updateCartCount(); render(); });

function parseHash(){
  let h = window.location.hash.replace(/^#/,"") || "/home";
  const parts = h.split("/").filter(Boolean);
  return { route: parts[0]||"home", param: parts[1] };
}

function render(){
  const { route, param } = parseHash();
  document.querySelectorAll(".nav-links a").forEach(a=>{
    a.classList.toggle("active", a.dataset.route===route);
  });
  document.getElementById("navLinks").classList.remove("open");
  document.getElementById("acctBtn").title = STATE.user ? ("Account: "+STATE.user.name) : "Login";

  const app = document.getElementById("app");
  let html = "";
  switch(route){
    case "home": html = viewHome(); break;
    case "restaurants": html = viewRestaurants(); break;
    case "menu": html = viewMenu(param); break;
    case "product": html = viewProduct(param); break;
    case "cart": html = viewCart(); break;
    case "checkout": html = viewCheckout(); break;
    case "order-confirmation": html = viewOrderConfirmation(param); break;
    case "account": html = viewAccount(); break;
    case "login": html = viewLogin(); break;
    case "about": html = viewAbout(); break;
    case "contact": html = viewContact(); break;
    default: html = viewHome();
  }
  app.innerHTML = html;
  window.scrollTo({top:0, behavior:"instant"});
  afterRender(route, param);
}

function afterRender(route, param){
  if(route==="menu") applyMenuFilter("All");
  if(route==="cart") renderCartSummary();
  if(route==="checkout") selectPayment("card");
  if(route==="account") showAccountTab(window._acctTab || "orders");
  if(route==="login") showAuthTab(window._authTab || "login");
}

/* ---------------- HELPERS ---------------- */
function stars(rating){
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5-full);
}
function dietStamp(d){
  const map = { "Veg":["V","stamp-veg"], "Non-Veg":["N","stamp-nonveg"], "Vegan":["VG","stamp-vegan"], "Gluten-Free":["GF","stamp-gf"] };
  const [label,cls] = map[d] || ["?",""];
  return `<span class="stamp ${cls}" title="${d}">${label}</span>`;
}
function priceStr(p){ return "₹"+p; }
function money(n){ return "₹"+Math.round(n).toLocaleString("en-IN"); }

function cartLineTotal(){
  return STATE.cart.reduce((sum,c)=>{
    const item = getMenuItem(c.itemId);
    return sum + (item?item.price*c.qty:0);
  },0);
}

/* ================= HOME ================= */
function viewHome(){
  const featured = MENU_ITEMS.filter(m=>[101,201,301,501,605,203].includes(m.id));
  return `
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <span class="eyebrow">FRESH • FAST • FROM YOUR FAVORITE KITCHENS</span>
        <h1>Real food,<br><em>real fast,</em><br>right to your door.</h1>
        <p class="hero-sub">Browse local restaurants, build your plate, and track it from the wok to your doorstep — all before your stomach notices you're waiting.</p>
        <div class="hero-actions">
          <button class="btn btn-primary" onclick="navigate('/restaurants')">Order Now →</button>
          <button class="btn btn-outline" onclick="navigate('/about')">Our Story</button>
        </div>
        <div class="hero-stats">
          <div><b>${RESTAURANTS.length}+</b><span>Partner kitchens</span></div>
          <div><b>${MENU_ITEMS.length}+</b><span>Dishes on the menu</span></div>
          <div><b>4.5★</b><span>Average rating</span></div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="plate p1">🍕</div>
        <div class="plate p2">🌮</div>
        <div class="plate p3">🍔</div>
      </div>
    </div>
  </section>
  <div class="scallop scallop-cream"></div>

  <section class="section">
    <div class="container">
      <div class="section-head"><div><span class="eyebrow">Cravings, sorted</span><h2>Shop by cuisine</h2></div></div>
      <div class="cat-row">
        ${CATEGORIES.map(c=>`
          <div class="cat-card" onclick="navigate('/restaurants'); setTimeout(()=>filterByCuisine('${c.name}'),30)">
            <div class="ic">${c.ic}</div><span>${c.name}</span>
          </div>`).join("")}
      </div>
    </div>
  </section>

  <section class="section" style="background:var(--cream-dim)">
    <div class="container">
      <div class="section-head">
        <div><span class="eyebrow">Hot right now</span><h2>Featured dishes</h2></div>
        <button class="btn btn-ghost btn-sm" onclick="navigate('/restaurants')">See all restaurants</button>
      </div>
      <div class="grid grid-3">
        ${featured.map(m=>menuCardHTML(m)).join("")}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head"><div><span class="eyebrow">Limited time</span><h2>Special offers</h2></div></div>
      <div class="grid grid-3">
        ${COUPONS.map(c=>`
          <div class="offer-card">
            <div style="font-size:34px;">${c.freeDelivery?"🚚":"🏷️"}</div>
            <h3 style="color:#fff;margin-top:10px;">${c.desc}</h3>
            <p style="color:rgba(255,255,255,.85);margin:0;">${c.minOrder?("On orders above "+money(c.minOrder)):"No minimum order"}</p>
            <span class="code">${c.code}</span>
          </div>`).join("")}
      </div>
    </div>
  </section>
  `;
}

/* ================= RESTAURANT LISTING ================= */
window._restFilters = { cuisine:"All", rating:0, price:0 };
function filterByCuisine(name){
  window._restFilters.cuisine = name;
  const sel = document.getElementById("cuisineSelect");
  if(sel) sel.value = name;
  renderRestaurantGrid();
}
function applyRestFilters(){
  window._restFilters.cuisine = document.getElementById("cuisineSelect").value;
  window._restFilters.rating = Number(document.getElementById("ratingSelect").value);
  window._restFilters.price = Number(document.getElementById("priceSelect").value);
  renderRestaurantGrid();
}
function renderRestaurantGrid(){
  const f = window._restFilters;
  let list = RESTAURANTS.filter(r=>{
    if(f.cuisine!=="All" && r.cuisine!==f.cuisine) return false;
    if(r.rating < f.rating) return false;
    if(f.price && r.priceRange!==f.price) return false;
    return true;
  });
  const grid = document.getElementById("restGrid");
  grid.innerHTML = list.length ? list.map(restCardHTML).join("") : `
    <div class="empty-state" style="grid-column:1/-1;">
      <div class="ic">🍽️</div><h3>No restaurants match those filters</h3>
      <p>Try widening your search.</p>
    </div>`;
}
function restCardHTML(r){
  return `
  <div class="card" onclick="navigate('/menu/${r.id}')" style="cursor:pointer;">
    <div class="card-media">${r.emoji}
      ${r.tags[0] ? `<span class="badge">${r.tags[0]}</span>` : ""}
    </div>
    <div class="card-body">
      <div class="card-title">${r.name}</div>
      <div class="card-desc">${r.desc}</div>
      <div class="card-meta">
        <span class="rating">★ ${r.rating}</span>
        <span>${r.cuisine}</span>
        <span>•</span><span>${"₹".repeat(r.priceRange)}</span>
        <span>•</span><span>${r.deliveryTime}</span>
      </div>
    </div>
  </div>`;
}
function viewRestaurants(){
  window._restFilters = { cuisine:"All", rating:0, price:0 };
  const cuisines = ["All", ...new Set(RESTAURANTS.map(r=>r.cuisine))];
  return `
  <section class="page-hero container">
    <span class="eyebrow">Choose your kitchen</span>
    <h1>All restaurants</h1>
    <p style="color:var(--brown-soft);max-width:520px;margin:0 auto;">Filter by cuisine, rating or price to find tonight's dinner.</p>
  </section>
  <div class="container section" style="padding-top:10px;">
    <div class="filter-bar">
      <select id="cuisineSelect" onchange="applyRestFilters()">
        ${cuisines.map(c=>`<option value="${c}">${c}</option>`).join("")}
      </select>
      <select id="ratingSelect" onchange="applyRestFilters()">
        <option value="0">Any rating</option>
        <option value="4">4★ & up</option>
        <option value="4.5">4.5★ & up</option>
      </select>
      <select id="priceSelect" onchange="applyRestFilters()">
        <option value="0">Any price</option>
        <option value="1">₹ Budget</option>
        <option value="2">₹₹ Moderate</option>
        <option value="3">₹₹₹ Premium</option>
      </select>
    </div>
    <div class="grid grid-3" id="restGrid">${RESTAURANTS.map(restCardHTML).join("")}</div>
  </div>`;
}

/* ================= MENU PAGE ================= */
window._menuFilter = "All";
function applyMenuFilter(diet){
  const gridEl = document.getElementById("menuGrid");
  if(!gridEl) return;
  window._menuFilter = diet;
  document.querySelectorAll(".diet-chip").forEach(c=>c.classList.toggle("active", c.dataset.diet===diet));
  const rid = window._currentRestaurantId;
  let items = getMenuByRestaurant(rid);
  if(diet!=="All") items = items.filter(m=>m.dietary===diet);
  gridEl.innerHTML = items.length ? items.map(menuCardHTML).join("") : `
    <div class="empty-state" style="grid-column:1/-1;"><div class="ic">🍽️</div><h3>No ${diet} items here</h3><p>Try a different filter.</p></div>`;
}
function menuCardHTML(m){
  const r = getRestaurant(m.restaurantId);
  const inCart = STATE.cart.find(c=>c.itemId===m.id);
  const wished = STATE.wishlist.includes(m.id);
  return `
  <div class="card">
    <div class="card-media" style="cursor:pointer;" onclick="navigate('/product/${m.id}')">${m.emoji}
      ${m.spice>=2?'<span class="badge" style="background:var(--tomato)">🌶 Spicy</span>':""}
      <button class="wish-btn ${wished?"active":""}" onclick="event.stopPropagation();toggleWishlist(${m.id})">${wished?"♥":"♡"}</button>
    </div>
    <div class="card-body">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
        <div class="card-title" style="cursor:pointer;" onclick="navigate('/product/${m.id}')">${m.name}</div>
        ${dietStamp(m.dietary)}
      </div>
      <div class="card-desc">${m.desc}</div>
      <div class="card-meta"><span class="rating">★ ${m.rating}</span>${r?`<span>${r.name}</span>`:""}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;">
        <span class="price-tag">${money(m.price)}</span>
        ${inCart ? `
          <div class="stepper">
            <button onclick="changeQtyByItem(${m.id},-1)">−</button>
            <span>${inCart.qty}</span>
            <button onclick="changeQtyByItem(${m.id},1)">+</button>
          </div>` : `<button class="btn btn-primary btn-sm" onclick="addToCart(${m.id})">Add +</button>`}
      </div>
    </div>
  </div>`;
}
function viewMenu(restaurantId){
  const r = getRestaurant(restaurantId);
  if(!r) return `<div class="container section"><div class="empty-state"><div class="ic">🔍</div><h3>Restaurant not found</h3><button class="btn btn-primary" onclick="navigate('/restaurants')">Back to restaurants</button></div></div>`;
  window._currentRestaurantId = r.id;
  window._menuFilter = "All";
  const diets = ["All","Veg","Non-Veg","Vegan","Gluten-Free"];
  return `
  <section style="background:var(--cream-dim);padding:36px 0;">
    <div class="container" style="display:flex;gap:20px;align-items:center;flex-wrap:wrap;">
      <div style="font-size:64px;">${r.emoji}</div>
      <div style="flex:1;min-width:200px;">
        <span class="eyebrow">${r.cuisine} · ${"₹".repeat(r.priceRange)}</span>
        <h1 style="margin:4px 0;">${r.name}</h1>
        <p style="color:var(--brown-soft);max-width:560px;">${r.desc}</p>
        <div class="card-meta"><span class="rating">★ ${r.rating}</span><span>${r.deliveryTime}</span><span>•</span><span>Min order ${money(r.minOrder)}</span></div>
      </div>
    </div>
  </section>
  <div class="container section">
    <div class="tab-row">
      ${diets.map(d=>`<button class="chip diet-chip ${d==='All'?'active':''}" data-diet="${d}" onclick="applyMenuFilter('${d}')">${d}</button>`).join("")}
    </div>
    <div class="grid grid-3" id="menuGrid">${getMenuByRestaurant(r.id).map(menuCardHTML).join("")}</div>
  </div>`;
}

/* ================= PRODUCT DETAIL ================= */
function viewProduct(id){
  const m = getMenuItem(id);
  if(!m) return `<div class="container section"><div class="empty-state"><div class="ic">🔍</div><h3>Dish not found</h3></div></div>`;
  const r = getRestaurant(m.restaurantId);
  const inCart = STATE.cart.find(c=>c.itemId===m.id);
  const wished = STATE.wishlist.includes(m.id);
  const related = getMenuByRestaurant(m.restaurantId).filter(x=>x.id!==m.id).slice(0,3);
  const avgRating = m.reviews.length ? (m.reviews.reduce((s,r)=>s+r.rating,0)/m.reviews.length).toFixed(1) : m.rating;
  return `
  <div class="container section">
    <a href="#/menu/${r.id}" style="font-weight:700;color:var(--orange-dark);">← Back to ${r.name}</a>
    <div class="two-col" style="margin-top:22px;">
      <div>
        <div class="card-media" style="height:320px;border-radius:var(--radius);font-size:120px;">${m.emoji}</div>
      </div>
      <div>
        <div style="display:flex;gap:10px;align-items:center;">${dietStamp(m.dietary)}<span class="rating">★ ${avgRating}</span>${m.spice>=2?'<span class="badge" style="position:static;background:var(--tomato);">🌶 Spicy</span>':""}</div>
        <h1 style="margin-top:10px;">${m.name}</h1>
        <p style="color:var(--brown-soft);">${m.desc}</p>
        <div style="font-family:var(--mono);font-size:26px;font-weight:700;color:var(--orange-dark);margin:10px 0 20px;">${money(m.price)}</div>

        <div style="display:flex;gap:14px;align-items:center;margin-bottom:24px;flex-wrap:wrap;">
          ${inCart ? `
            <div class="stepper">
              <button onclick="changeQtyByItem(${m.id},-1)">−</button>
              <span>${inCart.qty}</span>
              <button onclick="changeQtyByItem(${m.id},1)">+</button>
            </div>
            <button class="btn btn-dark" onclick="navigate('/cart')">Go to cart</button>
          ` : `<button class="btn btn-primary" onclick="addToCart(${m.id})">Add to cart</button>`}
          <button class="btn btn-outline" onclick="toggleWishlist(${m.id})">${wished?"♥ In wishlist":"♡ Add to wishlist"}</button>
        </div>

        <h3>Ingredients</h3>
        <p style="color:var(--brown-soft);">${m.ingredients.join(", ")}</p>

        <h3 style="margin-top:18px;">Nutritional info</h3>
        <div class="grid grid-4" style="gap:10px;">
          ${Object.entries({Calories:m.nutrition.calories, Protein:m.nutrition.protein, Carbs:m.nutrition.carbs, Fat:m.nutrition.fat}).map(([k,v])=>`
          <div style="background:var(--cream-dim);border-radius:var(--radius-sm);padding:12px;text-align:center;">
            <div style="font-family:var(--mono);font-weight:700;font-size:16px;">${v}</div>
            <div style="font-size:11.5px;color:var(--brown-soft);">${k}</div>
          </div>`).join("")}
        </div>
      </div>
    </div>

    <div style="margin-top:44px;">
      <h2>Customer reviews</h2>
      ${m.reviews.map(rv=>`
        <div class="review">
          <b>${rv.user}</b> <span class="stars">${stars(rv.rating)}</span>
          <p style="margin:4px 0 0;color:var(--brown-soft);">${rv.comment}</p>
        </div>`).join("")}
    </div>

    ${related.length? `
    <div style="margin-top:44px;">
      <h2>More from ${r.name}</h2>
      <div class="grid grid-3">${related.map(menuCardHTML).join("")}</div>
    </div>` : ""}
  </div>`;
}

/* ================= CART LOGIC ================= */
function addToCart(itemId){
  const existing = STATE.cart.find(c=>c.itemId===itemId);
  if(existing){ existing.qty++; }
  else{ STATE.cart.push({ cartId:STATE.nextCartId++, itemId, qty:1 }); }
  saveState();
  toast(getMenuItem(itemId).name+" added to cart","🛒");
  const grid = document.getElementById("menuGrid") || document.getElementById("app");
  rerenderInPlace();
}
function changeQtyByItem(itemId, delta){
  const line = STATE.cart.find(c=>c.itemId===itemId);
  if(!line) return;
  line.qty += delta;
  if(line.qty<=0) STATE.cart = STATE.cart.filter(c=>c.itemId!==itemId);
  saveState();
  rerenderInPlace();
}
function changeQtyByCartId(cartId, delta){
  const line = STATE.cart.find(c=>c.cartId===cartId);
  if(!line) return;
  line.qty += delta;
  if(line.qty<=0) STATE.cart = STATE.cart.filter(c=>c.cartId!==cartId);
  saveState();
  rerenderInPlace();
}
function removeFromCart(cartId){
  STATE.cart = STATE.cart.filter(c=>c.cartId!==cartId);
  saveState();
  toast("Item removed from cart","🗑️");
  rerenderInPlace();
}
function toggleWishlist(itemId){
  if(STATE.wishlist.includes(itemId)){
    STATE.wishlist = STATE.wishlist.filter(id=>id!==itemId);
    toast("Removed from wishlist","💔");
  }else{
    STATE.wishlist.push(itemId);
    toast("Saved to wishlist","♥");
  }
  saveState();
  rerenderInPlace();
}
function rerenderInPlace(){
  // Re-render current view without changing scroll / route, to reflect state changes
  const { route, param } = parseHash();
  const app = document.getElementById("app");
  switch(route){
    case "home": app.innerHTML = viewHome(); break;
    case "restaurants": app.innerHTML = viewRestaurants(); break;
    case "menu": app.innerHTML = viewMenu(param); applyMenuFilter(window._menuFilter||"All"); break;
    case "product": app.innerHTML = viewProduct(param); break;
    case "cart": app.innerHTML = viewCart(); renderCartSummary(); break;
    case "account": app.innerHTML = viewAccount(); showAccountTab(window._acctTab||"orders"); break;
    default: break;
  }
}

window._coupon = null;
function applyCoupon(){
  const codeInput = document.getElementById("couponInput");
  const code = codeInput.value.trim().toUpperCase();
  const c = COUPONS.find(c=>c.code===code);
  const msg = document.getElementById("couponMsg");
  const subtotal = cartLineTotal();
  if(!c){ msg.textContent = "Invalid coupon code."; msg.style.color = "var(--tomato)"; return; }
  if(subtotal < c.minOrder){ msg.textContent = `Add ${money(c.minOrder-subtotal)} more to use this code.`; msg.style.color="var(--tomato)"; return; }
  window._coupon = c;
  msg.textContent = `"${c.code}" applied — ${c.freeDelivery ? "free delivery!" : (c.discount*100)+"% off!"}`;
  msg.style.color = "var(--leaf)";
  renderCartSummary();
}
function removeCoupon(){
  window._coupon = null;
  renderCartSummary();
  const msg = document.getElementById("couponMsg");
  if(msg) msg.textContent = "";
}
function computeTotals(){
  const subtotal = cartLineTotal();
  let discount = 0;
  let deliveryFee = STATE.cart.length ? DELIVERY_FEE : 0;
  if(window._coupon && subtotal >= window._coupon.minOrder){
    if(window._coupon.freeDelivery) deliveryFee = 0;
    else discount = subtotal * window._coupon.discount;
  }
  const tax = (subtotal - discount) * TAX_RATE;
  const total = subtotal - discount + deliveryFee + tax;
  return { subtotal, discount, deliveryFee, tax, total };
}
function renderCartSummary(){
  const el = document.getElementById("cartSummary");
  if(!el) return;
  const t = computeTotals();
  el.innerHTML = `
    <div class="receipt-row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
    ${t.discount>0?`<div class="receipt-row" style="color:var(--leaf)"><span>Discount (${window._coupon.code})</span><span>−${money(t.discount)}</span></div>`:""}
    <div class="receipt-row"><span>Delivery fee</span><span>${t.deliveryFee===0?"FREE":money(t.deliveryFee)}</span></div>
    <div class="receipt-row"><span>Tax (5%)</span><span>${money(t.tax)}</span></div>
    <div class="receipt-row total"><span>Total</span><span>${money(t.total)}</span></div>
  `;
}

function cartLineHTML(c){
  const m = getMenuItem(c.itemId);
  if(!m) return "";
  const r = getRestaurant(m.restaurantId);
  return `
  <div style="display:flex;gap:14px;align-items:center;padding:14px 0;border-bottom:1px solid var(--line);">
    <div style="font-size:38px;">${m.emoji}</div>
    <div style="flex:1;">
      <div style="font-weight:700;">${m.name} ${dietStamp(m.dietary)}</div>
      <div style="font-size:12.5px;color:var(--brown-soft);">${r?r.name:""}</div>
      <div class="price-tag" style="font-size:13px;">${money(m.price)} each</div>
    </div>
    <div class="stepper">
      <button onclick="changeQtyByCartId(${c.cartId},-1)">−</button>
      <span>${c.qty}</span>
      <button onclick="changeQtyByCartId(${c.cartId},1)">+</button>
    </div>
    <div style="width:76px;text-align:right;font-weight:800;">${money(m.price*c.qty)}</div>
    <button class="btn-icon" onclick="removeFromCart(${c.cartId})" title="Remove">✕</button>
  </div>`;
}

function viewCart(){
  if(!STATE.cart.length){
    return `<div class="container section"><div class="empty-state">
      <div class="ic">🛒</div><h3>Your cart is empty</h3>
      <p>Looks like you haven't added anything yet.</p>
      <button class="btn btn-primary" onclick="navigate('/restaurants')">Browse restaurants</button>
    </div></div>`;
  }
  window._coupon = window._coupon || null;
  return `
  <div class="container section">
    <h1>Your cart</h1>
    <div class="two-col">
      <div>
        <div style="background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:6px 20px;">
          ${STATE.cart.map(cartLineHTML).join("")}
        </div>
        <div class="form-group" style="margin-top:20px;display:flex;gap:10px;align-items:flex-end;">
          <div style="flex:1;">
            <label>Have a coupon?</label>
            <input type="text" id="couponInput" placeholder="e.g. WELCOME10">
          </div>
          <button class="btn btn-dark" onclick="applyCoupon()">Apply</button>
        </div>
        <div id="couponMsg" style="font-size:13px;font-weight:700;"></div>
        <p style="font-size:12.5px;color:var(--brown-soft);margin-top:10px;">Try: WELCOME10 · FRESH20 (min ₹500) · FREESHIP</p>
      </div>
      <div>
        <div class="receipt" id="cartSummary"></div>
        <button class="btn btn-primary btn-block" style="margin-top:16px;" onclick="navigate('/checkout')">Proceed to checkout →</button>
      </div>
    </div>
  </div>
  `;
}

/* ================= CHECKOUT ================= */
window._checkoutPayment = "card";
function selectPayment(p){
  window._checkoutPayment = p;
  document.querySelectorAll(".radio-card").forEach(r=>r.classList.toggle("selected", r.dataset.pay===p));
}
function placeOrder(){
  if(!STATE.cart.length){ toast("Your cart is empty","⚠️"); return; }
  const name = document.getElementById("coName").value.trim();
  const phone = document.getElementById("coPhone").value.trim();
  const address = document.getElementById("coAddress").value.trim();
  const slot = document.getElementById("coSlot").value;
  if(!name || !phone || !address){
    toast("Please fill in your delivery details","⚠️");
    return;
  }
  const t = computeTotals();
  const order = {
    id: STATE.nextOrderId++,
    date: new Date().toISOString(),
    items: STATE.cart.map(c=>({ itemId:c.itemId, qty:c.qty, name:getMenuItem(c.itemId).name, price:getMenuItem(c.itemId).price })),
    name, phone, address, slot,
    payment: window._checkoutPayment,
    coupon: window._coupon ? window._coupon.code : null,
    totals: t,
    status: "Placed"
  };
  STATE.orders.unshift(order);
  STATE.cart = [];
  window._coupon = null;
  saveState();
  toast("Order placed! 🎉","🎉");
  navigate("/order-confirmation/"+order.id);
}
function viewCheckout(){
  if(!STATE.cart.length){
    return `<div class="container section"><div class="empty-state"><div class="ic">🧾</div><h3>Nothing to check out</h3><button class="btn btn-primary" onclick="navigate('/restaurants')">Browse restaurants</button></div></div>`;
  }
  const t = computeTotals();
  const savedAddr = STATE.user && STATE.user.addresses && STATE.user.addresses[0];
  return `
  <div class="container section">
    <h1>Checkout</h1>
    <div class="two-col">
      <div>
        <h3>Delivery address</h3>
        <div class="form-group"><label>Full name</label><input id="coName" type="text" value="${STATE.user?STATE.user.name:""}" placeholder="Your name"></div>
        <div class="form-group"><label>Phone number</label><input id="coPhone" type="text" placeholder="10-digit mobile number"></div>
        <div class="form-group"><label>Delivery address</label><textarea id="coAddress" rows="3" placeholder="House no, street, city, PIN">${savedAddr?savedAddr.line:""}</textarea></div>

        <h3 style="margin-top:26px;">Delivery time</h3>
        <div class="form-group">
          <select id="coSlot">${DELIVERY_SLOTS.map(s=>`<option>${s}</option>`).join("")}</select>
        </div>

        <h3 style="margin-top:26px;">Payment method</h3>
        <div class="radio-card selected" data-pay="card" onclick="selectPayment('card')">💳 <div><b>Credit / Debit Card</b><div style="font-size:12px;color:var(--brown-soft);">Simulated — no real charge</div></div></div>
        <div class="radio-card" data-pay="upi" onclick="selectPayment('upi')">📱 <div><b>UPI</b><div style="font-size:12px;color:var(--brown-soft);">Pay via any UPI app (simulated)</div></div></div>
        <div class="radio-card" data-pay="cod" onclick="selectPayment('cod')">💵 <div><b>Cash on Delivery</b><div style="font-size:12px;color:var(--brown-soft);">Pay when your order arrives</div></div></div>
      </div>
      <div>
        <div class="receipt">
          ${STATE.cart.map(c=>{ const m=getMenuItem(c.itemId); return `<div class="receipt-row"><span>${m.name} ×${c.qty}</span><span>${money(m.price*c.qty)}</span></div>`; }).join("")}
          <div class="receipt-row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
          ${t.discount>0?`<div class="receipt-row"><span>Discount</span><span>−${money(t.discount)}</span></div>`:""}
          <div class="receipt-row"><span>Delivery fee</span><span>${t.deliveryFee===0?"FREE":money(t.deliveryFee)}</span></div>
          <div class="receipt-row"><span>Tax</span><span>${money(t.tax)}</span></div>
          <div class="receipt-row total"><span>Total</span><span>${money(t.total)}</span></div>
        </div>
        <button class="btn btn-primary btn-block" style="margin-top:16px;" onclick="placeOrder()">Place order</button>
      </div>
    </div>
  </div>`;
}

function viewOrderConfirmation(orderId){
  const order = STATE.orders.find(o=>o.id===Number(orderId));
  if(!order) return `<div class="container section"><div class="empty-state"><div class="ic">🔍</div><h3>Order not found</h3></div></div>`;
  return `
  <div class="container section" style="max-width:640px;">
    <div class="empty-state" style="padding:20px 0 30px;">
      <div class="ic">🎉</div>
      <h1>Order confirmed!</h1>
      <p>Your order <b>#${order.id}</b> has been placed and the kitchen has been notified.</p>
    </div>
    <div class="receipt">
      <div class="receipt-row"><span>Order ID</span><span>#${order.id}</span></div>
      <div class="receipt-row"><span>Delivery slot</span><span>${order.slot}</span></div>
      <div class="receipt-row"><span>Payment</span><span>${order.payment.toUpperCase()}</span></div>
      ${order.items.map(i=>`<div class="receipt-row"><span>${i.name} ×${i.qty}</span><span>${money(i.price*i.qty)}</span></div>`).join("")}
      <div class="receipt-row total"><span>Total paid</span><span>${money(order.totals.total)}</span></div>
    </div>
    <div style="display:flex;gap:12px;margin-top:20px;">
      <button class="btn btn-outline btn-block" onclick="navigate('/restaurants')">Order more food</button>
      <button class="btn btn-primary btn-block" onclick="navigate('/account')">Track this order</button>
    </div>
  </div>`;
}

/* ================= LOGIN / REGISTER ================= */
function showAuthTab(tab){
  window._authTab = tab;
  document.querySelectorAll(".auth-tab").forEach(b=>b.classList.toggle("active", b.dataset.tab===tab));
  document.getElementById("loginForm").style.display = tab==="login" ? "block":"none";
  document.getElementById("registerForm").style.display = tab==="register" ? "block":"none";
}
function doLogin(){
  const email = document.getElementById("liEmail").value.trim();
  const pass = document.getElementById("liPass").value;
  if(!email || !pass){ toast("Enter your email and password","⚠️"); return; }
  STATE.user = STATE.user && STATE.user.email===email ? STATE.user : { name: email.split("@")[0], email, addresses:[], phone:"" };
  saveState();
  toast("Welcome back!","👋");
  navigate("/account");
}
function doRegister(){
  const name = document.getElementById("reName").value.trim();
  const email = document.getElementById("reEmail").value.trim();
  const pass = document.getElementById("rePass").value;
  if(!name || !email || !pass){ toast("Please fill in all fields","⚠️"); return; }
  STATE.user = { name, email, addresses:[], phone:"" };
  saveState();
  toast("Account created — welcome to FreshBite!","🎉");
  navigate("/account");
}
function logout(){
  STATE.user = null;
  saveState();
  toast("Logged out","👋");
  navigate("/home");
}
function viewLogin(){
  if(STATE.user){
    return `<div class="container section"><div class="empty-state"><div class="ic">👤</div><h3>You're already signed in as ${STATE.user.name}</h3>
    <button class="btn btn-primary" onclick="navigate('/account')">Go to my account</button></div></div>`;
  }
  window._authTab = "login";
  return `
  <div class="container section" style="max-width:440px;">
    <div class="tab-row" style="justify-content:center;">
      <button class="tab-btn auth-tab active" data-tab="login" onclick="showAuthTab('login')">Login</button>
      <button class="tab-btn auth-tab" data-tab="register" onclick="showAuthTab('register')">Register</button>
    </div>
    <div id="loginForm">
      <h2 style="text-align:center;">Welcome back</h2>
      <div class="form-group"><label>Email</label><input id="liEmail" type="email" placeholder="you@example.com"></div>
      <div class="form-group"><label>Password</label><input id="liPass" type="password" placeholder="••••••••"></div>
      <button class="btn btn-primary btn-block" onclick="doLogin()">Log in</button>
      <p style="text-align:center;font-size:12.5px;color:var(--brown-soft);margin-top:14px;">This is a simulated login for demo purposes — no real authentication occurs.</p>
    </div>
    <div id="registerForm" style="display:none;">
      <h2 style="text-align:center;">Create your account</h2>
      <div class="form-group"><label>Full name</label><input id="reName" type="text" placeholder="Your name"></div>
      <div class="form-group"><label>Email</label><input id="reEmail" type="email" placeholder="you@example.com"></div>
      <div class="form-group"><label>Password</label><input id="rePass" type="password" placeholder="Create a password"></div>
      <button class="btn btn-primary btn-block" onclick="doRegister()">Create account</button>
    </div>
  </div>`;
}

/* ================= ACCOUNT ================= */
function showAccountTab(tab){
  window._acctTab = tab;
  document.querySelectorAll(".acct-tab").forEach(b=>b.classList.toggle("active", b.dataset.tab===tab));
  document.querySelectorAll(".acct-panel").forEach(p=>p.style.display = p.id==="panel-"+tab ? "block":"none");
}
function saveProfile(){
  STATE.user.name = document.getElementById("pfName").value.trim();
  STATE.user.phone = document.getElementById("pfPhone").value.trim();
  saveState();
  toast("Profile updated","✅");
}
function addAddress(){
  const line = document.getElementById("newAddr").value.trim();
  if(!line){ toast("Enter an address first","⚠️"); return; }
  STATE.user.addresses.push({ id:Date.now(), line });
  document.getElementById("newAddr").value = "";
  saveState();
  rerenderInPlace();
  toast("Address saved","🏠");
}
function removeAddress(id){
  STATE.user.addresses = STATE.user.addresses.filter(a=>a.id!==id);
  saveState();
  rerenderInPlace();
}
function advanceOrder(orderId){
  const stages = ["Placed","Preparing","Out for Delivery","Delivered"];
  const order = STATE.orders.find(o=>o.id===orderId);
  if(!order) return;
  const idx = stages.indexOf(order.status);
  if(idx < stages.length-1) order.status = stages[idx+1];
  saveState();
  rerenderInPlace();
  toast("Order status updated: "+order.status,"🚚");
}
function orderTrackHTML(order){
  const stages = [["Placed","📝"],["Preparing","👨‍🍳"],["Out for Delivery","🛵"],["Delivered","🎉"]];
  const curIdx = stages.findIndex(s=>s[0]===order.status);
  return `
  <div style="background:#fff;border:1px solid var(--line);border-radius:var(--radius);padding:18px 20px;margin-bottom:16px;">
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">
      <div><b>Order #${order.id}</b> <span style="color:var(--brown-soft);font-size:12.5px;">· ${new Date(order.date).toLocaleString()}</span></div>
      <div class="price-tag">${money(order.totals.total)}</div>
    </div>
    <div style="font-size:13px;color:var(--brown-soft);margin:6px 0 4px;">${order.items.map(i=>i.name+" ×"+i.qty).join(", ")}</div>
    <div class="step-track">
      ${stages.map(([label,ic],i)=>`
        <div class="step ${i<curIdx?'done':''} ${i===curIdx?'active':''}">
          <div class="dot">${i<=curIdx?ic:i+1}</div><span>${label}</span>
        </div>`).join("")}
    </div>
    ${order.status!=="Delivered" ? `<button class="btn btn-ghost btn-sm" style="margin-top:10px;" onclick="advanceOrder(${order.id})">Simulate next step →</button>` : `<div style="text-align:center;color:var(--leaf);font-weight:700;margin-top:8px;">Delivered ✓</div>`}
  </div>`;
}
function viewAccount(){
  if(!STATE.user){
    return `<div class="container section"><div class="empty-state">
      <div class="ic">🔒</div><h3>Please log in to view your account</h3>
      <button class="btn btn-primary" onclick="navigate('/login')">Login / Register</button>
    </div></div>`;
  }
  window._acctTab = window._acctTab || "orders";
  const u = STATE.user;
  const wishItems = STATE.wishlist.map(getMenuItem).filter(Boolean);
  return `
  <div class="container section">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
      <div><span class="eyebrow">My account</span><h1 style="margin-top:4px;">Hi, ${u.name} 👋</h1></div>
      <button class="btn btn-outline btn-sm" onclick="logout()">Log out</button>
    </div>
    <div class="tab-row">
      <button class="tab-btn acct-tab" data-tab="orders" onclick="showAccountTab('orders')">Order history</button>
      <button class="tab-btn acct-tab" data-tab="profile" onclick="showAccountTab('profile')">Profile</button>
      <button class="tab-btn acct-tab" data-tab="addresses" onclick="showAccountTab('addresses')">Saved addresses</button>
      <button class="tab-btn acct-tab" data-tab="wishlist" onclick="showAccountTab('wishlist')">Wishlist</button>
    </div>

    <div class="acct-panel" id="panel-orders">
      ${STATE.orders.length ? STATE.orders.map(orderTrackHTML).join("") : `<div class="empty-state"><div class="ic">🧾</div><h3>No orders yet</h3><button class="btn btn-primary" onclick="navigate('/restaurants')">Order something</button></div>`}
    </div>

    <div class="acct-panel" id="panel-profile" style="display:none;max-width:440px;">
      <div class="form-group"><label>Full name</label><input id="pfName" type="text" value="${u.name}"></div>
      <div class="form-group"><label>Email</label><input type="email" value="${u.email}" disabled></div>
      <div class="form-group"><label>Phone number</label><input id="pfPhone" type="text" value="${u.phone||""}" placeholder="10-digit mobile number"></div>
      <button class="btn btn-primary" onclick="saveProfile()">Save changes</button>
    </div>

    <div class="acct-panel" id="panel-addresses" style="display:none;max-width:500px;">
      ${u.addresses.length ? u.addresses.map(a=>`
        <div class="address-card"><span>🏠 ${a.line}</span><button class="btn-icon" onclick="removeAddress(${a.id})">✕</button></div>`).join("") : `<p style="color:var(--brown-soft);">No saved addresses yet.</p>`}
      <div class="form-group" style="display:flex;gap:10px;align-items:flex-end;margin-top:14px;">
        <div style="flex:1;"><label>Add new address</label><input id="newAddr" type="text" placeholder="House no, street, city, PIN"></div>
        <button class="btn btn-dark" onclick="addAddress()">Add</button>
      </div>
    </div>

    <div class="acct-panel" id="panel-wishlist" style="display:none;">
      ${wishItems.length ? `<div class="grid grid-3">${wishItems.map(menuCardHTML).join("")}</div>` : `<div class="empty-state"><div class="ic">🤍</div><h3>Your wishlist is empty</h3><p>Tap the heart on any dish to save it for later.</p></div>`}
    </div>
  </div>`;
}

/* ================= ABOUT ================= */
function viewAbout(){
  const team = [
    { name:"Ravi Kumar", role:"Founder & Head Chef", ic:"👨‍🍳" },
    { name:"Ananya Reddy", role:"Head of Operations", ic:"👩‍💼" },
    { name:"Diego Alvarez", role:"Partnerships Lead", ic:"🧑‍💼" },
    { name:"Wei Zhang", role:"Product & Engineering", ic:"👩‍💻" }
  ];
  const awards = [
    { title:"Best Food-Tech Startup", org:"City Business Awards, 2024", ic:"🏆" },
    { title:"Top Rated Delivery App", org:"Foodie Choice Awards, 2023", ic:"⭐" },
    { title:"Sustainable Packaging Award", org:"GreenServe Council, 2023", ic:"🌱" }
  ];
  return `
  <section class="page-hero container">
    <span class="eyebrow">Our story</span>
    <h1>Built by people who really,<br>really like to eat.</h1>
  </section>
  <div class="container section">
    <div class="two-col">
      <div>
        <p style="font-size:16px;">FreshBite started in 2021 as a two-person delivery run out of a rented kitchen, ferrying home-cooked lunches to office workers who missed a proper meal. Word spread fast — not because of clever marketing, but because the food was good and it showed up hot.</p>
        <p>Today we partner with local restaurants who care as much about their ingredients as we do about getting the order to your door while it's still steaming. No ghost kitchens, no shortcuts — every partner on FreshBite is a real, standing restaurant with its own name on the door.</p>
        <p>We built this platform to make discovering and ordering from those kitchens as effortless as the meal itself: browse by craving, filter by diet, and track your order from the wok to your doorstep.</p>
      </div>
      <div class="card-media" style="height:300px;border-radius:var(--radius);font-size:110px;">🍽️</div>
    </div>
  </div>
  <div class="scallop scallop-brown"></div>
  <section class="section section-dark">
    <div class="container">
      <span class="eyebrow">The people</span>
      <h2>Meet the team</h2>
      <div class="grid grid-4" style="margin-top:20px;">
        ${team.map(t=>`<div class="team-card"><div class="ic">${t.ic}</div><h3 style="font-size:16px;">${t.name}</h3><p style="color:var(--brown-soft);font-size:13px;">${t.role}</p></div>`).join("")}
      </div>
    </div>
  </section>
  <div class="scallop scallop-brown scallop-flip"></div>
  <section class="section">
    <div class="container">
      <span class="eyebrow">Recognition</span>
      <h2>Awards & mentions</h2>
      <div class="grid grid-3" style="margin-top:20px;">
        ${awards.map(a=>`<div class="award-card"><div class="ic" style="font-size:40px;">${a.ic}</div><h3 style="font-size:16px;">${a.title}</h3><p style="color:var(--brown-soft);font-size:13px;">${a.org}</p></div>`).join("")}
      </div>
    </div>
  </section>`;
}

/* ================= CONTACT ================= */
function submitContact(){
  const name = document.getElementById("ctName").value.trim();
  const email = document.getElementById("ctEmail").value.trim();
  const msg = document.getElementById("ctMsg").value.trim();
  if(!name || !email || !msg){ toast("Please fill in all fields","⚠️"); return; }
  document.getElementById("ctName").value = "";
  document.getElementById("ctEmail").value = "";
  document.getElementById("ctMsg").value = "";
  toast("Message sent — we'll get back to you soon!","📩");
}
function viewContact(){
  return `
  <section class="page-hero container">
    <span class="eyebrow">We're here to help</span>
    <h1>Get in touch</h1>
  </section>
  <div class="container section">
    <div class="two-col">
      <div>
        <div class="map-box">🗺️ Map placeholder — 221 Culinary Lane, Food District, Hyderabad</div>
        <div style="margin-top:20px;display:flex;flex-direction:column;gap:10px;">
          <div><b>📍 Address</b><p style="margin:2px 0;color:var(--brown-soft);">221 Culinary Lane, Food District, Hyderabad, India</p></div>
          <div><b>🕐 Hours</b><p style="margin:2px 0;color:var(--brown-soft);">Mon–Sun, 10:00 AM – 11:00 PM</p></div>
          <div><b>📞 Phone</b><p style="margin:2px 0;color:var(--brown-soft);">+91 12345 67890</p></div>
          <div><b>✉️ Email</b><p style="margin:2px 0;color:var(--brown-soft);">hello@freshbite.demo</p></div>
        </div>
      </div>
      <div>
        <h3>Send us a message</h3>
        <div class="form-group"><label>Name</label><input id="ctName" type="text" placeholder="Your name"></div>
        <div class="form-group"><label>Email</label><input id="ctEmail" type="email" placeholder="you@example.com"></div>
        <div class="form-group"><label>Message</label><textarea id="ctMsg" rows="5" placeholder="How can we help?"></textarea></div>
        <button class="btn btn-primary btn-block" onclick="submitContact()">Send message</button>
      </div>
    </div>
  </div>`;
}
