// Grab references
const video = document.getElementById('video');
const canvas = document.getElementById('video-canvas');
const ctx = canvas.getContext('2d');

let scrollHeight = 0;
let isSeeking = false;

// Resize canvas to fill viewport
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Once the video’s metadata is ready, we know its duration.
// Now set body height so that scrolling from top → bottom
// maps to 0 → video.duration (in seconds).
video.addEventListener('loadedmetadata', () => {
  const viewportHeight = window.innerHeight;
  // total scrollable length = duration (sec) × viewportHeight (px)
  document.body.style.height = `${video.duration * viewportHeight}px`;

  // Recompute scrollHeight now that body height changed
  scrollHeight = document.body.scrollHeight - viewportHeight;

  // Draw the very first frame (time = 0)
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
});

// After any seek completes, draw the new frame onto canvas
video.addEventListener('seeked', () => {
  isSeeking = false;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
});

// On scroll, map scrollY → video.currentTime (clamped 0→duration)
window.addEventListener('scroll', () => {
  if (!scrollHeight) return; // not ready yet
  const scrollTop = window.scrollY;
  const fraction = Math.min(1, Math.max(0, scrollTop / scrollHeight));
  const newTime = video.duration * fraction;

  // Only request a new seek if the last one finished
  if (!isSeeking) {
    isSeeking = true;
    video.currentTime = newTime;
  }
});
