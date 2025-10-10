// /blocks/fourstepadvantage/fourstepadvantage.js
import { readBlockConfig } from '../../scripts/aem.js';

/**
 * Decorates the four step advantage block by rendering steps.
 * @param {Element} block The four step advantage block element
 */
export default async function decorate(block) {
  const config = readBlockConfig(block);

  // Extract step data
  const steps = [];
  for (let i = 1; i <= 4; i++) {
    const title = config[`step-${i}-title`] || '';
    const description = config[`step-${i}-description`] || '';
    if (title || description) {
      steps.push({ title, description });
    }
  }

  // Create the container
  const container = document.createElement('div');
  container.classList.add('fourstepadvantage-container');

  // Add steps
  const stepsContainer = document.createElement('div');
  stepsContainer.classList.add('steps-container');
  steps.forEach((step, index) => {
    const stepDiv = document.createElement('div');
    stepDiv.classList.add('step-item');
    stepDiv.innerHTML = `
      <div class="step-number">${index + 1}</div>
      <div class="step-content">
        <h3>${step.title}</h3>
        <p>${step.description}</p>
      </div>
    `;
    stepsContainer.appendChild(stepDiv);
  });

  // Add title
  const title = document.createElement('h2');
  title.textContent = '4 Step Advantage';
  title.classList.add('advantage-title');

  // Assemble the block
  container.appendChild(title);
  container.appendChild(stepsContainer);

  // Clear and append the new content
  block.textContent = '';
  block.appendChild(container);
}