// eslint-disable-next-line no-unused-vars
export default async function decorate(block) {
    const rows = block.querySelectorAll(':scope > div');
    if (rows.length < 1) return;
  
    // Extract all image rows
    const images = [];
    rows.forEach(row => {
      const match = row.textContent.match(/image\d*\s+(.*)/);
      if (match) {
        const img = document.createElement('img');
        img.src = match[1].trim() || 'https://via.placeholder.com/400x300';
        images.push(img);
      }
    });
  
    if (images.length === 0) return;
  
    // Structure the block
    const container = document.createElement('div');
    container.classList.add('carousel-container');
    const imagesDiv = document.createElement('div');
    imagesDiv.classList.add('carousel-images');
    const imagesPerPage = 3;
    const totalSlides = Math.ceil(images.length / imagesPerPage);
    imagesDiv.style.width = `${totalSlides * 100}%`; // Full width for all slides
    imagesDiv.style.display = 'flex';
  
    // Create slides with 3 images each
    for (let i = 0; i < totalSlides; i++) {
      const slide = document.createElement('div');
      slide.style.width = `${100 / totalSlides}%`;
      slide.style.display = 'flex';
      slide.style.justifyContent = 'center';
      for (let j = 0; j < imagesPerPage; j++) {
        const index = i * imagesPerPage + j;
        if (index < images.length) {
          const imgContainer = document.createElement('div');
          imgContainer.style.flex = '1 0 400px'; // Ensure consistent width
          imgContainer.appendChild(images[index]);
          slide.appendChild(imgContainer);
        }
      }
      imagesDiv.appendChild(slide);
    }
  
    container.appendChild(imagesDiv);
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons');
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    buttonsDiv.append(prevButton, nextButton);
    block.innerHTML = '';
    block.append(container, buttonsDiv);
  
    // Add classes and structure
    block.classList.add('image-carousel');
  
    // Carousel logic
    let currentSlide = 0;
  
    function updateCarousel() {
      const offset = -currentSlide * (100 / totalSlides);
      imagesDiv.style.transform = `translateX(${offset}%)`;
      prevButton.disabled = currentSlide === 0;
      nextButton.disabled = currentSlide >= totalSlides - 1;
    }
  
    prevButton.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; // Loop back
      updateCarousel();
    });
  
    nextButton.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % totalSlides; // Loop to start
      updateCarousel();
    });
  
    updateCarousel();
  }