/* MYSTER — renders content from data/content.js, notice accordion, gallery album scroll */
(function () {
  'use strict';

  var DATA = window.MYSTER || { notices: [], members: [], albums: [] };
  var PAGE = document.body.getAttribute('data-page') || 'home';
  var ROOT = document.body.getAttribute('data-root') || '';
  var IMG = ROOT + 'assets/img/';
  var NAV_OFFSET = 96;

  /* Old single-page links (…/MYSTER/#about, #notice/web, #gallery/2412) → new pages */
  function legacyRedirect() {
    var old = (location.hash || '').replace(/^#\/?/, '').split('/');
    var map = { about: '', members: '', notice: '', gallery: 'album-', contact: '' };
    if (old[0] && map.hasOwnProperty(old[0])) {
      location.replace(old[0] + '/' + (old[1] ? '#' + map[old[0]] + old[1] : ''));
      return true;
    }
    return false;
  }
  if (PAGE === 'home') {
    if (legacyRedirect()) return;
    window.addEventListener('hashchange', legacyRedirect);
  }

  var ICON_RIGHT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
  var ICON_UPRIGHT = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>';

  function $(sel) { return document.querySelector(sel); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function hashArg() { return decodeURIComponent((location.hash || '').slice(1)); }

  /* Image slot: empty surface box until the file exists in assets/img/ */
  function slot(src, alt, cls) {
    return '<div class="slot' + (cls ? ' ' + cls : '') + '" role="img" aria-label="' + esc(alt) + '">' +
      (src ? '<img src="' + esc(IMG + src) + '" alt="' + esc(alt) + '" loading="lazy">' : '') + '</div>';
  }
  function wireImages() {
    document.querySelectorAll('.slot > img').forEach(function (img) {
      var parent = img.parentNode;
      function fail() { img.remove(); }
      function ok() { parent.removeAttribute('role'); parent.removeAttribute('aria-label'); }
      if (img.complete) { img.naturalWidth ? ok() : fail(); }
      else { img.addEventListener('error', fail); img.addEventListener('load', ok); }
    });
  }

  /* ---------- home ---------- */
  function renderHome() {
    $('#home-notices').innerHTML = DATA.notices.slice(0, 3).map(function (n) {
      return '<a class="notice-card" href="' + ROOT + 'notice/#' + esc(n.id) + '">' +
        '<span class="title">' + esc(n.title) + '</span>' +
        '<span class="date">' + esc(n.date) + '</span></a>';
    }).join('');

    function feat(al, i, cls) {
      if (!al) return '<div class="slot' + (cls ? ' ' + cls : '') + '"></div>';
      var cap = '<a class="caption" href="' + ROOT + 'gallery/#album-' + esc(al.key) + '"><span>' +
        esc(al.date) + ' · ' + esc(al.title) + '</span>' + ICON_RIGHT + '</a>';
      return slot(al.photos[i], al.date + ' ' + al.title + ' 사진 ' + (i + 1), cls).replace(/<\/div>$/, cap + '</div>');
    }
    var a = DATA.albums;
    $('#home-gallery').innerHTML =
      feat(a[0], 0, 'feat-main') +
      '<div class="feat-stack">' + feat(a[0], 1) + feat(a[1] || a[0], a[1] ? 0 : 2) + '</div>';
  }

  /* ---------- members ---------- */
  function renderMembers() {
    $('#members-grid').innerHTML = DATA.members.map(function (m) {
      var link = function (label, href) {
        if (!href) return '';
        return '<a class="link-btn" href="' + esc(href) + '"' + (href !== '#' ? ' target="_blank" rel="noopener"' : '') + '><span>' + label + '</span>' + ICON_UPRIGHT + '</a>';
      };
      return '<article class="member">' + slot(m.photo, m.name + ' 사진') +
        '<div class="info"><span class="name">' + esc(m.name) + '</span><span class="affil">' + esc(m.affiliation) + '</span></div>' +
        '<div class="links">' + link('Home', m.home) + link('ORCID', m.orcid) + '</div></article>';
    }).join('');
  }

  /* ---------- notice: one open at a time, click again to close ---------- */
  var openNotice = null;
  function renderNotices() {
    $('#notice-list').innerHTML = DATA.notices.map(function (n, i) {
      var isOpen = openNotice === n.id;
      return '<div class="notice-item">' +
        '<a class="notice-toggle notice-row-grid" href="#' + esc(n.id) + '" data-notice="' + esc(n.id) + '" aria-expanded="' + isOpen + '">' +
        '<span class="no">' + (DATA.notices.length - i) + '</span><span class="title">' + esc(n.title) + '</span><span class="date">' + esc(n.date) + '</span></a>' +
        (isOpen ? '<div class="notice-body"><p>' + esc(n.body) + '</p></div>' : '') +
        '</div>';
    }).join('');
  }
  function initNotice() {
    openNotice = hashArg() || null;
    renderNotices();
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-notice]');
      if (!t) return;
      e.preventDefault();
      var id = t.getAttribute('data-notice');
      openNotice = openNotice === id ? null : id;
      history.replaceState(null, '', location.pathname + location.search + (openNotice ? '#' + encodeURIComponent(openNotice) : ''));
      renderNotices();
    });
    window.addEventListener('hashchange', function () { openNotice = hashArg() || null; renderNotices(); });
  }

  /* ---------- gallery ---------- */
  function renderGallery() {
    $('#gallery-wrap').innerHTML = DATA.albums.map(function (al) {
      return '<section class="album" id="album-' + esc(al.key) + '">' +
        '<div class="album-head"><span class="date">' + esc(al.date) + '</span><span class="title">' + esc(al.title) + '</span></div>' +
        '<div class="album-grid">' + al.photos.map(function (p, i) {
          return slot(p, al.date + ' ' + al.title + ' 사진 ' + (i + 1));
        }).join('') + '</div></section>';
    }).join('');
  }
  function scrollToAlbum() {
    var el = document.getElementById(hashArg());
    if (!el) return;
    var offset = Math.max(NAV_OFFSET, $('.nav').offsetHeight + 16);
    requestAnimationFrame(function () {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  }
  function initGallery() {
    renderGallery();
    if (location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      scrollToAlbum();
    }
    window.addEventListener('hashchange', scrollToAlbum);
  }

  if (PAGE === 'home') renderHome();
  if (PAGE === 'members') renderMembers();
  if (PAGE === 'notice') initNotice();
  if (PAGE === 'gallery') initGallery();
  wireImages();
})();
