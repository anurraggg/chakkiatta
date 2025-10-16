/**
 * Newsletter Signup Block
 * Block: newsletter-signup
 */

 import { createOptimizedPicture } from '../aem.js';

 /**
  * Builds the checkbox label HTML with links.
  * @param {string} termsText - Terms link text
  * @param {string} privacyText - Privacy link text
  * @returns {string} HTML string for label
  */
 function buildCheckboxLabel(termsText, privacyText) {
   const termsLink = `<a href="/terms-of-use" target="_blank" rel="noopener">${termsText}</a>`;
   const privacyLink = `<a href="/privacy-policy" target="_blank" rel="noopener">${privacyText}</a>`;
   return `By clicking &ldquo;Register Now&rdquo;, you agree to ${termsLink} and ${privacyLink}, and to receive marketing emails from the Aashirvaad community`;
 }
 
 /**
  * Builds the footer links using config.
  * @param {Object} data - Block data from table
  * @returns {HTMLDivElement} Right links container
  */
 function buildRightLinks(data) {
   const linkConfig = [
     { text: data['terms_text'] || 'Terms of use', href: '/terms-of-use' },
     { text: data.privacy || 'Privacy Policy', href: '/privacy-policy' },
     { text: data.sitemap || 'Sitemap', href: '/sitemap' },
     { text: data.contact || 'Contact Us', href: '/contact' },
     { text: data.about || 'About Us', href: '/about' },
   ];
 
   const rightContainer = document.createElement('div');
   rightContainer.classList.add('right-links');
 
   linkConfig.forEach((link) => {
     const a = document.createElement('a');
     a.href = link.href;
     a.target = '_blank';
     a.rel = 'noopener';
     a.textContent = link.text;
     rightContainer.appendChild(a);
   });
 
   return rightContainer;
 }
 
 /**
  * Handles button click for form submission.
  * @param {HTMLInputElement} emailInput - Email input element
  * @param {HTMLInputElement} checkbox - Checkbox element
  */
 function handleRegister(emailInput, checkbox) {
   if (checkbox.checked && emailInput.value.trim()) {
     console.log('Newsletter signup submitted:', { email: emailInput.value });
     alert('Subscribed! (Demo - extend with API)');
   } else {
     alert('Please enter your email and agree to the terms.');
   }
 }
 
 /**
  * Decorates the newsletter signup block.
  * @param {Element} block - The block element
  */
 // eslint-disable-next-line no-unused-vars
 export default function decorate(block) {
   const rows = block.querySelectorAll(':scope > div');
   if (rows.length < 2) return; // Need header + data rows
 
   // Extract data from table (assume columns: Type | Value)
   const data = {};
   rows.forEach((row, i) => {
     if (i === 0) return; // Skip header
     const cells = row.querySelectorAll(':scope > div');
     if (cells.length >= 2) {
       const type = cells[0].textContent.trim().toLowerCase();
       const value = cells[1].textContent.trim();
       data[type] = value;
     }
   });
 
   // Validate required data
   if (!data.logo1 || !data.fssai || !data.title_logo || !data.title_text) {
     console.error('Missing required data: logo1, fssai, title_logo, title_text.');
     return;
   }
 
   // Build structure
   block.classList.add('newsletter-signup');
   block.innerHTML = '';
 
   // Left: Logos
   const leftContainer = document.createElement('div');
   leftContainer.classList.add('left-logos');
 
   const logo1 = createOptimizedPicture(data.logo1, 'Aashirvaad Logo', false, [{ width: '190' }]);
   logo1.querySelector('img').style.height = '100px';
   leftContainer.appendChild(logo1);
 
   const fssaiContainer = document.createElement('div');
   const fssaiImg = createOptimizedPicture(data.fssai, 'FSSAI License', false, [{ width: '80' }]);
   fssaiImg.querySelector('img').style.height = 'auto';
   fssaiContainer.appendChild(fssaiImg);
 
   const fssaiText = document.createElement('span');
   fssaiText.classList.add('fssai-text');
   fssaiText.textContent = 'FSSAI Lic. No. 10012031000312';
   fssaiContainer.appendChild(fssaiText);
 
   leftContainer.appendChild(fssaiContainer);
 
   // Center: Form
   const centerContainer = document.createElement('div');
   centerContainer.classList.add('center-form');
 
   const title = document.createElement('h2');
   title.classList.add('title');
   
   // AASHIRVAAD as image
   const titleLogo = createOptimizedPicture(data.title_logo, 'AASHIRVAAD', false, [{ width: '150' }]);
   titleLogo.querySelector('img').style.height = '50px';
   title.appendChild(titleLogo);
   
   // "in your inbox" as text
   const titleText = document.createElement('span');
   titleText.textContent = data.title_text || 'in Your Inbox';
   title.appendChild(titleText);
   
   centerContainer.appendChild(title);
 
   const emailInput = document.createElement('input');
   emailInput.type = 'email';
   emailInput.placeholder = 'Enter your Email ID';
   emailInput.classList.add('email-input');
   emailInput.required = true;
   centerContainer.appendChild(emailInput);
 
   const checkboxRow = document.createElement('div');
   checkboxRow.classList.add('checkbox-row');
   const checkbox = document.createElement('input');
   checkbox.type = 'checkbox';
   checkbox.id = 'terms-checkbox';
   checkbox.required = true;
   checkboxRow.appendChild(checkbox);
 
   const label = document.createElement('label');
   label.htmlFor = 'terms-checkbox';
   label.innerHTML = buildCheckboxLabel(data['terms_text'], data.privacy);
   checkboxRow.appendChild(label);
   centerContainer.appendChild(checkboxRow);
 
   const registerBtn = document.createElement('button');
   registerBtn.classList.add('register-btn');
   registerBtn.innerHTML = 'Register<br>Now';
   registerBtn.addEventListener('click', () => handleRegister(emailInput, checkbox));
   centerContainer.appendChild(registerBtn);
 
   // Right: Links
   const rightContainer = buildRightLinks(data);
 
   // Assemble
   block.append(leftContainer, centerContainer, rightContainer);
 }