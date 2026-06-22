// Options Dashboard Logic — Dispatch Box Chrome Extension

document.addEventListener('DOMContentLoaded', async () => {

  // ── State ─────────────────────────────────────────────────────
  let appData = {
    scripts: []
  };

  // ── DOM: Header ───────────────────────────────────────────────
  const btnExport        = document.getElementById('btn-export');
  const btnImportTrigger = document.getElementById('btn-import-trigger');
  const fileImportInput  = document.getElementById('file-import');
  const toastContainer   = document.getElementById('toast-container');

  // ── DOM: Scripts Main Panel ──────────────────────────────────
  const filterCategory = document.getElementById('filter-category');
  const btnNewScript   = document.getElementById('btn-new-script');
  const scriptsGrid    = document.getElementById('scripts-grid');
  const noScriptsMsg   = document.getElementById('no-scripts-msg');

  // ── DOM: Drawer ───────────────────────────────────────────────
  const scriptDrawer     = document.getElementById('script-drawer');
  const drawerBackdrop   = document.getElementById('drawer-backdrop');
  const drawerTitle      = document.getElementById('drawer-title');
  const btnCloseDrawer   = document.getElementById('btn-close-drawer');
  const scriptForm       = document.getElementById('script-form');
  const scriptIdInput    = document.getElementById('script-id');
  const scriptTitleInput = document.getElementById('script-title');
  const scriptCatSelect  = document.getElementById('script-category');
  const textAr           = document.getElementById('text-ar');
  const textEn           = document.getElementById('text-en');
  const textCkb          = document.getElementById('text-ckb');
  const btnSaveScript    = document.getElementById('btn-save-script');
  const btnDeleteScript  = document.getElementById('btn-delete-script');
  const langTabs         = document.querySelectorAll('.lang-tab');
  const langPanels       = document.querySelectorAll('.lang-panel');

  // ── Bootstrap ─────────────────────────────────────────────────
  await loadData();
  renderScriptsGrid();

  // ── Scripts Tab: Filters ──────────────────────────────────────
  filterCategory.addEventListener('change', renderScriptsGrid);

  // ── Scripts Tab: New Script button ────────────────────────────
  btnNewScript.addEventListener('click', () => openDrawer(null));

  // ── Drawer: Close ─────────────────────────────────────────────
  btnCloseDrawer.addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);

  // ── Drawer: Language Tabs ─────────────────────────────────────
  langTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      langTabs.forEach(t => t.classList.remove('active'));
      langPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`panel-${tab.dataset.lang}`).classList.add('active');
    });
  });

  // ── Drawer: Form Submit ───────────────────────────────────────
  scriptForm.addEventListener('submit', handleSaveScript);

  // ── Drawer: Delete ────────────────────────────────────────────
  btnDeleteScript.addEventListener('click', handleDeleteScript);

  // ── Export / Import ───────────────────────────────────────────
  btnExport.addEventListener('click', exportData);
  btnImportTrigger.addEventListener('click', () => fileImportInput.click());
  fileImportInput.addEventListener('change', importData);

  // ═══════════════════════════════════════════════════════════════
  //  STORAGE
  // ═══════════════════════════════════════════════════════════════

  async function loadData() {
    return new Promise(resolve => {
      chrome.storage.local.get(['initialized', 'scripts'], result => {
        if (!result.initialized) {
          const seed = {
            initialized: true,
            scripts: DEFAULT_DATA.scripts,
            lastLanguage: 'ar',
            lastCategory: 'driver'
          };
          chrome.storage.local.set(seed, () => {
            appData.scripts = DEFAULT_DATA.scripts;
            if (filterCategory) filterCategory.value = 'driver';
            resolve();
          });
        } else {
          appData.scripts = result.scripts || [];
          if (filterCategory) filterCategory.value = 'driver'; // Set initial filter properly if 'all' is removed
          resolve();
        }
      });
    });
  }

  function saveData() {
    return new Promise(resolve => {
      chrome.storage.local.set({ scripts: appData.scripts }, resolve);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  //  SCRIPTS GRID
  // ═══════════════════════════════════════════════════════════════

  let draggedId = null;

  function renderScriptsGrid() {
    scriptsGrid.innerHTML = '';
    let cat = filterCategory.value;
    if (cat === 'all') cat = 'driver'; // fallback just in case
    
    // Array order is the visual order
    const filtered = appData.scripts.filter(s => s.category === cat);

    if (filtered.length === 0) {
      noScriptsMsg.style.display = 'flex';
      scriptsGrid.style.display  = 'none';
      return;
    }
    noScriptsMsg.style.display = 'none';
    scriptsGrid.style.display  = 'grid';

    filtered.forEach(script => {
      const card = document.createElement('div');
      card.className = `script-card ${script.category}`;

      const date = new Date(script.updatedAt).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      });

      card.innerHTML = `
        <div class="card-top">
          <span class="card-title-text">${escHtml(script.title)}</span>
          <div class="card-badges">
            <span class="badge ${script.category}">${catLabel(script.category)}</span>
          </div>
        </div>
        <div class="card-preview">${escHtml(script.text.ar || script.text.en || '')}</div>
        <div class="card-footer-row">
          <span class="card-date">${date}</span>
          <span class="card-edit-hint">Click to edit →</span>
        </div>`;

      card.addEventListener('click', () => openDrawer(script));
      
      // Drag & Drop
      card.setAttribute('draggable', 'true');
      card.addEventListener('dragstart', (e) => {
        draggedId = script.id;
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => card.style.opacity = '0.5', 0);
      });
      card.addEventListener('dragend', () => {
        card.style.opacity = '1';
        draggedId = null;
        document.querySelectorAll('.script-card').forEach(c => c.classList.remove('drag-over'));
      });
      card.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (draggedId !== script.id) card.classList.add('drag-over');
      });
      card.addEventListener('dragleave', () => {
        card.classList.remove('drag-over');
      });
      card.addEventListener('drop', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        card.classList.remove('drag-over');
        if (!draggedId || draggedId === script.id) return;
        
        const oldIndex = appData.scripts.findIndex(s => s.id === draggedId);
        const newIndex = appData.scripts.findIndex(s => s.id === script.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          const [moved] = appData.scripts.splice(oldIndex, 1);
          appData.scripts.splice(newIndex, 0, moved);
          await saveData();
          renderScriptsGrid();
        }
      });

      scriptsGrid.appendChild(card);
    });
  }

  // ═══════════════════════════════════════════════════════════════
  //  DRAWER (Add / Edit Script)
  // ═══════════════════════════════════════════════════════════════

  function openDrawer(script) {
    // Reset drawer language tabs to Arabic
    langTabs.forEach(t => t.classList.toggle('active', t.dataset.lang === 'ar'));
    langPanels.forEach(p => p.classList.toggle('active', p.id === 'panel-ar'));

    if (script) {
      // Edit mode
      drawerTitle.textContent     = 'Edit Script';
      scriptIdInput.value         = script.id;
      scriptTitleInput.value      = script.title;
      scriptCatSelect.value       = script.category;
      textAr.value                = script.text.ar  || '';
      textEn.value                = script.text.en  || '';
      textCkb.value               = script.text.ckb || '';
      btnSaveScript.textContent   = 'Save Changes';
      btnDeleteScript.style.display = 'flex';
    } else {
      // New mode
      drawerTitle.textContent     = 'New Script';
      scriptIdInput.value         = '';
      scriptForm.reset();
      btnSaveScript.textContent   = 'Save Script';
      btnDeleteScript.style.display = 'none';
    }

    scriptDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => scriptTitleInput.focus(), 280);
  }

  function closeDrawer() {
    scriptDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  async function handleSaveScript(e) {
    e.preventDefault();
    const id       = scriptIdInput.value;
    const title    = scriptTitleInput.value.trim();
    const category = scriptCatSelect.value;
    const ar       = textAr.value.trim();
    const en       = textEn.value.trim();
    const ckb      = textCkb.value.trim();

    if (!title || !category || !ar || !en || !ckb) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const scriptData = {
      title, category,
      text: { ar, en, ckb },
      updatedAt: new Date().toISOString()
    };

    if (id) {
      const idx = appData.scripts.findIndex(s => s.id === id);
      if (idx !== -1) {
        scriptData.id = id;
        appData.scripts[idx] = scriptData;
        showToast('Script updated!');
      } else {
        showToast('Script not found.', 'error');
        return;
      }
    } else {
      scriptData.id = Date.now().toString();
      appData.scripts.push(scriptData);
      showToast('Script added!');
    }

    await saveData();
    closeDrawer();
    renderScriptsGrid();
  }

  async function handleDeleteScript() {
    const id = scriptIdInput.value;
    if (!id) return;
    if (!confirm('Delete this script permanently?')) return;

    appData.scripts = appData.scripts.filter(s => s.id !== id);
    await saveData();
    closeDrawer();
    renderScriptsGrid();
    showToast('Script deleted.');
  }

  // ═══════════════════════════════════════════════════════════════
  //  EXPORT / IMPORT
  // ═══════════════════════════════════════════════════════════════

  function exportData() {
    const data = JSON.stringify({ version: '1.1.0', scripts: appData.scripts }, null, 2);
    const date = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
    a.download = `dispatch_box_backup_${date}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Data exported successfully!');
  }

  function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async ev => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (!imported.scripts) {
          showToast('Invalid file format — not a Dispatch Box backup.', 'error'); return;
        }
        const merge = confirm(
          'Import successful!\n\n' +
          'OK → Merge with existing data\n' +
          'Cancel → Replace all existing data'
        );
        if (merge) {
          imported.scripts.forEach(imp => {
            const idx = appData.scripts.findIndex(s => s.id === imp.id);
            if (idx !== -1) {
              appData.scripts[idx] = imp;
            } else {
              appData.scripts.push(imp);
            }
          });
          showToast('Data merged successfully!');
        } else {
          appData.scripts = imported.scripts;
          showToast('Data replaced successfully!');
        }
        await saveData();
        renderScriptsGrid();
        fileImportInput.value = '';
      } catch {
        showToast('Failed to read the file. It may be corrupted.', 'error');
      }
    };
    reader.readAsText(file);
  }

  // ═══════════════════════════════════════════════════════════════
  //  UTILITIES
  // ═══════════════════════════════════════════════════════════════

  function catLabel(cat) {
    return { driver: 'Driver', customer: 'Customer', general: 'General' }[cat] || cat;
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3100);
  }

});
