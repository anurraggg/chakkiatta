// Helper: Extract YouTube ID from URL
function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function decorate(block) {
  const rows = block.querySelectorAll(':scope > div');
  if (rows.length < 2) return; // Need header + at least 1 video

  // Extract video data from table
  const videos = [];
  rows.forEach((row, i) => {
    if (i === 0) return; // Skip header
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length >= 2) {
      const title = cells[0].textContent.trim();
      const url = cells[1].textContent.trim();
      const videoId = extractYouTubeId(url); // Helper to get ID
      if (videoId) {
        videos.push({ title, id: videoId });
      } else {
        console.warn(`Invalid YouTube URL in row ${i + 1}: ${url} - Skipping.`);
      }
    }
  });

  if (videos.length === 0) {
    console.error('No valid videos found. Check table structure/URLs.');
    return;
  }

  // Render only available videos (dynamic count)
  block.classList.add('video-gallery');

  const mainContainer = document.createElement('div');
  mainContainer.classList.add('main-video');
  const mainIframe = document.createElement('iframe');
  // This line loads the FIRST video by default
  mainIframe.src = `https://www.youtube.com/embed/${videos[0].id}?autoplay=0&rel=0`;
  mainIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  mainIframe.allowFullscreen = true;
  mainContainer.appendChild(mainIframe);

  const thumbsContainer = document.createElement('div');
  thumbsContainer.classList.add('thumbnails');

  // --- THIS FUNCTION IS NOW INSIDE decorate ---
  // It now has direct access to mainIframe, videos, and thumbsContainer
  function switchVideo(index) {
    // Update active thumb
    Array.from(thumbsContainer.children).forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });

    // Update main iframe and play it
    const video = videos[index];
    mainIframe.src = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;
  }
  // --- END OF MOVED FUNCTION ---

  videos.forEach((video, i) => {
    const thumb = document.createElement('div');
    thumb.classList.add('thumbnail');
    
    // --- THIS SOLVES YOUR FIRST PROBLEM ---
    // This adds the 'active' class to the first video
    if (i === 0) thumb.classList.add('active');

    // Thumbnail image (YouTube preview)
    const img = document.createElement('img');
    img.src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
    img.alt = video.title;
    img.loading = 'lazy';
    img.onerror = () => { img.src = 'https://via.placeholder.com/300x120?text=No+Thumb'; };

    // Play overlay
    thumb.style.position = 'relative';
    const overlay = document.createElement('div');
    overlay.classList.add('play-overlay');
    overlay.innerHTML = '▶';

    // Title
    const titleP = document.createElement('p');
    titleP.textContent = video.title;

    thumb.append(img, overlay, titleP);
    
    // --- THIS CLICK LISTENER IS NOW SIMPLER ---
    thumb.addEventListener('click', () => switchVideo(i));
    
    thumbsContainer.appendChild(thumb);
  });

  block.innerHTML = '';
  block.append(mainContainer, thumbsContainer);

  // The requestAnimationFrame block that broke the mobile layout is still gone.
}

// The switchVideo function has been MOVED from here