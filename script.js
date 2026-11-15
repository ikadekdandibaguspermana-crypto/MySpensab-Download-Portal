(() => {
  const appUrl = 'https://spensabcerdas.netlify.app/';
  const storageKey = 'myspensab-download-designer-v1';
  const root = document.documentElement;
  const main = document.querySelector('.wrap');
  const dialog = document.getElementById('designDialog');
  const blockList = document.getElementById('blockList');
  const saveStatus = document.getElementById('saveStatus');
  const themes = [
    { name: 'Langit Pagi', accent: '#526ae6', bg: '#f4f7ff', wallpaper: 'radial-gradient(ellipse at 8% 10%,#c9ddff 0,transparent 34%),radial-gradient(ellipse at 92% 18%,#e3d8ff 0,transparent 32%),radial-gradient(ellipse at 76% 100%,#c9f0e8 0,transparent 38%),linear-gradient(135deg,#f8fbff,#edf3ff 55%,#f9fbff)' },
    { name: 'Sakura', accent: '#cb648e', bg: '#fff4f7', wallpaper: 'radial-gradient(ellipse at 5% 85%,#ffd7e6 0,transparent 36%),radial-gradient(ellipse at 88% 8%,#f8d7ec 0,transparent 33%),radial-gradient(ellipse at 70% 72%,#ffe8d7 0,transparent 38%),linear-gradient(135deg,#fffafd,#fff0f5)' },
    { name: 'Mint', accent: '#248f82', bg: '#effaf7', wallpaper: 'radial-gradient(ellipse at 95% 4%,#bcebe0 0,transparent 37%),radial-gradient(ellipse at 8% 35%,#d5f4e9 0,transparent 34%),radial-gradient(ellipse at 60% 100%,#d3e9ff 0,transparent 40%),linear-gradient(135deg,#f6fffb,#ebf9f5)' },
    { name: 'Lavender', accent: '#7154c8', bg: '#f6f2ff', wallpaper: 'radial-gradient(ellipse at 50% 0%,#dfd2ff 0,transparent 39%),radial-gradient(ellipse at 0% 85%,#e8ddff 0,transparent 36%),radial-gradient(ellipse at 100% 70%,#d3e9ff 0,transparent 35%),linear-gradient(135deg,#fcfaff,#f1edff)' },
    { name: 'Pasir', accent: '#a56b32', bg: '#fff8ee', wallpaper: 'radial-gradient(ellipse at 2% 4%,#f4dfbd 0,transparent 34%),radial-gradient(ellipse at 100% 92%,#f4e2c9 0,transparent 40%),radial-gradient(ellipse at 72% 18%,#e1eee1 0,transparent 33%),linear-gradient(135deg,#fffdf8,#fbf3e7)' },
    { name: 'Coral', accent: '#c65349', bg: '#fff5f1', wallpaper: 'radial-gradient(ellipse at 97% 4%,#ffd1c3 0,transparent 35%),radial-gradient(ellipse at 8% 96%,#ffe1d3 0,transparent 38%),radial-gradient(ellipse at 42% 0%,#ffe6bd 0,transparent 32%),linear-gradient(135deg,#fffaf7,#fff0ea)' },
    { name: 'Laut', accent: '#2878b8', bg: '#eff8ff', wallpaper: 'radial-gradient(ellipse at 0% 8%,#c8e7ff 0,transparent 38%),radial-gradient(ellipse at 100% 82%,#c8eff1 0,transparent 39%),radial-gradient(ellipse at 60% 0%,#d9e1ff 0,transparent 35%),linear-gradient(135deg,#f7fcff,#eaf6ff)' },
    { name: 'Lemon', accent: '#8a7a20', bg: '#fffced', wallpaper: 'radial-gradient(ellipse at 85% 6%,#f8edb9 0,transparent 34%),radial-gradient(ellipse at 2% 90%,#e1f0c9 0,transparent 37%),radial-gradient(ellipse at 48% 100%,#ffe5c9 0,transparent 34%),linear-gradient(135deg,#fffef6,#fbf8e5)' },
    { name: 'Awan', accent: '#556b89', bg: '#f4f7fb', wallpaper: 'radial-gradient(ellipse at 42% 0%,#e0e9f5 0,transparent 40%),radial-gradient(ellipse at 0% 54%,#d8e4f4 0,transparent 35%),radial-gradient(ellipse at 98% 100%,#e1e9e4 0,transparent 36%),linear-gradient(135deg,#fcfdff,#f0f4f8)' },
    { name: 'Aurora', accent: '#496db5', bg: '#f2f7ff', wallpaper: 'radial-gradient(ellipse at 5% 10%,#cbe7ff 0,transparent 35%),radial-gradient(ellipse at 95% 4%,#d6d2ff 0,transparent 36%),radial-gradient(ellipse at 73% 95%,#c6f0de 0,transparent 41%),linear-gradient(145deg,#f9fbff,#edf4ff)' }
  ];
  const blockNames = { header: 'Logo dan menu', hero: 'Judul utama', devices: 'Pilihan perangkat', notice: 'Catatan instalasi', guide: 'Panduan perangkat', footer: 'Keterangan bawah', customImage: 'Blok gambar' };
  const defaultOrder = ['header', 'hero', 'devices', 'notice', 'guide', 'footer'];
  let state = { theme: 0, accent: '', background: '', wallpaper: '', hidden: {}, order: [...defaultOrder], image: null };

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (stored && typeof stored === 'object') state = { ...state, ...stored, hidden: stored.hidden || {}, order: Array.isArray(stored.order) ? stored.order : [...defaultOrder] };
  } catch { try { localStorage.removeItem(storageKey); } catch {} }

  function setStatus(message = 'Tersimpan otomatis') {
    saveStatus.textContent = message;
    window.clearTimeout(setStatus.timer);
    setStatus.timer = window.setTimeout(() => { saveStatus.textContent = 'Tersimpan otomatis'; }, 1800);
  }

  function persist(message) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      setStatus(message || 'Tersimpan otomatis');
    } catch {
      setStatus('Penyimpanan penuh — kurangi ukuran gambar');
    }
  }

  function applyTheme(index) {
    state.theme = index;
    state.accent = '';
    state.background = '';
    state.wallpaper = '';
    const theme = themes[index] || themes[0];
    root.style.setProperty('--page-wallpaper', theme.wallpaper);
    root.style.setProperty('--page-accent', theme.accent);
    root.style.setProperty('--page-ink', '#172554');
    root.style.setProperty('--page-muted', '#667391');
    document.getElementById('customBackground').value = theme.bg;
    document.getElementById('customAccent').value = theme.accent;
    markTheme(index);
  }

  function markTheme(active) {
    document.querySelectorAll('.theme-choice').forEach((button, index) => button.setAttribute('aria-pressed', String(index === active && !state.accent && !state.background && !state.wallpaper)));
  }

  function applyCustomColors() {
    const bg = state.background || themes[state.theme]?.bg || themes[0].bg;
    const accent = state.accent || themes[state.theme]?.accent || themes[0].accent;
    root.style.setProperty('--page-accent', accent);
    root.style.setProperty('--page-wallpaper', state.wallpaper ? `linear-gradient(rgba(248,250,255,.48),rgba(248,250,255,.56)),url("${state.wallpaper}") center / cover fixed` : `radial-gradient(ellipse at 6% 8%,${bg} 0,transparent 52%),linear-gradient(135deg,#fff 0%,${bg} 100%)`);
    document.getElementById('customBackground').value = bg;
    document.getElementById('customAccent').value = accent;
    markTheme(-1);
  }

  function addImageToPage() {
    let figure = document.querySelector('[data-edit-block="customImage"]');
    if (!state.image) { figure?.remove(); return; }
    if (!figure) {
      figure = document.createElement('figure');
      figure.dataset.editBlock = 'customImage';
      figure.className = 'custom-image-block';
      const image = document.createElement('img');
      image.alt = 'Gambar pilihan untuk desain MySpensab';
      const caption = document.createElement('figcaption');
      figure.append(image, caption);
      main.querySelector('[data-edit-block="hero"]').after(figure);
    }
    figure.querySelector('img').src = state.image.src;
    figure.querySelector('figcaption').textContent = state.image.caption || 'MySpensab';
  }

  function getBlocks() {
    return [...main.querySelectorAll(':scope > [data-edit-block]')];
  }

  function applyOrder() {
    const map = new Map(getBlocks().map(node => [node.dataset.editBlock, node]));
    const keys = state.order.filter(key => map.has(key));
    map.forEach((_, key) => { if (!keys.includes(key)) keys.push(key); });
    state.order = keys;
    keys.forEach(key => main.appendChild(map.get(key)));
    renderBlockList();
  }

  function moveBlock(key, direction) {
    const index = state.order.indexOf(key);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= state.order.length) return;
    [state.order[index], state.order[next]] = [state.order[next], state.order[index]];
    applyOrder();
    persist();
  }

  function toggleHidden(key) {
    state.hidden[key] = !state.hidden[key];
    const block = main.querySelector(`[data-edit-block="${key}"]`);
    if (block) block.dataset.designHidden = String(state.hidden[key]);
    renderBlockList();
    persist();
  }

  function renderBlockList() {
    blockList.replaceChildren();
    state.order.forEach((key, index) => {
      const row = document.createElement('div');
      row.className = 'block-row';
      row.draggable = true;
      row.dataset.blockKey = key;
      const handle = document.createElement('div');
      handle.className = 'block-handle';
      handle.innerHTML = '<span aria-hidden="true">⠿</span><span></span>';
      handle.lastElementChild.textContent = blockNames[key] || 'Blok';
      const actions = document.createElement('div');
      actions.className = 'block-actions';
      const up = document.createElement('button');
      up.type = 'button'; up.textContent = '↑'; up.setAttribute('aria-label', `Geser ${blockNames[key]} ke atas`); up.disabled = index === 0;
      up.addEventListener('click', () => moveBlock(key, -1));
      const down = document.createElement('button');
      down.type = 'button'; down.textContent = '↓'; down.setAttribute('aria-label', `Geser ${blockNames[key]} ke bawah`); down.disabled = index === state.order.length - 1;
      down.addEventListener('click', () => moveBlock(key, 1));
      actions.append(up, down);
      const visibility = document.createElement('button');
      visibility.type = 'button'; visibility.className = 'block-visibility';
      visibility.textContent = state.hidden[key] ? '＋' : '◉';
      visibility.setAttribute('aria-label', state.hidden[key] ? `Tampilkan ${blockNames[key]}` : `Sembunyikan ${blockNames[key]}`);
      visibility.addEventListener('click', () => toggleHidden(key));
      row.append(handle, actions, visibility);
      row.addEventListener('dragstart', event => { row.classList.add('dragging'); event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', key); });
      row.addEventListener('dragend', () => row.classList.remove('dragging'));
      row.addEventListener('dragover', event => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; });
      row.addEventListener('drop', event => {
        event.preventDefault();
        const from = state.order.indexOf(event.dataTransfer.getData('text/plain'));
        const to = state.order.indexOf(key);
        if (from < 0 || to < 0 || from === to) return;
        const [picked] = state.order.splice(from, 1);
        state.order.splice(to, 0, picked);
        applyOrder(); persist();
      });
      if (key === 'customImage') {
        const remove = document.createElement('button');
        remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', 'Hapus blok gambar');
        remove.addEventListener('click', () => { state.image = null; state.hidden.customImage = false; state.order = state.order.filter(item => item !== 'customImage'); addImageToPage(); renderBlockList(); persist(); });
        actions.append(remove);
      }
      blockList.append(row);
    });
  }

  function readImage(file, onRead) {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/.test(file.type)) { window.alert('Pilih gambar PNG, JPG, atau WebP.'); return; }
    if (file.size > 1400000) { window.alert('Ukuran gambar maksimal 1,4 MB supaya desain tersimpan lancar.'); return; }
    const reader = new FileReader();
    reader.onload = () => onRead(String(reader.result));
    reader.onerror = () => window.alert('Gambar tidak bisa dibaca. Coba pilih file lain.');
    reader.readAsDataURL(file);
  }

  themes.forEach((theme, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'theme-choice'; button.setAttribute('aria-label', `Pilih wallpaper ${theme.name}`);
    const swatch = document.createElement('span'); swatch.className = 'theme-swatch'; swatch.style.background = theme.wallpaper;
    const label = document.createElement('span'); label.className = 'theme-name'; label.textContent = theme.name;
    button.append(swatch, label); button.addEventListener('click', () => { applyTheme(index); persist(); });
    document.getElementById('themeChoices').append(button);
  });

  const ua = navigator.userAgent || '';
  const platform = navigator.userAgentData?.platform || navigator.platform || '';
  const kind = /iPhone|iPad|iPod/i.test(ua) || (/Mac/i.test(platform) && navigator.maxTouchPoints > 1) ? 'ios' : /Android/i.test(ua) ? 'android' : /Mac/i.test(platform) ? 'mac' : /Win/i.test(platform) ? 'windows' : '';
  if (kind) { const card = document.querySelector(`[data-platform="${kind}"]`); if (card) { card.classList.add('recommended'); card.querySelector('.tag').hidden = false; } }

  const instructions = {
    android: 'Di Chrome, buka menu ⋮ lalu pilih “Instal aplikasi” atau “Tambahkan ke layar utama”.',
    windows: 'Di Chrome atau Edge, buka menu browser lalu pilih “Instal MySpensab”.',
    mac: 'Di Chrome atau Edge, buka menu browser dan pilih opsi instal aplikasi. Safari dapat menawarkan “Add to Dock”.',
    ios: 'Pastikan halaman terbuka di Safari. Tekan Bagikan, pilih “Tambahkan ke Layar Utama”, lalu tekan Tambahkan.'
  };
  document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => {
    const target = button.dataset.open;
    document.getElementById('guide-title').textContent = `Cara memasang di ${target === 'ios' ? 'iPhone' : target === 'mac' ? 'MacBook' : target === 'windows' ? 'PC Windows' : 'Android'}`;
    document.getElementById('guide-copy').innerHTML = `<p>${instructions[target]}</p><p><a class="cta primary" href="${appUrl}?pasang=1" target="_blank" rel="noopener">Pasang MySpensab ↗</a></p>`;
    const guide = document.getElementById('guide'); guide.classList.add('show'); guide.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));

  document.getElementById('openDesigner').addEventListener('click', () => dialog.showModal());
  document.getElementById('closeDesigner').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.getElementById('customBackground').addEventListener('input', event => { state.background = event.target.value; state.wallpaper = ''; applyCustomColors(); persist(); });
  document.getElementById('customAccent').addEventListener('input', event => { state.accent = event.target.value; applyCustomColors(); persist(); });
  document.getElementById('wallpaperUpload').addEventListener('change', event => readImage(event.target.files[0], data => { state.wallpaper = data; applyCustomColors(); persist(); }));
  document.getElementById('addImageBlock').addEventListener('click', () => document.getElementById('blockImageUpload').click());
  document.getElementById('blockImageUpload').addEventListener('change', event => readImage(event.target.files[0], data => {
    const caption = window.prompt('Teks kecil di bawah gambar:', 'MySpensab');
    if (caption === null) return;
    state.image = { src: data, caption };
    state.hidden.customImage = false;
    if (!state.order.includes('customImage')) state.order.splice(Math.max(1, state.order.indexOf('hero') + 1), 0, 'customImage');
    addImageToPage(); applyOrder(); persist();
  }));
  document.getElementById('resetDesign').addEventListener('click', () => {
    if (!window.confirm('Pulihkan tema dan susunan blok seperti semula?')) return;
    state = { theme: 0, accent: '', background: '', wallpaper: '', hidden: {}, order: [...defaultOrder], image: null };
    applyTheme(0); addImageToPage();
    getBlocks().forEach(block => { delete block.dataset.designHidden; });
    applyOrder(); persist('Desain awal dipulihkan');
  });

  addImageToPage();
  if (state.accent || state.background || state.wallpaper) applyCustomColors();
  else applyTheme(state.theme);
  getBlocks().forEach(block => { block.dataset.designHidden = String(Boolean(state.hidden[block.dataset.editBlock])); });
  applyOrder();
})();
