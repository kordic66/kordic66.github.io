/* ============================================
   9A4KJ — Shared Theme & Nav
   Persists dark/light mode across ALL pages
   via localStorage.
   ============================================ */

(function () {
  'use strict';

  var STORAGE_KEY = '9a4kj-theme';

  /* ---- Apply theme IMMEDIATELY (before paint) ---- */
  var savedTheme = localStorage.getItem(STORAGE_KEY);
  var theme = savedTheme || 'dark';
  document.documentElement.setAttribute('data-theme', theme);

  /* ---- CSS variables injected for light mode ---- */
  var lightStyle = document.createElement('style');
  lightStyle.textContent = `
    [data-theme="light"] {
      --primary: #007a40 !important;
      --primary-dim: rgba(0,122,64,0.10) !important;
      --bg: #f2f2ee !important;
      --surface: #ffffff !important;
      --card-bg: #ffffff !important;
      --card-hover: #ebebeb !important;
      --text: #1a1a20 !important;
      --text-muted: #5a5a68 !important;
      --text-faint: #a0a0aa !important;
      --border: rgba(0,0,0,0.09) !important;
      --border-hover: rgba(0,122,64,0.4) !important;
    }
    [data-theme="light"] body {
      background: #f2f2ee !important;
      color: #1a1a20 !important;
    }
    [data-theme="light"] .page-nav {
      background: rgba(242,242,238,0.88) !important;
    }
  `;
  document.head.appendChild(lightStyle);

  /* ---- Build shared nav HTML ---- */
  function buildNav() {
    var nav = document.createElement('nav');
    nav.className = 'page-nav';
    nav.innerHTML = `
      <div class="page-nav-inner">
        <a href="index.html" class="page-nav-brand">9A4KJ</a>
        <div class="page-nav-links">
          <a href="index.html#projects">Projects</a>
          <a href="index.html#archives">Archives</a>
          <a href="index.html#teorija">Theory</a>
          <a href="index.html#about">About</a>
        </div>
        <button class="page-nav-theme" id="theme-btn" aria-label="Toggle theme" title="Toggle light/dark mode"></button>
        <button class="page-nav-hamburger" id="nav-hamburger" aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="page-nav-mobile" id="nav-mobile">
        <a href="index.html">Home</a>
        <a href="index.html#projects">Projects</a>
        <a href="index.html#archives">Archives</a>
        <a href="index.html#teorija">Theory</a>
        <a href="index.html#about">About</a>
      </div>
    `;

    /* Nav styles */
    var navStyle = document.createElement('style');
    navStyle.textContent = `
      .page-nav {
        position: fixed; top:0; left:0; right:0; z-index:1000;
        background: rgba(10,10,12,0.88);
        backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
        border-bottom: 1px solid rgba(255,255,255,0.07);
        transition: background 0.3s ease;
        font-family: 'Satoshi','Inter','Helvetica Neue',sans-serif;
      }
      .page-nav-inner {
        max-width: 1100px; margin: 0 auto; padding: 0 2rem;
        height: 58px; display: flex; align-items: center; gap: 1.5rem;
      }
      .page-nav-brand {
        font-family: 'JetBrains Mono','Courier New',monospace;
        font-weight: 700; font-size: 1rem; color: var(--primary, #00ff88);
        text-decoration: none; margin-right: auto; letter-spacing: 0.05em;
      }
      .page-nav-links { display: flex; gap: 1.5rem; }
      .page-nav-links a {
        font-size: 0.8rem; font-weight: 500; letter-spacing: 0.1em;
        text-transform: uppercase; color: var(--text-muted, #7a7a88);
        text-decoration: none; transition: color 0.2s;
      }
      .page-nav-links a:hover { color: var(--text, #e0e0e6); }
      .page-nav-theme {
        background: none; border: 1px solid rgba(255,255,255,0.12);
        border-radius: 6px; padding: 5px 10px; cursor: pointer;
        color: var(--text-muted, #7a7a88); font-size: 0.9rem;
        transition: color 0.2s, border-color 0.2s; line-height: 1;
      }
      .page-nav-theme:hover { color: var(--primary,#00ff88); border-color: var(--primary,#00ff88); }
      .page-nav-hamburger {
        display: none; flex-direction: column; gap: 5px;
        background: none; border: none; cursor: pointer; padding: 4px;
      }
      .page-nav-hamburger span {
        display: block; width: 22px; height: 1.5px;
        background: var(--text,#e0e0e6);
        transition: transform 0.25s ease, opacity 0.25s ease;
      }
      .page-nav-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
      .page-nav-hamburger.open span:nth-child(2) { opacity: 0; }
      .page-nav-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }
      .page-nav-mobile {
        display: none; flex-direction: column; gap: 0;
        border-top: 1px solid rgba(255,255,255,0.07);
        background: rgba(10,10,12,0.97);
      }
      .page-nav-mobile.open { display: flex; }
      .page-nav-mobile a {
        padding: 1rem 2rem; font-size: 1rem; color: var(--text-muted,#7a7a88);
        text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05);
        transition: color 0.2s, background 0.2s; letter-spacing: 0.05em;
        text-transform: uppercase; font-size: 0.85rem;
      }
      .page-nav-mobile a:hover { color: var(--primary,#00ff88); background: rgba(255,255,255,0.03); }
      /* Push page content below fixed nav */
      body { padding-top: 58px !important; }
      @media (max-width: 768px) {
        .page-nav-links { display: none; }
        .page-nav-hamburger { display: flex; }
      }
    `;
    document.head.appendChild(navStyle);

    /* Insert nav as first child of body */
    document.body.insertBefore(nav, document.body.firstChild);

    /* Theme button */
    function setThemeBtn(t) {
      var btn = document.getElementById('theme-btn');
      if (!btn) return;
      btn.textContent = t === 'dark' ? '☀ Light' : '☾ Dark';
    }
    setThemeBtn(theme);

    document.getElementById('theme-btn').addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(STORAGE_KEY, theme);
      setThemeBtn(theme);
    });

    /* Hamburger */
    var hamburger = document.getElementById('nav-hamburger');
    var mobileMenu = document.getElementById('nav-mobile');
    hamburger.addEventListener('click', function () {
      var open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ---- Run after DOM ready ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }

})();
