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
    imagesDiv.style.width = `${images.length * 440}px`; // 400px image + 40px total margin (20px each side)
    imagesDiv.append(...images);
    container.append(imagesDiv);
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
    let currentIndex = 0;
    const imagesPerPage = 3;
    const totalPages = Math.ceil(images.length / imagesPerPage);
  
    function updateCarousel() {
      const offset = -currentIndex * (440 * imagesPerPage); // 400px image + 40px margin
      imagesDiv.style.transform = `translateX(${offset}px)`;
      prevButton.disabled = currentIndex === 0;
      nextButton.disabled = currentIndex >= totalPages - 1;
    }
  
    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex -= 1;
        updateCarousel();
      }
    });
  
    nextButton.addEventListener('click', () => {
      if (currentIndex < totalPages - 1) {
        currentIndex += 1;
        updateCarousel();
      }
    });
  
    updateCarousel();
  }