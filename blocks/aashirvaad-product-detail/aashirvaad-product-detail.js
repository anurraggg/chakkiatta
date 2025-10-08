// aashirvaad-product-detail.js
/*
 * Copyright 2025 Franklin. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

/**
 * Parses the block's table rows into a config object.
 * Skips the first row (block name), extracts key/value pairs from subsequent rows.
 * Handles multi-line text (aggregates <p> children) and pasted images.
 * @param {Element} block The block element with child divs.
 * @returns {Object} Config object.
 */
 function parseBlockConfig(block) {
    console.log('parseBlockConfig: Starting parse'); // Debug
    const config = {};
    const rows = [...block.children];
    console.log('parseBlockConfig: Found rows', rows.length);
    for (let i = 1; i < rows.length; i += 1) {
      const row = rows[i];
      const cols = [...row.children];
      if (cols.length >= 2) {
        const keyCell = cols[0];
        const valueCell = cols[1];
        const key = keyCell.querySelector('p')?.textContent?.trim().toLowerCase();
        let value = '';
        // Enhanced: Aggregate all <p> in value cell for multi-line
        const ps = [...valueCell.querySelectorAll('p')];
        if (ps.length > 0) {
          value = ps.map(p => p.textContent.trim()).join('\n'); // Join with \n
        } else {
          value = valueCell.querySelector('p')?.textContent?.trim() || '';
        }
        const img = valueCell.querySelector('img');
        if (img) {
          value = img.src;
          console.log('parseBlockConfig: Image src', value);
        }
        console.log('parseBlockConfig: Key/Value', key, '=>', value.substring(0, 50) + '...'); // Truncated log
        if (key && value) {
          config[key] = value;
        }
      }
    }
    console.log('parseBlockConfig: Final config', config);
    return config;
  }
  
  /**
   * Builds pack size buttons.
   * @param {string} sizes Pipe-separated sizes.
   * @returns {Element} Div with buttons.
   */
  function buildPackSizes(sizes) {
    const container = document.createElement('div');
    container.classList.add('pack-sizes');
    if (!sizes) return container;
    sizes.split('|').forEach((size) => {
      const btn = document.createElement('button');
      btn.textContent = size.trim();
      btn.setAttribute('aria-label', `Select ${size} pack`);
      btn.addEventListener('click', () => console.log(`Selected ${size}`)); // Placeholder
      container.appendChild(btn);
    });
    return container;
  }
  
  /**
   * Builds nutrition list.
   * @param {string} nutrition Pipe-separated facts.
   * @returns {Element} DL element.
   */
  function buildNutrition(nutrition) {
    if (!nutrition) return document.createElement('div');
    const dl = document.createElement('dl');
    dl.classList.add('nutrition');
    nutrition.split('|').forEach((fact) => {
      const [term, def] = fact.split(':');
      if (term && def) {
        const dt = document.createElement('dt');
        dt.textContent = term.trim();
        const dd = document.createElement('dd');
        dd.textContent = def.trim();
        dl.appendChild(dt);
        dl.appendChild(dd);
      }
    });
    return dl;
  }
  
  /**
   * Decorates the aashirvaad-product-detail block.
   * @param {Element} block The block element.
   */
  export default async function decorate(block) {
    console.log('decorate: Starting');
    const config = parseBlockConfig(block);
    const imageUrl = config.image || '';
    const title = config.title || 'Product Title';
    const description = config.description || '';
    const packSizes = config['pack-sizes'] || '';
    const nutrition = config.nutrition || '';
    const readMoreUrl = config['read-more-url'] || '#';
  
    block.innerHTML = '';
  
    const container = document.createElement('div');
    container.classList.add('aashirvaad-product-detail');
  
    // Image
    if (imageUrl) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.alt = `${title} image`;
      img.classList.add('product-image');
      img.loading = 'lazy';
      container.appendChild(img);
    }
  
    // Info
    const info = document.createElement('div');
    info.classList.add('product-info');
  
    const h2 = document.createElement('h2');
    h2.classList.add('product-title');
    h2.textContent = title;
    info.appendChild(h2);
  
    if (description) {
      const p = document.createElement('p');
      p.classList.add('product-description');
      // Enhanced: Split on \n and wrap in <span> for better flow, or use <br>
      p.innerHTML = description.replace(/\n/g, '<br>');
      info.appendChild(p);
    }
  
    const readMore = document.createElement('a');
    readMore.classList.add('read-more');
    readMore.href = readMoreUrl;
    readMore.textContent = 'Read More';
    info.appendChild(readMore);
  
    info.appendChild(buildPackSizes(packSizes));
  
    const nutritionEl = buildNutrition(nutrition);
    if (nutritionEl.children.length > 0) {
      info.appendChild(nutritionEl);
    }
  
    container.appendChild(info);
    block.appendChild(container);
  
    console.debug('Aashirvaad product detail decorated');
  }