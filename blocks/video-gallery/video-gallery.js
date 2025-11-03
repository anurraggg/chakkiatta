// Helper: Extract YouTube ID from URL
function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(RegExp);
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
  
  // Create the *initial* iframe
  const initialIframe = document.createElement('iframe');
  initialIframe.src = `https://www.youtube.com/embed/${videos[0].id}?autoplay=0&rel=0`;
  initialIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  initialIframe.allowFullscreen = true;
  mainContainer.appendChild(initialIframe);

  const thumbsContainer = document.createElement('div');
  thumbsContainer.classList.add('thumbnails');

  // --- THIS FUNCTION CONTAINS THE FIX ---
  function switchVideo(index) {
    // 1. Update active thumb
    Array.from(thumbsContainer.children).forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });

    // 2. Get the new video ID
    const video = videos[index];

    // 3. Remove the old iframe completely
    mainContainer.innerHTML = ''; 

    // 4. Create a brand new iframe
    const newIframe = document.createElement('iframe');
    newIframe.src = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;
    newIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    newIframe.allowFullscreen = true;
    
    // 5. Add the new one to the page
    mainContainer.appendChild(newIframe);
  }
  // --- END OF FUNCTION ---

  videos.forEach((video, i) => {
    const thumb = document.createElement('div');
    thumb.classList.add('thumbnail');
    
    // This line selects the FIRST video by default
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
    
    // This click listener calls the function above
    thumb.addEventListener('click', () => switchVideo(i));
    
    thumbsContainer.appendChild(thumb);
  });

  block.innerHTML = '';
  block.append(mainContainer, thumbsContainer);
}