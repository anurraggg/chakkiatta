// blocks/custom-hero/custom-hero.js

/**
 * Decorates the custom-hero block.
 * @param {Element} block The custom-hero block element
 */
 export default async function decorate(block) {
    // The content from the document is expected to be in two or more rows.
    // Row 1: Left column content (Title, Text, Buttons)
    // Row 2: Right column content (Image)
  
    const children = Array.from(block.children);
  
    if (children.length < 2) {
      // eslint-disable-next-line no-console
      console.warn('Custom Hero block requires at least two rows of content.');
      return;
    }
  
    // Get the content for the left (text) and right (image) sides
    const [leftContent, rightContent] = children;
  
    // 1. Create the container for the text/content side
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('custom-hero-content');
    
    // The leftContent row contains all the elements (title, text, buttons)
    // in its first cell.
    const leftCell = leftContent.querySelector('div');
    if (leftCell) {
      // Move all children from the cell to the wrapper
      Array.from(leftCell.children).forEach((child) => {
        contentWrapper.appendChild(child);
      });
    }
  
    // 2. Create the container for the image side
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('custom-hero-image');
  
    // The rightContent row contains the image in its first cell.
    const rightCell = rightContent.querySelector('div');
    if (rightCell) {
      const pictureElement = rightCell.querySelector('picture');
      if (pictureElement) {
        imageWrapper.appendChild(pictureElement);
      }
    }
  
    // 3. Clear the block and append the new structure
    block.innerHTML = '';
    block.append(contentWrapper, imageWrapper);
  }