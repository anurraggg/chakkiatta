// aashirvaad-header.js
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

import { readBlockConfig } from '../../scripts/aem.js'; // Kept for potential future use, but not for block config

/**
 * Parses the block's table rows into a config object.
 * Skips the first row (block name), extracts key/value pairs from subsequent rows.
 * Handles multi-line text and pasted images.
 * @param {Element} block The block element with child .row divs.
 * @returns {Object} Config object with keys like 'logo-url', 'nav-structure'.
 */
function parseBlockConfig(block) {
  const config = {};
  const rows = [...block.querySelectorAll(':scope > div')]; // Each table row is a <div class="row">
  for (let i = 1; i < rows.length; i += 1) { // Start at i=1 to skip block name row (i=0)
    const row = rows[i];
    const cols = [...row.querySelectorAll(':scope > div')]; // Each <div class="col">
    if (cols.length >= 2) {
      const keyCell = cols[0];
      const valueCell = cols[1];
      const key = keyCell.querySelector('p')?.textContent?.trim().toLowerCase();
      let value = valueCell.querySelector('p')?.textContent?.trim() || '';
      const img = valueCell.querySelector('img');
      if (img) {
        value = img.src; // Extract src from pasted PNG
      }
      if (key && value) {
        config[key] = value;
      }
    }
  }
  return config;
}

/**
 * Parses the nav-structure config into a hierarchical array.
 * @param {string} navStructure The raw nav-structure string (with \n for lines).
 * @returns {Array} Array of nav items, each with optional sub-items.
 */
function parseNavStructure(navStructure) {
  if (!navStructure) {
    return [
      { label: 'Our Products', subItems: ['Atta', 'Salt', 'Organic', 'Bensan', 'Millets', 'Vermicelli', 'Rava', 'Naans & Parathas'] },
      { label: 'Our Story' },
      { label: 'Recipe' },
      { label: 'Blogs' },
      { label: 'FAQs' }
    ];
  }

  const lines = navStructure.split('\n').map((line) => line.trim()).filter((line) => line);
  const navItems = [];

  lines.forEach((line) => {
    if (line.includes(':')) {
      const [parent, subsStr] = line.split(':', 2);
      const subItems = subsStr ? subsStr.split('|').map((sub) => sub.trim()).filter((sub) => sub) : [];
      navItems.push({ label: parent.trim(), subItems });
    } else {
      navItems.push({ label: line.trim(), subItems: [] });
    }
  });

  return navItems;
}

/**
 * Builds the nested nav DOM.
 * @param {Array} navItems The parsed nav items.
 * @returns {Element} The nav element.
 */
function buildNav(navItems) {
  const nav = document.createElement('nav');
  const ul = document.createElement('ul');
  ul.classList.add('nav');

  navItems.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${item.label.toLowerCase().replace(/\s+/g, '-')}`;
    a.textContent = item.label;
    a.classList.add('nav-item');
    a.setAttribute('aria-label', `Navigate to ${item.label}`);
    li.appendChild(a);

    if (item.subItems.length > 0) {
      const dropdownUl = document.createElement('ul');
      dropdownUl.classList.add('dropdown');
      item.subItems.forEach((sub) => {
        const subLi = document.createElement('li');
        const subA = document.createElement('a');
        subA.href = `#${sub.toLowerCase().replace(/\s+/g, '-')}`;
        subA.textContent = sub;
        subA.classList.add('nav-item');
        subA.setAttribute('aria-label', `Navigate to ${sub}`);
        subLi.appendChild(subA);
        dropdownUl.appendChild(subLi);
      });
      li.appendChild(dropdownUl);
    }

    ul.appendChild(li);
  });

  nav.appendChild(ul);
  return nav;
}

/**
 * Decorates the aashirvaad-header block.
 * @param {Element} block The header block element.
 */
export default async function decorate(block) {
  // Parse config from table rows
  const config = parseBlockConfig(block);

  // Extract config values with defaults
  let logoUrl = config['logo-url'] || `${window.hlx.codeBasePath}/icons/aashirvaad-logo.svg`;
  const navStructure = config['nav-structure'];
  const navItems = parseNavStructure(navStructure);
  const searchEnabled = config['search-enabled'] !== 'false';
  const isFixed = config.fixed === 'true';

  // Clear existing content (table rows)
  block.innerHTML = '';

  // Create header element
  const header = document.createElement('header');
  header.classList.add('aashirvaad-header');
  if (isFixed) {
    header.classList.add('fixed');
  }

  // Create logo
  const logoImg = document.createElement('img');
  logoImg.src = logoUrl;
  logoImg.alt = 'Aashirvaad Logo';
  logoImg.classList.add('logo');
  header.appendChild(logoImg);

  // Create navigation with dropdowns
  const nav = buildNav(navItems);
  header.appendChild(nav);

  // Create search icon if enabled
  if (searchEnabled) {
    const searchIcon = document.createElement('div');
    searchIcon.classList.add('search-icon');
    searchIcon.innerHTML = '🔍'; // Simple emoji; replace with SVG if needed
    searchIcon.addEventListener('click', () => {
      // Placeholder: Open search modal or redirect
      console.log('Search clicked');
      window.location.href = '/search';
    });
    searchIcon.setAttribute('aria-label', 'Search');
    header.appendChild(searchIcon);
  }

  // Append header to block
  block.appendChild(header);

  // Add keyboard support for dropdowns (basic)
  const topNavItems = header.querySelectorAll('.nav > li');
  topNavItems.forEach((li) => {
    const link = li.querySelector('a');
    if (li.querySelector('.dropdown')) {
      link.addEventListener('focus', () => li.classList.add('focused'));
      link.addEventListener('blur', () => li.classList.remove('focused'));
    }
  });

  // Log decoration complete
  console.debug('Aashirvaad header with dropdowns decorated');
}