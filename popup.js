// Popup Logic — Dispatch Box Chrome Extension

document.addEventListener('DOMContentLoaded', async () => {
  // ── Detect Side Panel vs Popup ────────────────────────────────
  try {
    if (typeof chrome !== 'undefined' && chrome.extension && chrome.extension.getViews) {
      const isPopup = chrome.extension.getViews({ type: 'popup' }).includes(window);
      if (!isPopup) document.body.classList.add('sidepanel-view');
    }
  } catch (e) {
    console.error('View detection failed:', e);
  }

  // ── DOM Elements ──────────────────────────────────────────────
  const tabButtons = document.querySelectorAll('.tab-btn');
  const scriptsList = document.getElementById('scripts-list');
  const openOptionsBtn = document.getElementById('open-options');

  // ── State ─────────────────────────────────────────────────────
  let appData = {
    scripts: []
  };
  let currentCategory = 'driver';
  let currentLanguage = 'ar'; // default copy language

  // ── Bootstrap ─────────────────────────────────────────────────
  await loadAppData();
  initUIState();

  // ── Event Listeners ───────────────────────────────────────────
  openOptionsBtn.addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  });

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      chrome.storage.local.set({ lastCategory: currentCategory });
      renderScripts();
    });
  });

  // ── Storage ───────────────────────────────────────────────────
  async function loadAppData() {
    return new Promise(resolve => {
      chrome.storage.local.get(
        ['initialized', 'scripts', 'lastLanguage', 'lastCategory'],
        result => {
          if (!result.initialized) {
            const seed = {
              initialized: true,
              scripts: DEFAULT_DATA.scripts,
              lastLanguage: 'ar',
              lastCategory: 'driver'
            };
            chrome.storage.local.set(seed, () => {
              appData.scripts = DEFAULT_DATA.scripts;
              currentLanguage = 'ar';
              currentCategory = 'driver';
              resolve();
            });
          } else {
            appData.scripts = result.scripts || [];
            currentLanguage = result.lastLanguage || 'ar';
            currentCategory = (result.lastCategory === 'all' || !result.lastCategory) ? 'driver' : result.lastCategory;
            resolve();
          }
        }
      );
    });
  }

  // ── UI Init ───────────────────────────────────────────────────
  function initUIState() {
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-category') === currentCategory);
    });
    renderScripts();
  }

  // ── Render ────────────────────────────────────────────────────
  function renderScripts() {
    scriptsList.innerHTML = '';

    const filtered = appData.scripts.filter(s => s.category === currentCategory);

    if (filtered.length === 0) {
      scriptsList.innerHTML = `
        <div class="empty-state" style="display:flex;">
          <p>No scripts match the current filters.</p>
        </div>`;
      return;
    }

    filtered.forEach(script => scriptsList.appendChild(createCard(script)));
  }

  // ── Card Builder ──────────────────────────────────────────────
  function createCard(script) {
    const card = document.createElement('div');
    card.className = `script-card ${script.category}`;
    card.setAttribute('data-id', script.id);

    // Header
    const header = document.createElement('div');
    header.className = 'card-header';

    const headerLeft = document.createElement('div');
    headerLeft.className = 'card-header-left';

    const title = document.createElement('h3');
    title.className = 'card-title';
    title.textContent = script.title;

    headerLeft.appendChild(title);

    const badge = document.createElement('div');
    badge.className = 'card-badge';
    badge.textContent = script.category === 'driver' ? 'Driver' : script.category === 'customer' ? 'Customer' : 'General';

    header.appendChild(headerLeft);
    header.appendChild(badge);

    // Body
    const body = document.createElement('div');
    body.className = `card-body text-${currentLanguage}`;
    body.textContent = script.text[currentLanguage] || script.text['ar'] || '';

    // Footer
    const footer = document.createElement('div');
    footer.className = 'card-footer';

    // Language switcher
    const switcher = document.createElement('div');
    switcher.className = 'lang-switcher';

    let cardLang = currentLanguage;

    [{ code: 'ar', label: 'AR' }, { code: 'en', label: 'EN' }, { code: 'ckb', label: 'KRD' }]
      .forEach(({ code, label }) => {
        const btn = document.createElement('button');
        btn.className = `lang-btn${cardLang === code ? ' active' : ''}`;
        btn.textContent = label;
        btn.addEventListener('click', e => {
          e.stopPropagation();
          switcher.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          cardLang = code;
          body.className = `card-body text-${cardLang}`;
          body.textContent = script.text[cardLang] || '';
          currentLanguage = cardLang;
          chrome.storage.local.set({ lastLanguage: currentLanguage });
        });
        switcher.appendChild(btn);
      });

    // Copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span>Copy</span>`;

    copyBtn.addEventListener('click', () => {
      const text = script.text[cardLang] || '';
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.classList.add('copied');
        copyBtn.querySelector('span').textContent = '✓ Copied!';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.querySelector('span').textContent = 'Copy';
        }, 2000);
      }).catch(err => console.error('Clipboard error:', err));
    });

    footer.appendChild(switcher);
    footer.appendChild(copyBtn);

    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(footer);
    return card;
  }
});
