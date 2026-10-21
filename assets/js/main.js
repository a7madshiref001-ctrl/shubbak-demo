/* ATHR cafe demo engine — main.js
   خفيف ومن غير مكتبات: رسم المنيو والمفضلات، السلة، «أنت فين»، وظهور هادي للعناصر. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var S = window.SITE;
  var PRICES = S.prices !== false;
  var CUR = '<small>ر.س</small>';

  /* كل صنف بأحجام بيتحوّل لأصناف فرعية في السلة: id@0 ، id@1 */
  var byId = {};
  S.items.forEach(function (it) {
    byId[it.id] = it;
    (it.sizes || []).forEach(function (sz, i) {
      byId[it.id + '@' + i] = { id: it.id + '@' + i, ar: it.ar + ' — ' + sz[0], price: sz[1], img: it.img, icon: it.icon, cat: it.cat };
    });
  });

  var fmt = function (n) { return Number.isInteger(n) ? String(n) : n.toFixed(2); };
  var src = function (key, small) { return 'assets/img/' + key + (small ? '-sm' : '') + '.webp'; };
  var PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
  var ICONS = {
    hot: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9Z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8.5 3.5c-.8 1 .8 1.8 0 3M12 3.5c-.8 1 .8 1.8 0 3"/></svg>',
    cold: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l-1.4 12.2a1.8 1.8 0 0 1-1.8 1.6H9.2a1.8 1.8 0 0 1-1.8-1.6L6 7Z"/><path d="M5 7h14M13 7l2-4.5"/><rect x="9" y="10.5" width="3" height="3" rx=".6"/><rect x="12.4" y="13.4" width="3" height="3" rx=".6"/></svg>',
    sweet: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5 18.5 7v11.5H4v-6Z"/><path d="M4 12.5h14.5M4 15.5h14.5"/><path d="M18.5 7c1.4.8 1.6 2.6.6 3.6"/></svg>',
    bake: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 14c0-4 3.8-7.5 8.5-7.5s8.5 3.5 8.5 7.5c0 1.6-1.2 2.5-2.6 2.5H6.1c-1.4 0-2.6-.9-2.6-2.5Z"/><path d="M9 7.2 10.4 16M15 7.2 13.6 16"/></svg>',
    waffle: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9.3 4v16M14.7 4v16M4 9.3h16M4 14.7h16"/></svg>'
  };
  var icon = function (it) { return ICONS[it.icon] || ICONS.hot; };
  var addBtn = function (id, label) { return '<button class="add js-add" data-id="' + id + '" aria-label="أضف ' + label + '">' + PLUS + '</button>'; };
  var priceTag = function (p, from) { return '<span class="price">' + (from ? '<em>من</em>' : '') + fmt(p) + CUR + '</span>'; };
  var thumb = function (it, eager) { return it.img ? '<img src="' + src(it.img, true) + '" alt=""' + (eager ? '' : ' loading="lazy"') + ' decoding="async" width="48" height="48">' : icon(it); };
  var firstId = function (it) { return it.sizes ? it.id + '@0' : it.id; };

  /* ---------- 02 Favorites ---------- */
  var fav = $('.js-fav');
  fav.innerHTML = S.favorites.map(function (f) {
    var it = byId[f.id];
    var foot;
    if (!PRICES) foot = '<span class="card__ask">' + (S.noPriceNote || 'السعر في الفرع') + '</span>' + addBtn(it.id, it.ar);
    else if (it.sizes) foot = priceTag(it.sizes[0][1], true) + addBtn(firstId(it), it.ar);
    else if (it.price != null) foot = priceTag(it.price) + addBtn(it.id, it.ar);
    else foot = '<span class="card__ask">' + (it.note || '') + '</span>';
    var img = f.img || it.img;
    return '<article class="card" role="listitem">' +
      '<div class="card__img"><img src="' + src(img, true) + '" srcset="' + src(img, true) + ' 480w, ' + src(img) + ' 896w" sizes="(min-width: 1000px) 30vw, (min-width: 600px) 42vw, 74vw" alt="' + it.ar + '" loading="lazy" decoding="async" width="480" height="642"></div>' +
      '<div class="card__body"><p class="card__en" lang="en">' + f.en + '</p><h3 class="card__name">' + it.ar + '</h3><p class="card__line">' + f.line + '</p>' +
      '<div class="card__foot">' + foot + '</div></div></article>';
  }).join('');

  /* ---------- 03 Menu ---------- */
  var tabs = $('.js-tabs'), panels = $('.js-panels');
  tabs.style.setProperty('--tabs', S.categories.length);
  var rowHtml = function (it) {
    var meta = [];
    if (it.desc) meta.push(it.desc);
    else if (it.en) meta.push('<span lang="en">' + it.en + '</span>');
    if (it.cal != null) meta.push('<span class="cal">' + it.cal + ' سعرة</span>');
    var head = '<div class="row__thumb">' + thumb(it) + '</div><div><p class="row__name">' + it.ar + '</p>' + (meta.length ? '<p class="row__meta">' + meta.join(' · ') + '</p>' : '') + '</div>';
    if (!PRICES) return '<div class="row row--np">' + head + addBtn(it.id, it.ar) + '</div>';
    if (it.sizes) {
      return '<div class="row row--sz">' + head + '<div class="sizes">' + it.sizes.map(function (sz, i) {
        return '<button class="sz js-add" data-id="' + it.id + '@' + i + '" aria-label="أضف ' + it.ar + ' ' + sz[0] + '">' + sz[0] + ' <b>' + fmt(sz[1]) + '</b><i>' + PLUS + '</i></button>';
      }).join('') + '</div></div>';
    }
    var end = it.price != null ? priceTag(it.price) + addBtn(it.id, it.ar) : '<span class="price">—</span><span></span>';
    return '<div class="row">' + head + end + '</div>';
  };
  S.categories.forEach(function (c, i) {
    var t = document.createElement('button');
    t.className = 'tab'; t.id = 'tab-' + c.id; t.setAttribute('role', 'tab');
    t.setAttribute('aria-controls', 'panel-' + c.id); t.setAttribute('aria-selected', i === 0);
    t.innerHTML = '<span lang="en">' + c.en + '</span><small>' + c.ar + '</small>';
    tabs.appendChild(t);
    var p = document.createElement('div');
    p.className = 'panel'; p.id = 'panel-' + c.id; p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', t.id);
    if (i) p.hidden = true;
    p.innerHTML = S.items.filter(function (it) { return it.cat === c.id; }).map(rowHtml).join('');
    panels.appendChild(p);
  });
  tabs.addEventListener('click', function (e) {
    var t = e.target.closest('.tab');
    if (!t) return;
    $$('.tab', tabs).forEach(function (x) { x.setAttribute('aria-selected', x === t); });
    $$('.panel', panels).forEach(function (p) { p.hidden = p.id !== t.getAttribute('aria-controls'); });
  });

  /* ---------- السلة ---------- */
  var KEY = S.slug + '-tray';
  var tray = new Map();
  var branch = 0;
  try {
    JSON.parse(localStorage.getItem(KEY) || '[]').forEach(function (p) {
      var it = byId[p[0]];
      if (it && !it.sizes && (it.price != null || !PRICES) && p[1] > 0) tray.set(p[0], p[1]);
    });
  } catch (e) { /* التخزين مقفول — عادي */ }
  var save = function () { try { localStorage.setItem(KEY, JSON.stringify(Array.from(tray.entries()))); } catch (e) {} };

  var trayEl = $('.tray'), doneEl = $('.done');
  var branchEl = $('.js-branch');
  if (branchEl && S.branches) {
    branchEl.innerHTML = S.branches.map(function (b, i) { return '<button type="button" data-b="' + i + '" aria-pressed="' + (i === 0) + '">' + b + '</button>'; }).join('');
    branchEl.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      branch = Number(b.dataset.b);
      $$('button', branchEl).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    });
  }
  var render = function () {
    var count = 0, total = 0;
    tray.forEach(function (q, id) { count += q; total += q * (byId[id].price || 0); });
    $('.js-tray-count').textContent = count;
    $('.js-tray-total').textContent = PRICES ? total.toFixed(2) : count;
    $('.js-checkout').disabled = !count;
    $('.js-tray-body').innerHTML = count
      ? Array.from(tray.entries()).map(function (e) {
          var it = byId[e[0]];
          return '<div class="titem"><div class="titem__img">' + thumb(it, true) + '</div><div><p class="titem__name">' + it.ar + '</p>' + (PRICES ? '<span class="titem__price">' + fmt(it.price) + ' ر.س</span>' : '') + '</div>' +
            '<div class="qty"><button data-q="1" data-id="' + it.id + '" aria-label="زوّد">+</button><span>' + e[1] + '</span><button data-q="-1" data-id="' + it.id + '" aria-label="قلّل">−</button></div></div>';
        }).join('')
      : '<p class="tray__empty">' + S.emptyTray + '</p>';
  };
  var toastT;
  var toast = function (msg) {
    var t = $('.js-toast');
    t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('is-on'); }, 1800);
  };
  var openLayer = function (el, on) {
    if (on) { el.hidden = false; requestAnimationFrame(function () { el.classList.add('is-open'); }); document.body.style.overflow = 'hidden'; }
    else { el.classList.remove('is-open'); setTimeout(function () { el.hidden = true; }, 300); document.body.style.overflow = ''; }
  };

  document.addEventListener('click', function (e) {
    var a = e.target.closest('.js-add');
    if (a) {
      var id = a.dataset.id;
      tray.set(id, (tray.get(id) || 0) + 1); save(); render();
      a.classList.add('is-added'); setTimeout(function () { a.classList.remove('is-added'); }, 600);
      var b = $('.tray-btn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
      toast('أُضيف ' + byId[id].ar + ' لطلبك');
      return;
    }
    var q = e.target.closest('.qty button');
    if (q) {
      var v = (tray.get(q.dataset.id) || 0) + Number(q.dataset.q);
      if (v > 0) tray.set(q.dataset.id, v); else tray.delete(q.dataset.id);
      save(); render(); return;
    }
    if (e.target.closest('.js-demo')) { e.preventDefault(); toast(e.target.closest('.js-demo').dataset.msg || 'نسخة عرض: الطلب ما يتبعت فعليًا'); return; }
    if (e.target.closest('.js-open-tray')) { openLayer(trayEl, true); return; }
    if (e.target.closest('.js-close-tray')) { openLayer(trayEl, false); return; }
    if (e.target.closest('.js-checkout')) {
      openLayer(trayEl, false);
      $('.js-order-num').textContent = '#' + S.prefix + '-' + (100 + Math.floor(Math.random() * 900));
      if (S.branches) $('.js-done-t').textContent = S.doneText.replace('{b}', S.branches[branch]);
      tray.clear(); save(); render();
      setTimeout(function () { openLayer(doneEl, true); }, 200);
      return;
    }
    if (e.target.closest('.js-close-done')) openLayer(doneEl, false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!trayEl.hidden) openLayer(trayEl, false);
    if (!doneEl.hidden) openLayer(doneEl, false);
    if (!sheet.hidden) toggleSheet(false);
  });
  render();

  /* ---------- Nav + قايمة الأقسام ---------- */
  var nav = $('#nav'), burger = $('.js-burger'), sheet = $('#sheet');
  var toggleSheet = function (on) {
    burger.setAttribute('aria-expanded', on);
    sheet.hidden = !on;
    nav.classList.toggle('is-solid', on || window.scrollY > 10);
  };
  burger.addEventListener('click', function () { toggleSheet(sheet.hidden); });
  sheet.addEventListener('click', function (e) { if (e.target.closest('a')) toggleSheet(false); });

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { nav.classList.toggle('is-solid', window.scrollY > 10 || !sheet.hidden); ticking = false; });
  }, { passive: true });

  /* ---------- «أنت فين» — القسم الحالي ---------- */
  var whereNo = $('.js-where-no'), whereName = $('.js-where-name');
  var sections = $$('.sec[data-chapter]');
  var current = null;
  var setCurrent = function (sec) {
    if (sec === current) return;
    current = sec;
    nav.classList.toggle('has-where', !!sec);
    $$('.nav__links a').forEach(function (a) { a.setAttribute('aria-current', !!sec && a.dataset.nav === sec.id); });
    if (sec) { whereNo.textContent = sec.dataset.chapter; whereName.textContent = sec.dataset.name; }
  };
  var pickSection = function () {
    var mid = window.innerHeight * 0.4, pick = null;
    sections.forEach(function (s) { var b = s.getBoundingClientRect(); if (b.top <= mid && b.bottom > mid) pick = s; });
    setCurrent(pick);
  };
  window.addEventListener('scroll', pickSection, { passive: true });
  pickSection();

  /* ---------- ظهور هادي ---------- */
  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rio.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach(function (el) { rio.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }
})();
