// eslint-disable-next-line no-unused-vars
export default function decorate(block) {
    const rows = block.querySelectorAll(':scope > div');
    if (rows.length < 1) return;
  
    // Extract all image rows (robust regex: trim, handle optional numbering)
    const images = [];
    rows.forEach(row => {
      const match = row.textContent.trim().match(/^image\d*?\s+(.*)$/i);
      if (match) {
        const img = document.createElement('img');
        img.src = match[1].trim() || 'https://via.placeholder.com/400x300';
        img.alt = `Carousel image ${images.length + 1}`; // Basic alt for accessibility
        img.loading = 'lazy';
        images.push(img);
      }
    });
  
    if (images.length === 0) return;
  
    // Structure the block
    block.setAttribute('role', 'region');
    block.setAttribute('aria-roledescription', 'Carousel');
    block.setAttribute('tabindex', '0'); // For keyboard focus
  
    const imagesPerPage = window.innerWidth >= 768 ? 3 : 1; // Responsive: 3 desktop, 1 mobile
    const totalRealSlides = Math.ceil(images.length / imagesPerPage);
    if (totalRealSlides === 0) return;
  
    const container = document.createElement('div');
    container.classList.add('carousel-container');
  
    const slidesWrapper = document.createElement('div');
    slidesWrapper.classList.add('carousel-slides');
  
    // Build real slides (core content)
    const realSlides = [];
    for (let i = 0; i < totalRealSlides; i++) {
      const slide = document.createElement('div');
      slide.classList.add('carousel-slide');
      slide.dataset.slideIndex = i;
      slide.setAttribute('aria-hidden', 'true');
      for (let j = 0; j < imagesPerPage; j++) {
        const index = i * imagesPerPage + j;
        if (index < images.length) {
          const imgContainer = document.createElement('div');
          imgContainer.appendChild(images[index]);
          slide.appendChild(imgContainer);
        } else {
          // Empty placeholder for partial slides
          const emptyDiv = document.createElement('div');
          slide.appendChild(emptyDiv);
        }
      }
      realSlides.push(slide);
      slidesWrapper.appendChild(slide);
    }
  
    // For infinite: Clone buffers (first/last set of slides)
    const bufferSize = imagesPerPage; // Clone enough for one full viewport
    // Prepend clones of last slides to start
    for (let i = totalRealSlides - 1; i >= Math.max(0, totalRealSlides - bufferSize); i--) {
      const clone = realSlides[i].cloneNode(true);
      clone.dataset.isClone = 'true';
      clone.dataset.originalIndex = i;
      slidesWrapper.insertBefore(clone, slidesWrapper.firstChild);
    }
    // Append clones of first slides to end
    for (let i = 0; i < Math.min(bufferSize, totalRealSlides); i++) {
      const clone = realSlides[i].cloneNode(true);
      clone.dataset.isClone = 'true';
      clone.dataset.originalIndex = i;
      slidesWrapper.appendChild(clone);
    }
  
    // Adjust widths for infinite (total slides now include buffers)
    const totalSlides = slidesWrapper.children.length;
    Array.from(slidesWrapper.children).forEach(slide => {
      slide.style.width = `${100 / totalSlides}%`;
    });
    slidesWrapper.style.width = `${totalSlides * (100 / totalSlides)}%`; // 100%
  
    container.appendChild(slidesWrapper);
  
    // Navigation buttons
    const navButtons = document.createElement('div');
    navButtons.classList.add('carousel-navigation-buttons');
    const prevButton = document.createElement('button');
    prevButton.classList.add('slide-prev');
    prevButton.textContent = '<<';
    prevButton.setAttribute('aria-label', 'Previous slide');
    const nextButton = document.createElement('button');
    nextButton.classList.add('slide-next');
    nextButton.textContent = '>>';
    nextButton.setAttribute('aria-label', 'Next slide');
    navButtons.append(prevButton, nextButton);
  
    // Clear and append
    block.innerHTML = '';
    block.append(container, navButtons);
    block.classList.add('image-carousel');
  
    // Infinite carousel logic
    let currentSlide = bufferSize; // Start in the middle (after prepend clones)
    let isTransitioning = false;
  
    const statusAnnounce = document.createElement('div');
    statusAnnounce.className = 'sr-only'; // Screen-reader only
    statusAnnounce.setAttribute('aria-live', 'polite');
    statusAnnounce.textContent = `Carousel with ${totalRealSlides} slides. Showing slide 1.`;
    block.appendChild(statusAnnounce);
  
    function updateActiveSlide() {
      const slides = Array.from(slidesWrapper.children);
      slides.forEach((slide, idx) => {
        const realIdx = idx - bufferSize; // Adjust for buffers
        slide.setAttribute('aria-hidden', Math.abs(realIdx - currentSlide) > 0);
      });
      // No disable for infinite—always enabled
      prevButton.disabled = false;
      nextButton.disabled = false;
      statusAnnounce.textContent = `Showing slide ${((currentSlide - bufferSize) % totalRealSlides) + 1} of ${totalRealSlides}.`;
    }
  
    function showSlide(direction) { // +1 next, -1 prev
      if (isTransitioning) return;
      isTransitioning = true;
  
      currentSlide += direction;
      const offset = -currentSlide * (100 / totalSlides);
      slidesWrapper.style.transform = `translateX(${offset}%)`;
  
      // Seamless reset when hitting buffer
      setTimeout(() => {
        const realPos = (currentSlide - bufferSize) % totalRealSlides;
        if (currentSlide < bufferSize || currentSlide >= totalRealSlides + bufferSize) {
          currentSlide = bufferSize + realPos; // Jump to opposite buffer
          slidesWrapper.style.transition = 'none'; // Instant reset
          slidesWrapper.style.transform = `translateX(${-currentSlide * (100 / totalSlides)}%)`;
          slidesWrapper.offsetHeight; // Force reflow
          slidesWrapper.style.transition = 'transform 0.5s ease'; // Re-enable
        }
        isTransitioning = false;
        updateActiveSlide();
      }, 500); // Match CSS transition duration
    }
  
    // Event listeners
    prevButton.addEventListener('click', () => showSlide(-1));
    nextButton.addEventListener('click', () => showSlide(1));
  
    // Keyboard support
    block.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') showSlide(-1);
      if (e.key === 'ArrowRight') showSlide(1);
    });
  
    // Initial setup
    updateActiveSlide();
  }