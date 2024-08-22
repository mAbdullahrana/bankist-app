'use strict';

///////////////////////////////////////
// Modal window
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');
const allSections = document.querySelectorAll('.section');

const headerLinks = nav.addEventListener('click', function (e) {
  // Show Modal
  if (e.target.classList.contains('nav__link--btn')) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }

  // Scroll To Sections
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
const closeModal = btnCloseModal.addEventListener('click', function (e) {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
});

const message = document.createElement('div');
message.classList.add('cookie-message');

message.innerHTML = `We Use Cookies To Give Experience <button class = "btn btn--close--cookie"> Got It ! </button>`;
header.append(message);

const closeCookie = document.querySelector('.btn--close--cookie');

closeCookie.addEventListener('click', function () {
  message.remove();
});

btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Implementing Blur Affect On links Of Header Section

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');

    const logo = e.target.closest('nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this.opacity;
      }
      logo.style.opacity = this.opacity;
    });
  }
};

nav.addEventListener('mouseover', handleHover.bind({ opacity: 0.5 }));
nav.addEventListener('mouseout', handleHover.bind({ opacity: 1 }));

// Stick Header
const navHeight = nav.getBoundingClientRect().height;
const stickyHeader = function (entreis) {
  const [entry] = entreis;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyHeader, {
  root: null,
  threshold: 0,
  rootMargin: `${-navHeight}px`,
});
headerObserver.observe(header);

//  Implementing Operations Tab

const tabs = document.querySelectorAll('.operations__tab');
const contaniner = document.querySelector('.operations__tab-container');
const content = document.querySelectorAll('.operations__content');
contaniner.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  content.forEach(c => {
    c.classList.remove('operations__content--active');
  });
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Lazy Load Images
const lazyImg = document.querySelectorAll('img[data-src]');
const lazyLoad = function (entreis, observer) {
  const [entry] = entreis;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
});

lazyImg.forEach(i => imageObserver.observe(i));

// Section Reveal

const sectionReveal = function (entreis, observer) {
  const [entry] = entreis;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(sectionReveal, {
  root: null,
  threshold: 0.1,
  rootMargin: `${-100}px`,
});

allSections.forEach(s => {
  sectionObserver.observe(s);
  s.classList.add('hidden');
});

// Implementing Slider

const slide = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const maxSlide = slides.length - 1;
  let curSlide = 0;

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%) `;
    });
  };

  const nextSlide = function () {
    if (curSlide === maxSlide) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const previousSlide = function () {
    if (curSlide === 0) curSlide = maxSlide;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previousSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') return nextSlide();
    if (e.key === 'ArrowLeft') return previousSlide();
  });

  // Creating Dots
  const dotContainer = document.querySelector('.dots');
  const dots = document.querySelector('.dots__dot');
  const createsDots = function () {
    slides.forEach((_, i) =>
      dotContainer.insertAdjacentHTML(
        `beforeend`,
        `<button class = "dots__dot" data-slide = "${i}"></button>`
      )
    );
  };

  const activateDot = function (slide) {
    dotContainer
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    dotContainer
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };
  const init = function () {
    createsDots();
    activateDot(0);
    goToSlide(0);
  };

  init();

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slide();
