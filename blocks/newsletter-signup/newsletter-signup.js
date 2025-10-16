/**
 * Newsletter Signup Block
 * Block: newsletter-signup
 */

 import { readBlockConfig, createOptimizedPicture } from '../aem.js';

 /**
  * Builds the checkbox text with dynamic links.
  * @param {string} termsText - Terms link text
  * @param {string} privacyText - Privacy link text
  * @returns {string} HTML string for checkbox label
  */
 function buildCheckboxText(termsText, privacyText) {
   const termsLink = `<a href="/terms" class="newsletter-signup-link" target="_blank" rel="noopener">${termsText}</a>`;
   const privacyLink = `<a href="/privacy" class="newsletter-signup-link" target="_blank" rel="noopener">${privacyText}</a>`;
   return `By clicking &ldquo;Register Now&rdquo;, you agree to ${termsLink} and ${privacyLink}, and to receive marketing emails from the Aashirvaad community`;
 }
 
 /**
  * Builds the footer navigation links.
  * @param {Object} config - Block config with link texts
  * @returns {HTMLUListElement} Footer links list
  */
 function buildFooterLinks(config) {
   const footerLinks = [
     { text: config['terms-text'], href: '/terms' },
     { text: config.privacy, href: '/privacy' },
     { text: config.sitemap, href: '/sitemap' },
     { text: config.contact, href: '/contact' },
     { text: config.about, href: '/about' },
   ];
 
   const ul = document.createElement('ul');
   ul.className = 'newsletter-signup-footer';
   footerLinks.forEach((link) => {
     const li = document.createElement('li');
     const a = document.createElement('a');
     a.className = 'newsletter-signup-footer-link';
     a.href = link.href;
     a.target = '_blank';
     a.rel = 'noopener';
     a.textContent = link.text;
     li.appendChild(a);
     ul.appendChild(li);
   });
 
   return ul;
 }
 
 /**
  * Handles form submission.
  * @param {Event} event - Submit event
  */
 async function handleSubmit(event) {
   event.preventDefault();
   const form = event.target;
   const email = form.querySelector('.newsletter-signup-input').value;
   const checkbox = form.querySelector('.newsletter-signup-checkbox');
 
   if (!email || !checkbox.checked) {
     alert('Please enter your email and agree to the terms.');
     return;
   }
 
   // Extend with API call, e.g.:
   // try {
   //   await fetch('/api/newsletter-signup', {
   //     method: 'POST',
   //     headers: { 'Content-Type': 'application/json' },
   //     body: JSON.stringify({ email }),
   //   });
   //   alert('Thank you for signing up!');
   // } catch (error) {
   //   console.error('Signup failed:', error);
   //   alert('Signup failed. Please try again.');
   // }
 
   console.log('Newsletter signup submitted:', { email });
 }
 
 /**
  * Decorates the newsletter signup block.
  * @param {Element} block - The block element
  */
 export default async function decorate(block) {
   const config = readBlockConfig(block);
   block.innerHTML = '';
 
   // Header
   const header = document.createElement('div');
   header.className = 'newsletter-signup-header';
 
   const mainLogo = createOptimizedPicture(config.logo1, 'Aashirvaad Logo', false, [{ width: '150' }]);
   mainLogo.className = 'newsletter-signup-logo';
   header.appendChild(mainLogo);
 
   const fssaiLogo = createOptimizedPicture(config.fssai, 'FSSAI License', false, [{ width: '80' }]);
   fssaiLogo.className = 'newsletter-signup-fssai';
   header.appendChild(fssaiLogo);
 
   const title = document.createElement('div');
   title.className = 'newsletter-signup-title';
 
   const titleLogo = createOptimizedPicture(config['title-logo'], 'Aashirvaad Title Logo', false, [{ width: '100' }]);
   titleLogo.className = 'newsletter-signup-title-logo';
   title.appendChild(titleLogo);
 
   const titleText = document.createElement('span');
   titleText.className = 'newsletter-signup-title-text';
   titleText.textContent = `AASHIRVAAD® ${config['title-text']}`;
   title.appendChild(titleText);
 
   header.appendChild(title);
   block.appendChild(header);
 
   // Form
   const form = document.createElement('form');
   form.className = 'newsletter-signup-form';
   form.addEventListener('submit', handleSubmit);
 
   const input = document.createElement('input');
   input.type = 'email';
   input.className = 'newsletter-signup-input';
   input.placeholder = 'Enter your Email ID';
   input.required = true;
   form.appendChild(input);
 
   const checkboxContainer = document.createElement('div');
   checkboxContainer.className = 'newsletter-signup-checkbox-container';
 
   const checkbox = document.createElement('input');
   checkbox.type = 'checkbox';
   checkbox.className = 'newsletter-signup-checkbox';
   checkbox.id = 'newsletter-terms';
   checkbox.required = true;
   checkboxContainer.appendChild(checkbox);
 
   const checkboxLabel = document.createElement('label');
   checkboxLabel.className = 'newsletter-signup-checkbox-text';
   checkboxLabel.htmlFor = 'newsletter-terms';
   checkboxLabel.innerHTML = buildCheckboxText(config['terms-text'], config.privacy);
   checkboxContainer.appendChild(checkboxLabel);
 
   form.appendChild(checkboxContainer);
 
   const button = document.createElement('button');
   button.type = 'submit';
   button.className = 'newsletter-signup-button';
   button.textContent = 'Register Now';
   form.appendChild(button);
 
   block.appendChild(form);
 
   // Footer
   const footer = buildFooterLinks(config);
   block.appendChild(footer);
 }