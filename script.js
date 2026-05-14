// ── DADOS INICIAIS (produtos de exemplo) ──
const EMOJIS = ['🧸','🚗','🏎️','🚀','🎲','🎯','🪀','🪁','🎠','🎡','🎪','🤖','🦕','🦖','🐉','🦄','🎭','🎨','🔭','🧩','🎮','🕹️','🛸','⚽','🏀','🎸','🥁','🎺','🛤️','🏗️'];

const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Urso de Pelúcia Gigante', category: 'Pelúcia', age: '0–2 anos', price: 89.90, priceOld: 129.90, emoji: '🧸', desc: 'Super fofo e macio, ideal para os primeiros anos. Material antialérgico certificado.', badge: 'promo' },
  { id: 2, name: 'Carrinho Super Veloz', category: 'Aventura', age: '4–6 anos', price: 49.90, priceOld: null, emoji: '🏎️', desc: 'Carrinho com fricção, abre capô e portas. Feito com material resistente.', badge: 'destaque' },
  { id: 3, name: 'Kit Robô Montável', category: 'Educativo', age: '8–12 anos', price: 134.90, priceOld: null, emoji: '🤖', desc: 'Monte seu próprio robô com 120 peças! Estimula criatividade e raciocínio lógico.', badge: 'novo' },
  { id: 4, name: 'Blocos de Montar 100pç', category: 'Educativo', age: '2–4 anos', price: 67.90, priceOld: 89.90, emoji: '🧩', desc: 'Blocos coloridos de encaixe, desenvolvem coordenação motora. Aprovado pelo Inmetro.', badge: 'promo' },
  { id: 5, name: 'Controle Remoto Jipe 4x4', category: 'Controle Remoto', age: '6–8 anos', price: 189.90, priceOld: null, emoji: '🚗', desc: 'Jipe com suspensão real, vai em qualquer terreno. Bateria recarregável inclusa.', badge: 'destaque' },
  { id: 6, name: 'Unicórnio Luminoso', category: 'Pelúcia', age: '4–6 anos', price: 79.90, priceOld: null, emoji: '🦄', desc: 'Brilha no escuro com 5 cores! Pelúcia lavável e super macia.', badge: 'novo' },
  { id: 7, name: 'Xadrez Infantil Educativo', category: 'Jogos', age: '6–8 anos', price: 44.90, priceOld: null, emoji: '🎲', desc: 'Versão simplificada para aprender xadrez brincando. Peças grandes e coloridas.', badge: '' },
  { id: 8, name: 'Foguete Espacial de Madeira', category: 'Aventura', age: '4–6 anos', price: 55.90, priceOld: 75.90, emoji: '🚀', desc: 'Foguete artesanal em madeira certificada. Tintas atóxicas. Presente memorável!', badge: 'promo' },
];

// ── STATE ──
let products = JSON.parse(localStorage.getItem('bm_products')) || DEFAULT_PRODUCTS;
let activeFilter = 'all';
let currentModal = null;

function saveProducts() {
  localStorage.setItem('bm_products', JSON.stringify(products));
}

// ── PAGES ──
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  if (page === 'catalog') renderCatalog();
  if (page === 'admin') renderAdmin();
}

// ── FILTER ──
function setFilter(el, filter) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  activeFilter = filter;
  filterProducts();
}

function filterProducts() {
  const q = document.getElementById('search-input').value.toLowerCase().trim();
  let filtered = products;
  if (activeFilter !== 'all') filtered = filtered.filter(p => p.category === activeFilter);
  if (q) filtered = filtered.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    (p.desc && p.desc.toLowerCase().includes(q))
  );
  renderGrid(filtered);
  const total = filtered.length;
  document.getElementById('stats-bar').textContent =
    total === 0 ? 'Nenhum produto encontrado' :
    total === 1 ? '1 produto encontrado' :
    `${total} produtos encontrados`;
}

// ── RENDER CATALOG ──
function renderCatalog() {
  filterProducts();
}

