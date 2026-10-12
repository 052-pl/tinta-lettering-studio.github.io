const products = [
 {id:1,name:"Calligraphy Pen Set",category:"Pens",price:24.99,tag:"Studio essential",desc:"A considered set of writing pens for expressive strokes, careful practice and everyday creative rituals.",image:"assets/images/products/fountain-pen-set.jpg"},
 {id:2,name:"Premium Ink Bottle",category:"Ink",price:14.99,tag:"Rich pigment",desc:"A deep, smooth-flowing ink for lettering, journaling and slow, intentional writing sessions.",image:"assets/images/products/premium-ink-bottle.jpg"},
 {id:3,name:"Lettering Practice Notebook",category:"Paper",price:16.99,tag:"Practice favourite",desc:"A handsome notebook for warm-ups, letterforms, sketches and ideas worth keeping.",image:"assets/images/products/lettering-notebook.jpg"},
 {id:4,name:"Brush Marker Set",category:"Tools",price:21.99,tag:"Colour your way",desc:"A versatile selection of brush markers for modern lettering, colour studies and playful compositions.",image:"assets/images/products/brush-marker-set.jpg"},
 {id:5,name:"Watercolor Paper Pad",category:"Paper",price:12.99,tag:"Studio paper",desc:"A textured paper pad for lettering experiments, ink washes and mixed-media details.",image:"assets/images/products/watercolor-paper-pad.jpg"},
 {id:6,name:"Wax Seal Kit",category:"Gifts",price:29.99,tag:"Thoughtful gift",desc:"A charming finishing touch for letters, invitations, keepsakes and handcrafted packaging.",image:"assets/images/products/wax-seal-kit.jpg"},
 {id:7,name:"Everyday Nib & Pen Bundle",category:"Pens",price:19.99,tag:"For daily practice",desc:"A versatile pen and nib pairing to help build confidence and explore line variation.",image:"assets/images/products/fountain-pen-set.jpg"},
 {id:8,name:"Midnight Ink Collection",category:"Ink",price:27.50,tag:"Curated colours",desc:"A curated ink set for contrast, depth and beautiful details across your lettering work.",image:"assets/images/products/premium-ink-bottle.jpg"},
 {id:9,name:"Ideas & Flow Journal",category:"Paper",price:18.50,tag:"Keep your ideas",desc:"A notebook made for sketches, creative prompts, lettering studies and the ideas between them.",image:"assets/images/products/lettering-notebook.jpg"},
 {id:10,name:"Colour Study Markers",category:"Tools",price:18.99,tag:"Bright possibilities",desc:"A bright marker assortment for playful lettering, colour palettes and expressive headlines.",image:"assets/images/products/brush-marker-set.jpg"},
 {id:11,name:"Lettering Paper Bundle",category:"Paper",price:15.99,tag:"Paper favourites",desc:"A paper assortment for testing tools, collecting flourishes and exploring new techniques.",image:"assets/images/products/watercolor-paper-pad.jpg"},
 {id:12,name:"Artisan Seal & Stamp Set",category:"Gifts",price:34.99,tag:"Gift-ready",desc:"A finishing set for invitations, personal notes and handmade gifts with a little extra character.",image:"assets/images/products/wax-seal-kit.jpg"}
];
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const money = n => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(n);
let activeFilter="All", query="", showAllProducts=false, toastTimer;
let cart = JSON.parse(localStorage.getItem("tinta-cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("tinta-wishlist") || "[]");

function persist(){ localStorage.setItem("tinta-cart",JSON.stringify(cart)); localStorage.setItem("tinta-wishlist",JSON.stringify(wishlist)); }
function notify(message){ const t=$("#toast"); t.textContent=message; t.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove("show"),2300); }
function filteredProducts(){
 let list=products.filter(p=>(activeFilter==="All" || p.category===activeFilter || (activeFilter==="Custom"&&p.category==="Gifts") || (activeFilter==="Art"&&p.category==="Paper")) && `${p.name} ${p.category} ${p.desc} ${p.tag}`.toLowerCase().includes(query.toLowerCase()));
 const sort=$("#sortSelect")?.value || "featured";
 if(sort==="low") list.sort((a,b)=>a.price-b.price);
 if(sort==="high") list.sort((a,b)=>b.price-a.price);
 if(sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
 return showAllProducts ? list : list.slice(0,6);
}
function renderProducts(){
 const list=filteredProducts(), grid=$("#productGrid"); grid.innerHTML="";
 $("#emptyState").hidden=list.length>0;
 list.forEach(p=>{
  const card=document.createElement("article"); card.className="product-card";
  card.innerHTML=`<div class="product-image-wrap"><img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy"><button class="heart-button ${wishlist.includes(p.id)?"is-saved":""}" data-wish="${p.id}" aria-label="${wishlist.includes(p.id)?"Remove from":"Save to"} wishlist">♡</button></div><div class="product-info"><p class="product-category">${p.category} · ${p.tag}</p><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="product-price">${money(p.price)}</span><button class="quick-view" data-view="${p.id}">Details</button></div><button class="add-button" data-add="${p.id}">Add to bag +</button></div>`;
  grid.appendChild(card);
 });
 $("#showAll").hidden=query.length>0 || activeFilter!=="All";
 $("#showAll").textContent=showAllProducts?"Show featured pieces ↑":"View all studio essentials →";
 $("#wishlistCount").textContent=wishlist.length;
}
function cartCount(){return cart.reduce((n,item)=>n+item.qty,0)}
function renderCart(){
 $("#cartCount").textContent=cartCount(); $("#panelCartCount").textContent=`(${cartCount()})`;
 const box=$("#cartItems"); box.innerHTML="";
 if(!cart.length){box.innerHTML='<div class="empty-cart"><p>Your bag is waiting for a little inspiration.</p><a href="#shop" class="underlined-link" data-close>Explore the collection ↗</a></div>';}
 cart.forEach(item=>{
  const p=products.find(x=>x.id===item.id); if(!p)return;
  const row=document.createElement("div"); row.className="cart-row";
  row.innerHTML=`<img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>${money(p.price)}</p><div class="quantity-controls"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${p.id}">Remove</button>`;
  box.appendChild(row);
 });
 $("#cartSubtotal").textContent=money(cart.reduce((n,item)=>{const p=products.find(x=>x.id===item.id);return n+(p?p.price*item.qty:0)},0));
}
function renderWishlist(){
 const box=$("#wishlistItems"); box.innerHTML="";
 const list=products.filter(p=>wishlist.includes(p.id));
 if(!list.length){box.innerHTML='<div class="empty-cart">No saved pieces yet — tap ♡ on anything you love.</div>';return}
 list.forEach(p=>{const row=document.createElement("div");row.className="cart-row";row.innerHTML=`<img src="${p.image}" alt=""><div><h3>${p.name}</h3><p>${money(p.price)}</p><button class="quick-view" data-view="${p.id}">Details</button></div><button class="remove-item" data-wish="${p.id}">Remove</button>`;box.appendChild(row)});
}
function openPanel(id){closePanels();$("#overlay").classList.add("visible");const panel=$(id);panel.classList.add("open");panel.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
function closePanels(){ $$(".side-panel").forEach(p=>{p.classList.remove("open");p.setAttribute("aria-hidden","true")});$("#overlay").classList.remove("visible");document.body.style.overflow=""; }
function addToCart(id){const found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({id,qty:1});persist();renderCart();notify(`${products.find(p=>p.id===id).name} added to your bag.`)}
function toggleWish(id){wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id];persist();renderProducts();renderWishlist();notify(wishlist.includes(id)?"Saved for later.":"Removed from saved pieces.");}
function showDetail(id){
 const p=products.find(x=>x.id===id);if(!p)return;
 $("#productDetail").innerHTML=`<div class="detail-layout"><img src="${p.image}" alt="${p.name}"><div class="detail-copy"><p class="eyebrow dark">${p.category} · ${p.tag}</p><h2>${p.name}</h2><p class="price">${money(p.price)}</p><p>${p.desc}</p><p>Selected for creative practice, thoughtful gifting and the small rituals that make making things special.</p><button class="button button-dark" data-add="${p.id}">Add to bag ↗</button></div></div>`;
 $("#productDialog").showModal();
}
document.addEventListener("click",e=>{
 const add=e.target.closest("[data-add]");if(add){e.preventDefault();addToCart(Number(add.dataset.add));return}
 const view=e.target.closest("[data-view]");if(view){showDetail(Number(view.dataset.view));return}
 const wish=e.target.closest("[data-wish]");if(wish){toggleWish(Number(wish.dataset.wish));return}
 const qty=e.target.closest("[data-qty]");if(qty){const item=cart.find(x=>x.id===Number(qty.dataset.qty));if(item){item.qty+=Number(qty.dataset.delta);if(item.qty<1)cart=cart.filter(x=>x.id!==item.id);persist();renderCart()}return}
 const rem=e.target.closest("[data-remove]");if(rem){cart=cart.filter(x=>x.id!==Number(rem.dataset.remove));persist();renderCart();return}
 const cat=e.target.closest("[data-category]");if(cat){activeFilter=cat.dataset.category;showAllProducts=true;$$(".filter-chip").forEach(c=>c.classList.toggle("selected",c.dataset.filter===activeFilter));renderProducts();$("#shop").scrollIntoView({behavior:"smooth"});return}
 if(e.target.closest("[data-close]")){closePanels();return}
});
$("#filterRow").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;activeFilter=b.dataset.filter;showAllProducts=true;$$(".filter-chip").forEach(c=>c.classList.toggle("selected",c===b));renderProducts()});
$("#searchInput").addEventListener("input",e=>{query=e.target.value.trim();showAllProducts=true;renderProducts();if(query)$("#shop").scrollIntoView({behavior:"smooth",block:"start"})});
$("#sortSelect").addEventListener("change",renderProducts);
$("#clearFilters").addEventListener("click",()=>{activeFilter="All";query="";showAllProducts=false;$("#searchInput").value="";$("#sortSelect").value="featured";$$(".filter-chip").forEach(c=>c.classList.toggle("selected",c.dataset.filter==="All"));renderProducts()});
$("#showAll").addEventListener("click",()=>{showAllProducts=!showAllProducts;renderProducts()});
$("#cartToggle").addEventListener("click",()=>{renderCart();openPanel("#cartPanel")});
$("#wishlistTop").addEventListener("click",()=>{renderWishlist();openPanel("#wishlistPanel")});
$("#overlay").addEventListener("click",closePanels);
$$("[data-close]").forEach(b=>b.addEventListener("click",closePanels));
$("#dialogClose").addEventListener("click",()=>$("#productDialog").close());
$("#productDialog").addEventListener("click",e=>{if(e.target===$("#productDialog"))$("#productDialog").close()});
$("#checkoutButton").addEventListener("click",()=>{$("#checkoutMessage").textContent="Thanks for exploring TINTA — checkout is a demo and no payment was taken.";notify("Demo checkout: no payment has been processed.")});
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();const email=$("#newsletterEmail").value.trim();if(!email)return;$("#newsletterMessage").textContent=`Thank you — ${email} has been added to this demo signup.`;$("#newsletterForm").reset();notify("You're on the list (demo).")});
$("#menuToggle").addEventListener("click",()=>{const open=$("#mainNav").classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(open));$("#menuToggle").setAttribute("aria-label",open?"Close navigation":"Open navigation")});
$$(".main-nav a").forEach(a=>a.addEventListener("click",()=>{$("#mainNav").classList.remove("open");$("#menuToggle").setAttribute("aria-expanded","false")}));
renderProducts();renderCart();renderWishlist();
