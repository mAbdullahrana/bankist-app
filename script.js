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

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const message = document.createElement('div');

message.classList.add('cookie-message');

message.innerHTML =
  'We Are Using Cookies To Improve Your Experience <button class =" btn btn--close--cookie"> Got It! </button>';

header.append(message);

document
  .querySelector('.btn--close--cookie')
  .addEventListener('click', function () {
    message.remove();
  });

btnScrollTo.addEventListener('click', function () {
  console.log('i sa');
  section1.scrollIntoView({ behavior: 'smooth' });
});
// Event Delegation
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

const tabs = document.querySelectorAll('.operations__tab');
const contaniner = document.querySelector('.operations__tab-container');
const content = document.querySelectorAll('.operations__content');

contaniner.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  content.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu Fade In And Out
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const logo = e.target.closest('.nav').querySelector('img');
    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');

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

//  Stick Header
// Old Way
// const intialCord = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   window.scrollY > intialCord.top
//     ? nav.classList.add('sticky')
//     : nav.classList.remove('sticky');
// });

// New Way
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

// Reveal Sections

const sectionReveal = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sectionReveal, {
  root: null,
  theshold: 0.1,
  rootMargin: `${-100}px`,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy Loading Feature Images

const imgTargets = document.querySelectorAll('img[data-src]');

const lazyLoad = function (entreis, observer) {
  const [entry] = entreis;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  rootMargin: `200px`,
});

imgTargets.forEach(img => imgObserver.observe(img));

//  Implementing Slider

const slide = function () {
  const sliders = document.querySelectorAll('.slide');

  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  let curSlide = 0;
  let maxSlide = sliders.length - 1;

  // Implementing Dots Slider

  const dotContainer = document.querySelector('.dots');

  const createsDots = function () {
    sliders.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `
      <button class = "dots__dot" data-slide = "${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    dotContainer
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    dotContainer
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  const goToSlide = function (slide) {
    sliders.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%) `;
    });
  };

  const init = function () {
    goToSlide(0);
    createsDots();
    activateDot(0);
  };

  init();

  const nextSlide = function (e) {
    if (curSlide === maxSlide) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const previousSlide = function () {
    if (curSlide === 0) curSlide = maxSlide;
    else curSlide--;
    activateDot(curSlide);
    goToSlide(curSlide);
  };

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previousSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') previousSlide();
  });
};

slide();

