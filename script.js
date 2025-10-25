// script.js

// ========== HERO SLIDESHOW ==========
(function() {
  const slides = Array.from(document.querySelectorAll('.slides .slide'));
  const bars = Array.from(document.querySelectorAll('.bar'));
  let idx = 0;
  let timer = null;
  const interval = 5000;

  function show(i) {
    slides[idx].classList.remove('active');
    bars[idx].classList.remove('active');
    idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('active');
    bars[idx].classList.add('active');
  }

  function next() {
    show(idx + 1);
  }

  function start() {
    stop();
    timer = setInterval(next, interval);
  }

  function stop() {
    if (timer) clearInterval(timer);
  }

  bars.forEach(b => {
    b.addEventListener('click', () => {
      show(+b.dataset.idx);
      start();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      show(idx + 1);
      start();
    }
    if (e.key === 'ArrowLeft') {
      show(idx - 1);
      start();
    }
  });

  document.querySelector('.pager').addEventListener('mouseenter', stop);
  document.querySelector('.pager').addEventListener('mouseleave', start);
  document.querySelector('.glass').addEventListener('mouseenter', stop);
  document.querySelector('.glass').addEventListener('mouseleave', start);

  start();
})();

// ========== NEWS CAROUSEL ==========
(function() {
  const slidesData = [
    {
      image: "fer849.jpg",
      title: "Ferrari 849 Testarossa",
      kicker: "— The Return of a Legend",
      date: "9 September 2025",
      body: "Ferrari revives an icon with the 849 Testarossa, a stunning fusion of heritage and innovation. Powered by a 4.0L twin-turbo V8 and electric motors delivering over 1,050 hp, it rockets from 0–100 km/h in just 2.3 seconds. Sleek, sculpted, and unmistakably Ferrari, it captures the spirit of the original Testarossa while embracing a new hybrid era.",
      captionMain: "ferrari",
      captionSub: "849 Testarossa",
      label: "SPIDER",
      labelClass: "label-spider"
    },
    {
      image: "ferromaspider.jpg",
      title: "Ferrari Roma Spider",
      kicker: "— Elegance, Unleashed",
      date: "12 June 2025",
      body: "The Roma Spider reimagines open-top motoring with refined proportions and daily usability. A potent V8 and sophisticated aerodynamics combine to deliver effortless performance with calm, composed handling.",
      captionMain: "ferrari",
      captionSub: "Roma",
      label: "SPIDER",
      labelClass: "label-spider"
    },
    {
      image: "fersf90xx.jpg",
      title: "SF90 XX Stradale",
      kicker: "— Track Born, Street Legal",
      date: "28 March 2025",
      body: "Inspired by XX program learnings, the SF90 XX elevates plug-in hybrid performance. Lightweight materials, increased downforce, and cutting-edge power electronics create a visceral yet precise driving experience.",
      captionMain: "ferrari",
      captionSub: "SF90 XX Stradale"
    }
  ];

  let index = 0;
  let busy = false;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const $prevBtn = document.querySelector('.nav-arrow.prev');
  const $nextBtn = document.querySelector('.nav-arrow.next');
  const $viewport = document.querySelector('.slide-viewport');
  const $origPane = document.querySelector('.news-slide');

  $origPane.classList.add('slide-pane');

  const $bufferPane = createPane();
  $viewport.appendChild($bufferPane);

  let $currentPane = $origPane;
  let $hiddenPane = $bufferPane;

  $currentPane.style.transform = 'translateX(0%)';
  $hiddenPane.style.transform = 'translateX(100%)';
  $currentPane.setAttribute('aria-hidden', 'false');
  $hiddenPane.setAttribute('aria-hidden', 'true');

  function createPane() {
    const pane = document.createElement('section');
    pane.className = 'news-slide slide-pane';
    pane.setAttribute('aria-live', 'polite');
    pane.setAttribute('aria-hidden', 'true');
    pane.innerHTML = `
      <figure class="media">
        <img alt="" />
        <figcaption class="img-caption">
          <span class="caption-main"></span>
          <span class="caption-sub">
            <span class="caption-sub-text"></span>
            <span class="label" hidden></span>
          </span>
        </figcaption>
      </figure>
      <article class="content">
        <h2></h2>
        <p class="kicker"></p>
        <p class="date"></p>
        <p class="body"></p>
      </article>
    `;
    return pane;
  }

  function getTargets(pane) {
    return {
      img: pane.querySelector('.media img'),
      title: pane.querySelector('.content h2'),
      kicker: pane.querySelector('.kicker'),
      date: pane.querySelector('.date'),
      body: pane.querySelector('.body'),
      capMain: pane.querySelector('.img-caption .caption-main'),
      capSub: pane.querySelector('.caption-sub-text'),
      capLabel: pane.querySelector('.img-caption .label, .img-caption [class*="label-"]')
    };
  }

  function fillPane(pane, s, preloadedImg) {
    const t = getTargets(pane);

    if (preloadedImg) {
      t.img.src = preloadedImg.src;
    } else if (s.image) {
      t.img.src = s.image;
    } else {
      t.img.removeAttribute('src');
    }
    t.img.alt = s.alt || s.title || 'Ferrari slide';

    t.title.textContent = s.title || '';
    t.kicker.textContent = s.kicker || '';
    t.kicker.hidden = !s.kicker;
    t.date.textContent = s.date || '';
    t.body.textContent = s.body || '';

    if (t.capMain) t.capMain.textContent = s.captionMain || 'ferrari';
    if (t.capSub) t.capSub.textContent = s.captionSub || s.title || '';

    if (t.capLabel) {
      if (s.label) {
        t.capLabel.textContent = s.label;
        t.capLabel.hidden = false;
        if (s.labelClass) {
          t.capLabel.className = `label ${s.labelClass}`;
        } else {
          t.capLabel.className = 'label';
        }
      } else {
        t.capLabel.hidden = true;
      }
    }
  }

  function preload(src) {
    return new Promise((resolve) => {
      if (!src) {
        resolve(null);
        return;
      }
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  function updateAriaLabel(i) {
    const total = slidesData.length || 1;
    const s = slidesData[i] || {};
    const label = `Slide ${i + 1} of ${total}${s.title ? `: ${s.title}` : ''}`;
    $currentPane.setAttribute('aria-label', label);
  }

  function setNavDisabled(disabled) {
    if (disabled) {
      $prevBtn.setAttribute('disabled', 'true');
      $nextBtn.setAttribute('disabled', 'true');
    } else {
      $prevBtn.removeAttribute('disabled');
      $nextBtn.removeAttribute('disabled');
    }
  }

  function prefetch(i) {
    if (!slidesData.length) return;
    const idx = (i + slidesData.length) % slidesData.length;
    const s = slidesData[idx];
    if (s && s.image) preload(s.image);
  }

  function go(dir) {
    if (busy || slidesData.length <= 1) return;
    busy = true;
    setNavDisabled(true);

    const nextIndex = dir === 1 ? (index + 1) % slidesData.length : (index - 1 + slidesData.length) % slidesData.length;
    const incoming = slidesData[nextIndex] || {};

    if (reduceMotion) {
      preload(incoming.image).then(img => {
        fillPane($currentPane, incoming, img);
        index = nextIndex;
        updateAriaLabel(index);
        prefetch(index + 1);
        busy = false;
        setNavDisabled(slidesData.length <= 1);
      });
      return;
    }

    preload(incoming.image).then(img => {
      fillPane($hiddenPane, incoming, img);

      const enterFrom = dir === 1 ? 100 : -100;
      const exitTo = dir === 1 ? -100 : 100;

      $hiddenPane.style.transition = 'none';
      $currentPane.style.transition = 'none';
      $hiddenPane.style.transform = `translateX(${enterFrom}%)`;
      $currentPane.style.transform = 'translateX(0%)';
      void $hiddenPane.offsetWidth;
      $hiddenPane.style.transition = '';
      $currentPane.style.transition = '';

      $currentPane.setAttribute('aria-hidden', 'true');
      $hiddenPane.setAttribute('aria-hidden', 'false');

      requestAnimationFrame(() => {
        $hiddenPane.style.transform = 'translateX(0%)';
        $currentPane.style.transform = `translateX(${exitTo}%)`;
      });

      const onDone = (e) => {
        if (e.propertyName !== 'transform') return;
        $currentPane.removeEventListener('transitionend', onDone);

        $currentPane.style.transition = 'none';
        $currentPane.style.transform = `translateX(${enterFrom}%)`;
        void $currentPane.offsetWidth;
        $currentPane.style.transition = '';

        const tmp = $currentPane;
        $currentPane = $hiddenPane;
        $hiddenPane = tmp;

        index = nextIndex;
        updateAriaLabel(index);
        prefetch(index + 1);

        busy = false;
        setNavDisabled(slidesData.length <= 1);
      };
      $currentPane.addEventListener('transitionend', onDone);
    });
  }

  if (slidesData.length) {
    preload(slidesData[0].image).then(img => fillPane($currentPane, slidesData[0], img));
  }

  setNavDisabled(slidesData.length <= 1);

  $prevBtn.addEventListener('click', () => go(-1));
  $nextBtn.addEventListener('click', () => go(1));

  document.addEventListener('keydown', (e) => {
    const t = e.target;
    const isTyping = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
    if (isTyping) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    }
  });

  let startX = null;
  $viewport.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });
  
  $viewport.addEventListener('touchend', (e) => {
    if (startX == null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) (dx > 0 ? go(-1) : go(1));
    startX = null;
  }, { passive: true });

  updateAriaLabel(index);
  prefetch(index + 1);
})();

// ========== FOOTER YEAR ==========
document.getElementById('year').textContent = new Date().getFullYear();