function renderGrid(list) {
  const grid = document.getElementById('catalog-grid');
  if (list.length === 0) {
    grid.innerHTML = `<div class="empty-state"><div class="emoji">🔍</div><h3>Nenhum produto encontrado</h3><p>Tente outro termo ou categoria.</p></div>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="product-card" onclick="openModal(${p.id})">
      ${p.badge ? `<span class="card-badge ${p.badge}">${p.badge === 'novo' ? 'Novo' : p.badge === 'promo' ? 'Promoção' : 'Destaque'}</span>` : ''}
      <div class="card-img">${p.emoji}</div>
      <div class="card-body">
        <div class="card-category">${p.category}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-age">👶 ${p.age}</div>
        <div>
          <span class="card-price">R$ ${Number(p.price).toFixed(2).replace('.',',')}</span>
          ${p.priceOld ? `<span class="card-price-old">R$ ${Number(p.priceOld).toFixed(2).replace('.',',')}</span>` : ''}
        </div>
        <div class="card-actions" onclick="event.stopPropagation()">
          <button class="btn-share" onclick="copyLink(${p.id})">🔗 Link</button>
          <button class="btn-whats" onclick="whatsApp(${p.id})">💬 Zap</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ── MODAL ──
function openModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  currentModal = p;
  document.getElementById('modal-img').textContent = p.emoji;
  document.getElementById('modal-category').textContent = p.category;
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-desc').textContent = p.desc || 'Sem descrição.';
  document.getElementById('modal-meta').innerHTML = `
    <span class="meta-pill">👶 ${p.age}</span>
    ${p.badge ? `<span class="meta-pill">${p.badge === 'novo' ? '🟢 Novo' : p.badge === 'promo' ? '🟡 Promoção' : '🔴 Destaque'}</span>` : ''}
  `;
  const priceStr = 'R$ ' + Number(p.price).toFixed(2).replace('.', ',');
  const oldStr = p.priceOld ? ` <span style="font-size:1rem;color:#aaa;text-decoration:line-through">R$ ${Number(p.priceOld).toFixed(2).replace('.', ',')}</span>` : '';
  document.getElementById('modal-price').innerHTML = priceStr + oldStr;
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModalDirect();
}
function closeModalDirect() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function shareProduct() { copyLink(currentModal.id); closeModalDirect(); }
function shareWhatsApp() { whatsApp(currentModal.id); }

function copyLink(id) {
  const p = products.find(x => x.id === id);
  const text = `🧸 *${p.name}*\n💰 R$ ${Number(p.price).toFixed(2).replace('.',',')}\n📦 Categoria: ${p.category}\n👶 Faixa etária: ${p.age}\n\nVeja no catálogo: ${window.location.href}`;
  navigator.clipboard.writeText(text).then(() => showToast('✅ Link copiado!'));
}

function whatsApp(id) {
  const p = products.find(x => x.id === id);
  const text = `🧸 *${p.name}*\n💰 R$ ${Number(p.price).toFixed(2).replace('.',',')}\n📦 ${p.category} | 👶 ${p.age}\n\n${p.desc || ''}`;
  window.open('https://wa.me/?text=' + encodeURIComponent(text), '_blank');
}

// ── ADMIN ──
function renderAdmin() {
  const cats = {};
  products.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
  const topCat = Object.entries(cats).sort((a,b) => b[1]-a[1])[0];

  document.getElementById('admin-stats').innerHTML = `
    <div class="stat-card"><div class="stat-num">${products.length}</div><div class="stat-label">Total de produtos</div></div>
    <div class="stat-card"><div class="stat-num">${Object.keys(cats).length}</div><div class="stat-label">Categorias</div></div>
    <div class="stat-card"><div class="stat-num">${products.filter(p=>p.badge==='novo').length}</div><div class="stat-label">Novidades</div></div>
    <div class="stat-card"><div class="stat-num">${products.filter(p=>p.badge==='promo').length}</div><div class="stat-label">Em promoção</div></div>
  `;

  // Emoji picker
  document.getElementById('emoji-picker').innerHTML = EMOJIS.map(e =>
    `<div class="emoji-opt" onclick="selectEmoji('${e}')" id="ep-${e}">${e}</div>`
  ).join('');

  renderAdminList();
}

function renderAdminList() {
  const list = document.getElementById('admin-product-list');
  if (products.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:var(--text2);padding:24px">Nenhum produto ainda.</p>';
    return;
  }
  list.innerHTML = [...products].reverse().map(p => `
    <div class="product-row">
      <div class="product-row-emoji">${p.emoji}</div>
      <div class="product-row-info">
        <div class="product-row-name">${p.name}</div>
        <div class="product-row-meta">${p.category} · ${p.age}</div>
      </div>
      <div class="product-row-price">R$${Number(p.price).toFixed(2).replace('.',',')}</div>
      <div class="product-row-actions">
        <button class="btn-danger" onclick="deleteProduct(${p.id})">🗑</button>
      </div>
    </div>
  `).join('');
}

function selectEmoji(e) {
  document.getElementById('f-emoji').value = e;
  document.querySelectorAll('.emoji-opt').forEach(el => el.classList.remove('selected'));
  const el = document.getElementById('ep-' + e);
  if (el) el.classList.add('selected');
}

function addProduct() {
  const name = document.getElementById('f-name').value.trim();
  const category = document.getElementById('f-category').value;
  const age = document.getElementById('f-age').value;
  const price = parseFloat(document.getElementById('f-price').value);
  const priceOld = parseFloat(document.getElementById('f-price-old').value) || null;
  const desc = document.getElementById('f-desc').value.trim();
  const badge = document.getElementById('f-badge').value;
  const emoji = document.getElementById('f-emoji').value;

  if (!name || !category || !age || isNaN(price) || !emoji) {
    showToast('⚠️ Preencha todos os campos obrigatórios e escolha um emoji!');
    return;
  }

  const newProduct = {
    id: Date.now(),
    name, category, age, price, priceOld, desc, badge, emoji
  };

  products.push(newProduct);
  saveProducts();
  renderAdminList();

  // Reset form
  ['f-name','f-desc','f-price','f-price-old'].forEach(id => document.getElementById(id).value = '');
  ['f-category','f-age','f-badge'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('f-emoji').value = '';
  document.querySelectorAll('.emoji-opt').forEach(el => el.classList.remove('selected'));

  // Atualiza stats
  const cats = {};
  products.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
  document.getElementById('admin-stats').querySelector('.stat-num').textContent = products.length;

  showToast('✅ Produto cadastrado com sucesso!');
  renderAdmin();
}

function deleteProduct(id) {
  if (!confirm('Remover este produto do catálogo?')) return;
  products = products.filter(p => p.id !== id);
  saveProducts();
  renderAdmin();
  showToast('🗑️ Produto removido.');
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── INIT ──
renderCatalog();