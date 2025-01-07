const form = document.getElementById('url-form');
const buttons = document.querySelector('.buttons');
const result = document.getElementById('result');
const copyBtn = document.getElementById('copy-btn');
const playerBtn = document.getElementById('player-btn');

let encryptedUrl = '';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = document.getElementById('url').value;
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Generating URL...';
  submitBtn.disabled = true;

  try {
    const response = await fetch('/encript-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();
    encryptedUrl = data.encryptedUrl;
    result.textContent = 'URL generated successfully!';
    buttons.style.display = 'grid';
    submitBtn.textContent = 'Done';
    submitBtn.disabled = false;
  } catch (error) {
    result.textContent = 'Error encrypting URL. Please try again.';
    submitBtn.textContent = 'Done';
    submitBtn.disabled = false;
  }
});

copyBtn.addEventListener('click', () => {
  const textarea = document.createElement('textarea');
  textarea.value = window.location.origin + '/stream-video?code=' + encodeURIComponent(encryptedUrl);
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
  alert('URL copied to clipboard!');
});

playerBtn.addEventListener('click', () => {
  if (encryptedUrl) {
    window.location.href = `/player?code=${encodeURIComponent(encryptedUrl)}`;
  }
});
