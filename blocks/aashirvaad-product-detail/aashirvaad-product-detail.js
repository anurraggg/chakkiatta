// eslint-disable-next-line no-unused-vars
export default async function decorate(block) {
    const rows = block.querySelectorAll(':scope > div');
    if (rows.length < 5) return;
  
    // Extract content from rows
    const [imageRow, titleRow, descriptionRow, packSizesRow, nutritionRow] = rows;
    const img = imageRow.querySelector('img');
    const title = titleRow.querySelector('h2') || document.createElement('h2');
    title.textContent = titleRow.textContent.trim();
    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = descriptionRow.textContent.trim() || 'Description not provided.';
    const packSizes = document.createElement('p');
    packSizes.classList.add('pack-sizes');
    packSizes.innerHTML = packSizesRow.textContent.trim().replace(/\|/g, ' <button>$&</button> ');
    const nutrition = document.createElement('p');
    nutrition.classList.add('nutrition');
    nutrition.textContent = nutritionRow.textContent.trim() || 'Nutrition not provided.';
  
    // Structure the block
    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('product-details');
    detailsDiv.append(title, description, packSizes, nutrition);
    block.innerHTML = '';
    if (img) block.append(img);
    block.append(detailsDiv);
  
    // Add classes and structure
    block.classList.add('aashirvaad-product-detail');
  
    // Add interactivity to pack size buttons
    const buttons = packSizes.querySelectorAll('button');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });
  }