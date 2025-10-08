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

import { createOptimizedPicture } from '../../scripts/aem.js'; // For image optimization

/**
 * Parses the block's table rows into a config object.
 * Skips the first row (block name), extracts key/value pairs from subsequent rows.
 * Text: innerText for multi-line preservation. Image: currentSrc fallback.
 * @param {Element} block The block element with child divs.
 * @returns {Object} Config object.
 */
function parseBlockConfig(block) {
  console.log('parseBlockConfig: Starting parse on block', block);
  const config = {};
  const rows = [...block.children];
  console.log('parseBlockConfig: Found rows', rows.length);
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    console.log('parseBlockConfig: Row', i, row);
    const cols = [...row.children];
    if (cols.length >= 2) {
      const keyCell = cols[0];
      const valueCell = cols[1];
      const key = keyCell.querySelector('p')?.textContent?.trim().toLowerCase();
      let value = '';
      const img = valueCell.querySelector('img');
      if (key === 'image' && img) {
        value = img.currentSrc || img.src || img.getAttribute('data-src') || ''; // Robust src extraction
        console.log('parseBlockConfig: Image key detected, src extracted:', value.substring(0, 50) + '...');
        if (!value) {
          console.warn('parseBlockConfig: Image <img> found but no src—re-paste in Doc or use URL');
        }
      } else if (key) {
        // For text (desc, etc.): innerText preserves lines
        value = valueCell.innerText || valueCell.textContent || ''; // innerText keeps \n
        console.log('parseBlockConfig: Text key', key, 'value:', value.substring(0, 50) + '...');
      }
      if (key && value.trim()) {
        config[key] = value.trim();
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
 * @returns {Element|null} DL element or null if empty.
 */
function buildNutrition(nutrition) {
  if (!nutrition || nutrition.trim() === '') return null;
  const dl = document.createElement('dl');
  dl.classList.add('nutrition');
  const facts = nutrition.split('|');
  console.log('buildNutrition: Facts', facts);
  facts.forEach((fact) => {
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
  return dl.children.length > 0 ? dl : null;
}

/**
 * Decorates the aashirvaad-product-detail block.
 * @param {Element} block The block element.
 */
export default async function decorate(block) {
  console.log('decorate: Starting on block', block);
  const config = parseBlockConfig(block);
  const imageUrl = config.image || '';
  const title = config.title || 'Product Title';
  const description = config.description || '';
  const packSizes = config['pack-sizes'] || '';
  const nutrition = config.nutrition || '';
  const readMoreUrl = config['read-more-url'] || '#';

  console.log('decorate: Config summary - image:', !!imageUrl, 'desc length:', description.length, 'packs:', packSizes);

  block.innerHTML = '';

  const container = document.createElement('div');
  container.classList.add('aashirvaad-product-detail');

  // Image (left)
  if (imageUrl) {
    console.log('decorate: Building optimized image with src', imageUrl.substring(0, 50) + '...');
    const picture = createOptimizedPicture(imageUrl, title, false, [{ width: '300' }]);
    picture.classList.add('product-image');
    container.appendChild(picture);
  } else {
    console.log('decorate: Skipping image - empty URL');
  }

  // Info (right)
  const info = document.createElement('div');
  info.classList.add('product-info');

  const h2 = document.createElement('h2');
  h2.classList.add('product-title');
  h2.textContent = title;
  info.appendChild(h2);

  if (description) {
    const p = document.createElement('p');
    p.classList.add('product-description');
    p.innerHTML = description.replace(/\n/g, '<br>'); // Convert preserved \n to <br>
    info.appendChild(p);
    console.log('decorate: Added description with breaks');
  } else {
    console.log('decorate: Skipping description - empty');
  }

  const readMore = document.createElement('a');
  readMore.classList.add('read-more');
  readMore.href = readMoreUrl;
  readMore.textContent = 'Read More';
  info.appendChild(readMore);

  info.appendChild(buildPackSizes(packSizes));

  const nutritionEl = buildNutrition(nutrition);
  if (nutritionEl) {
    info.appendChild(nutritionEl);
    console.log('decorate: Added nutrition');
  }

  container.appendChild(info);
  block.appendChild(container);

  console.debug('Aashirvaad product detail decorated');
}