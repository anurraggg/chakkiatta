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

import { readBlockConfig } from '../../scripts/aem.js';

/**
 * Decorates the aashirvaad-header block.
 * @param {Element} block The header block element.
 */
export default async function decorate(block) {
  // Read block configuration
  const config = readBlockConfig(block);

  // Extract config values with defaults
  const logoUrl = config['logo-url'] || `${window.hlx.codeBasePath}/icons/aashirvaad.png`;
  const navItems = config['nav-items'] ? config['nav-items'].split('|').map(item => item.trim()) : ['Our Products', 'Our Story', 'Recipe', 'Blogs', 'FAQs'];
  const searchEnabled = config['search-enabled'] !== 'false';
  const isFixed = config.fixed === 'true';

  // Clear existing content
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

  // Create navigation
  const nav = document.createElement('nav');
  const ul = document.createElement('ul');
  ul.classList.add('nav');
  navItems.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${item.toLowerCase().replace(/\s+/g, '-')}`;
    a.textContent = item;
    a.classList.add('nav-item');
    a.setAttribute('aria-label', `Navigate to ${item}`);
    li.appendChild(a);
    ul.appendChild(li);
  });
  nav.appendChild(ul);
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

  // Log decoration complete
  console.debug('Aashirvaad header decorated');
}