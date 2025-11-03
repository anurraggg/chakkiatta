export default function decorate(block) {
  const rows = block.querySelectorAll(':scope > div');
  
  // --- THIS IS THE CORRECT HORIZONTAL PARSER ---
  if (rows.length < 2) return; // Need 2 rows: one for titles, one for URLs

  const titleCells = rows[0].querySelectorAll(':scope > div');
  const urlCells = rows[1].querySelectorAll(':scope > div');

  // Check that the number of title cells matches url cells, ignoring the header
  if (titleCells.length !== urlCells.length) {
    console.warn('Video gallery: Title and URL rows have different column counts.');
  }
  
  const videos = [];
  // Start loop at 1 to skip the header cells ("Title", "YouTube URL")
  for (let i = 1; i < titleCells.length; i += 1) { 
    if (urlCells[i]) { // Check that a URL cell exists for this title
      const title = titleCells[i].textContent.trim();
      const url = urlCells[i].textContent.trim();
      const videoId = extractYouTubeId(url);
      
      if (videoId) {
        videos.push({ title, id: videoId });
      } else {
        console.warn(`Invalid YouTube URL in column ${i + 1}: ${url}`);
      }
    }
  }
  // --- END OF PARSER ---

  if (videos.length === 0) {
    console.error('No valid videos found. Check table structure/URLs.');
    return;
  }

  // Render only available videos (dynamic count)
  block.classList.add('video-gallery');

  const mainContainer = document.createElement('div');
  mainContainer.classList.add('main-video');
  const mainIframe = document.createElement('iframe');
  mainIframe.src = `https://www.youtube.com/embed/${videos[0].id}?autoplay=0&rel=0`;
  mainIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  mainIframe.allowFullscreen = true;
  mainContainer.appendChild(mainIframe);

  const thumbsContainer = document.createElement('div');
  thumbsContainer.classList.add('thumbnails');

  videos.forEach((video, i) => {
    const thumb = document.createElement('div');
    thumb.classList.add('thumbnail');
    if (i === 0) thumb.classList.add('active'); // Select the first one

    const img = document.createElement('img');
    img.src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`;
    img.alt = video.title;
    img.loading = 'lazy';
    img.onerror = () => { img.src = 'https://via.placeholder.com/300x120?text=No+Thumb'; };

    const overlay = document.createElement('div');
    overlay.classList.add('play-overlay');
    overlay.innerHTML = '▶';

    const titleP = document.createElement('p');
    titleP.textContent = video.title; // This will now be "First Ad", "Second Ad", etc.

    thumb.append(img, overlay, titleP);
    thumb.addEventListener('click', () => switchVideo(i, mainIframe, videos, thumbsContainer));
    thumbsContainer.appendChild(thumb);
  });

  block.innerHTML = '';
  block.append(mainContainer, thumbsContainer);

  // The code that added the inline "height" style is gone.
}

// Helper: Extract YouTube ID from URL
function extractYouTubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Switch video function
function switchVideo(index, iframe, videos, thumbsContainer) {
  // Update active thumb
  Array.from(thumbsContainer.children).forEach((thumb, i) => {
    thumb.classList.toggle('active', i === index);
  });

  // Update main iframe
  const video = videos[index];
  iframe.src = `https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`;
}