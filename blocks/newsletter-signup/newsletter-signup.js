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

  // Left: Logos
  const leftContainer = document.createElement('div');
  leftContainer.classList.add('left-logos');

  const logo1 = document.createElement('img');
  logo1.src = data.logo1;
  logo1.alt = 'Aashirvaad Logo';

  const fssaiImg = document.createElement('img');
  fssaiImg.src = data.fssai;
  fssaiImg.alt = 'FSSAI License';

  leftContainer.append(logo1, fssaiImg);

  // Center: Form
  const centerContainer = document.createElement('div');
  centerContainer.classList.add('center-form');

  const title = document.createElement('h2');
  title.classList.add('title');
  
  // AASHIRVAAD as image
  const titleLogo = document.createElement('img');
  titleLogo.src = data.title_logo;
  titleLogo.alt = 'AASHIRVAAD';
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
  centerContainer.appendChild(emailInput);

  const checkboxRow = document.createElement('div');
  checkboxRow.classList.add('checkbox-row');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'terms-checkbox';
  const label = document.createElement('label');
  label.htmlFor = 'terms-checkbox';
  label.textContent = 'By clicking "Register Now", you agree to the Privacy Policy, and to receive marketing emails from the Aashirvaad community';
  checkboxRow.append(checkbox, label);
  centerContainer.appendChild(checkboxRow);

  const registerBtn = document.createElement('button');
  registerBtn.classList.add('register-btn');
  registerBtn.innerHTML = 'Register<br>Now'; // Force 2 lines; add <br> for 3 if needed (e.g., 'Register<br><br>Now')
  // Add form submit logic here if needed (e.g., on click)
  registerBtn.addEventListener('click', () => {
    if (checkbox.checked && emailInput.value) {
      // Placeholder: Submit form (integrate with actual endpoint)
      console.log('Registering:', emailInput.value);
      alert('Subscribed! (Demo)');
    } else {
      alert('Please check terms and enter email.');
    }
  });
  centerContainer.appendChild(registerBtn);

  // Right: Links (as plain text for now)
  const rightContainer = document.createElement('div');
  rightContainer.classList.add('right-links');

  const linkTexts = [
    'Terms of use',
    'Privacy Policy',
    'Sitemap',
    'Contact Us',
    'About Us'
  ];

  linkTexts.forEach(text => {
    const span = document.createElement('span'); // Plain text, not <a>
    span.textContent = text;
    rightContainer.appendChild(span);
  });

  // Assemble
  block.innerHTML = '';
  block.append(leftContainer, centerContainer, rightContainer);
}