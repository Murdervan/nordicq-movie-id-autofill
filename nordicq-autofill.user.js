// ==UserScript==
// @name         NordicQ Movie ID Auto-Fill
// @namespace    https://github.com/murdervan
// @version      1.0.0
// @description  Auto-fill TMDB / IMDB IDs on NordicQ request form + quick link to Movie ID Finder
// @match        https://nordicq.org/requests/create*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  /* =========================
     Utils
  ========================== */

  const $ = sel => document.querySelector(sel);

  function trigger(el) {
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /* =========================
     Field detection
  ========================== */

  function getFields() {
    return {
      tmdb: $('input[name="tmdb"], input[placeholder*="TMDB"]'),
      imdb: $('input[name="imdb"], input[placeholder*="IMDB"]'),
      mal:  $('input[name="mal"],  input[placeholder*="MAL"]'),
      title:$('input[name="title"], input[placeholder*="Titel"]')
    };
  }

  /* =========================
     Auto-paste handler
  ========================== */

  document.addEventListener('paste', e => {
    const text = (e.clipboardData || window.clipboardData)
      .getData('text')
      .trim();

    const { tmdb, imdb } = getFields();

    // TMDB → kun tal
    if (/^\d+$/.test(text) && tmdb) {
      tmdb.value = text;
      trigger(tmdb);
    }

    // IMDB → tt1234567 eller 1234567
    if (/^(tt)?\d{7,}$/.test(text) && imdb) {
      imdb.value = text.replace(/^tt/, '');
      trigger(imdb);
    }
  });

  /* =========================
     Inject "Find Movie ID" button
  ========================== */

  function injectButton() {
    if ($('#movie-id-finder-btn')) return;

    const form = $('form');
    if (!form) return;

    const btn = document.createElement('button');
    btn.id = 'movie-id-finder-btn';
    btn.type = 'button';
    btn.textContent = '🎬 Find Movie ID';
    btn.style.cssText = `
      margin-bottom: 12px;
      padding: 8px 14px;
      border-radius: 8px;
      background: linear-gradient(90deg,#1da1f2,#f1c40f);
      color: #000;
      font-weight: bold;
      cursor: pointer;
      border: none;
    `;

    btn.onclick = () => {
      window.open('https://murdervan.github.io/movie-id-finder/', '_blank');
    };

    form.prepend(btn);
  }

  /* =========================
     Init (wait for Vue/React)
  ========================== */

  const wait = setInterval(() => {
    if ($('input')) {
      injectButton();
      clearInterval(wait);
    }
  }, 500);

})();
