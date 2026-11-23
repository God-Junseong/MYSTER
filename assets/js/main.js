/* MYSTER — hash routing, notice accordion, gallery anchor scroll */
(function () {
  'use strict';

  var DATA = window.MYSTER || { notices: [], members: [], albums: [] };
  var IMG = 'assets/img/';
  var NAV_OFFSET = 96;
  var PAGES = ['home', 'about', 'members', 'notice', 'gallery', 'contact'];
  var SUBS = {
    about: { kicker: 'About', title: 'MYSTER' },
    members: { kicker: 'Members', title: 'Our Team' },
    notice: { kicker: 'Notice', title: '공지사항' },
    gallery: { kicker: 'Gallery', title: '갤러리' },
    contact: { kicker: 'Contact', title: '참여 및 문의' },
  };

  var ICON_RIGHT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
  var ICON_UPRIGHT = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg>';

  var openNotice = null;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Image slot: empty surface box until the file exists in assets/img/ */
  function slot(src, alt, cls) {
    return '<div class="slot' + (cls ? ' ' + cls : '') + '" role="img" aria-label="' + esc(alt) + '">' +
      (src ? '<img src="' + esc(IMG + src) + '" alt="' + esc(alt) + '" loading="lazy">' : '') + '</div>';
  }
  function wireImages(root) {
    root.querySelectorAll('.slot > img').forEach(function (img) {
      var parent = img.parentNode;
      function fail() { img.remove(); }
      function ok() { parent.removeAttribute('role'); parent.removeAttribute('aria-label'); }
      if (img.complete) { img.naturalWidth ? ok() : fail(); }
      else { img.addEventListener('error', fail); img.addEventListener('load', ok); }
    });
  }

  /* ---------- render ---------- */
  function noticeNo(i) { return String(DATA.notices.length - i); }

  function renderHomeNotices() {
    $('#home-notices').innerHTML = DATA.notices.slice(0, 3).map(function (n) {
      return '<a class="notice-card" href="#notice/' + esc(n.id) + '">' +
        '<span class="title">' + esc(n.title) + '</span>' +
        '<span class="date">' + esc(n.date) + '</span></a>';
    }).join('');
  }

  function caption(al) {
    return '<a class="caption" href="#gallery/' + esc(al.key) + '"><span>' + esc(al.date) + ' · ' + esc(al.title) + '</span>' + ICON_RIGHT + '</a>';
  }
  function feat(al, i, cls) {
    if (!al) return '<div class="slot' + (cls ? ' ' + cls : '') + '"></div>';
    var alt = al.date + ' ' + al.title + ' 사진 ' + (i + 1);
    return slot(al.photos[i], alt, cls).replace(/<\/div>$/, caption(al) + '</div>');
  }
  function renderHomeGallery() {
    var a = DATA.albums;
    $('#home-gallery').innerHTML =
      feat(a[0], 0, 'feat-main') +
      '<div class="feat-stack">' + feat(a[0], 1) + feat(a[1] || a[0], a[1] ? 0 : 2) + '</div>';
  }

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

  function renderNotices() {
    $('#notice-list').innerHTML = DATA.notices.map(function (n, i) {
      var isOpen = openNotice === n.id;
      return '<div class="notice-item">' +
        '<a class="notice-toggle notice-row-grid" href="#notice/' + esc(n.id) + '" data-notice="' + esc(n.id) + '" aria-expanded="' + isOpen + '">' +
        '<span class="no">' + noticeNo(i) + '</span><span class="title">' + esc(n.title) + '</span><span class="date">' + esc(n.date) + '</span></a>' +
        (isOpen ? '<div class="notice-body"><p>' + esc(n.body) + '</p></div>' : '') +
        '</div>';
    }).join('');
  }

  function renderGallery() {
    $('#gallery-wrap').innerHTML = DATA.albums.map(function (al) {
      return '<section class="album" id="album-' + esc(al.key) + '">' +
        '<div class="album-head"><span class="date">' + esc(al.date) + '</span><span class="title">' + esc(al.title) + '</span></div>' +
        '<div class="album-grid">' + al.photos.map(function (p, i) {
          return slot(p, al.date + ' ' + al.title + ' 사진 ' + (i + 1));
        }).join('') + '</div></section>';
    }).join('');
  }

  /* ---------- routing ---------- */
  function parseHash() {
    var parts = (location.hash || '').replace(/^#\/?/, '').split('/');
    var page = PAGES.indexOf(parts[0]) >= 0 ? parts[0] : 'home';
    return { page: page, arg: parts[1] ? decodeURIComponent(parts[1]) : null };
  }

  function scrollToAlbum(key, tries) {
    var el = document.getElementById('album-' + key);
    if (!el) { if (tries < 30) setTimeout(function () { scrollToAlbum(key, tries + 1); }, 50); return; }
    requestAnimationFrame(function () {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET, behavior: 'smooth' });
    });
  }

  var currentPage = null;
  function route() {
    var r = parseHash();
    var pageChanged = r.page !== currentPage;
    currentPage = r.page;

    document.querySelectorAll('[data-page]').forEach(function (sec) {
      sec.hidden = sec.getAttribute('data-page') !== r.page;
    });
    document.querySelectorAll('.nav a[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === r.page) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    var sub = SUBS[r.page];
    var subHero = $('#sub-hero');
    subHero.hidden = !sub;
    if (sub) {
      $('#sub-kicker').textContent = sub.kicker;
      $('#sub-title').textContent = sub.title;
      $('#sub-fullname').hidden = r.page !== 'about';
      document.title = sub.kicker + ' — MYSTER';
    } else {
      document.title = 'MYSTER';
    }

    if (r.page === 'notice') { openNotice = r.arg; renderNotices(); }

    if (pageChanged || r.page !== 'notice') window.scrollTo({ top: 0, behavior: 'instant' });
    if (r.page === 'gallery' && r.arg) scrollToAlbum(r.arg, 0);
  }

  /* Notice accordion: one open at a time, click again to close */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-notice]');
    if (t) {
      e.preventDefault();
      var id = t.getAttribute('data-notice');
      var next = openNotice === id ? null : id;
      history.replaceState(null, '', next ? '#notice/' + encodeURIComponent(next) : '#notice');
      openNotice = next;
      renderNotices();
      return;
    }
    /* Re-clicking a link to the current hash (e.g. same album caption) still acts */
    var a = e.target.closest('a[href^="#"]');
    if (a && a.getAttribute('href') === location.hash) { e.preventDefault(); currentPage = null; route(); }
  });

  window.addEventListener('hashchange', route);

  renderHomeNotices();
  renderHomeGallery();
  renderMembers();
  renderNotices();
  renderGallery();
  wireImages(document);
  route();
})();
