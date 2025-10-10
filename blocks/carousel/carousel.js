import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const container = document.createElement('div');
  container.className = 'carousel-container';
  const slides = [...block.children];
  let currentSlide = 0;
  const slideCount = slides.length;

  slides.forEach((slide, index) => {
    const div = document.createElement('div');
    div.className = 'carousel-slide';
    const cols = [...slide.children];

    cols.forEach((col, colIndex) => {
      if (col.querySelector('picture') && colIndex === 0) {
        const picture = col.querySelector('picture');
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPicture = createOptimizedPicture(
            img.src,
            img.alt || `Slide ${index + 1}`,
            false,
            [{ media: '(min-width: 600px)', width: '1200' }, { width: '600' }],
          );
          picture.replaceWith(optimizedPicture);
        }
        div.append(picture);
      } else {
        const heading = col.querySelector('h3') || document.createElement('h3');
        const text = col.querySelector('p') || document.createElement('p');
        if (!heading.textContent && col.textContent.includes('\n')) {
          const [h, ...rest] = col.textContent.split('\n').map(s => s.trim()).filter(s => s);
          heading.textContent = h;
          text.textContent = rest.join(' ');
        }
        div.append(heading, text);
      }
    });

    container.append(div);
  });

  const nav = document.createElement('div');
  nav.className = 'carousel-nav';
  const prevButton = document.createElement('button');
  prevButton.textContent = '<';
  prevButton.disabled = true;
  prevButton.addEventListener('click', () => moveSlide(-1));
  const nextButton = document.createElement('button');
  nextButton.textContent = '>';
  nextButton.addEventListener('click', () => moveSlide(1));
  nav.append(prevButton, nextButton);

  block.textContent = '';
  block.append(container, nav);

  function moveSlide(direction) {
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = slideCount - 1;
    if (currentSlide >= slideCount) currentSlide = 0;
    container.style.transform = `translateX(-${currentSlide * 100}%)`;
    prevButton.disabled = currentSlide === 0;
    nextButton.disabled = currentSlide === slideCount - 1;
  }

  let autoPlay;
  function startAutoPlay() {
    autoPlay = setInterval(() => moveSlide(1), 5000);
  }
  function stopAutoPlay() {
    clearInterval(autoPlay);
  }

  container.addEventListener('mouseenter', stopAutoPlay);
  container.addEventListener('mouseleave', startAutoPlay);
  startAutoPlay();

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveSlide(-1);
    if (e.key === 'ArrowRight') moveSlide(1);
  });
}