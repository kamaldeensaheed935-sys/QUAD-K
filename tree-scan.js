const camera = document.querySelector('#camera');
const snapshot = document.querySelector('#snapshot');
const placeholder = document.querySelector('#camera-placeholder');
const captureButton = document.querySelector('#capture');
let cameraStream;

document.querySelector('#start-camera').addEventListener('click', async () => {
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    camera.srcObject = cameraStream;
    placeholder.style.display = 'none';
    captureButton.disabled = false;
  } catch (error) {
    placeholder.textContent = 'Camera access was unavailable. Use the upload option below instead.';
  }
});

captureButton.addEventListener('click', () => {
  snapshot.width = camera.videoWidth;
  snapshot.height = camera.videoHeight;
  snapshot.getContext('2d').drawImage(camera, 0, 0);
  camera.style.display = 'none';
  snapshot.style.display = 'block';
  placeholder.textContent = 'Photo captured. Complete the field notes to create a report.';
  placeholder.style.display = 'block';
});

document.querySelector('#tree-image').addEventListener('change', (event) => {
  if (!event.target.files.length) return;
  const imageUrl = URL.createObjectURL(event.target.files[0]);
  camera.srcObject = null;
  camera.src = imageUrl;
  camera.controls = false;
  camera.style.display = 'block';
  snapshot.style.display = 'none';
  placeholder.textContent = 'Photo loaded. Complete the field notes to create a report.';
  placeholder.style.display = 'block';
});

document.querySelector('#screening-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const signs = [...document.querySelectorAll('input[name="sign"]:checked')].map((input) => input.parentElement.textContent.trim());
  const report = document.querySelector('#report');
  const signSummary = signs.length ? signs.join(', ') : 'No visible signs selected';
  report.replaceChildren();
  const heading = document.createElement('strong');
  heading.textContent = 'Screening report created';
  report.append(heading, `Location: ${document.querySelector('#location').value}. Signs recorded: ${signSummary}. Share the photo and notes with a plant-health specialist for confirmation.`);
  report.style.display = 'block';
});