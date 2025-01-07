const form = document.getElementById('url-form');
const buttons = document.querySelector('.buttons');
const result = document.getElementById('result');
const copyBtn = document.getElementById('copy-btn');
const playerBtn = document.getElementById('player-btn');

let encryptedUrl = '';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = document.getElementById('url').value.trim();
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.textContent = 'Generating URL...';
  submitBtn.disabled = true;

  if (!url) {
    result.textContent = 'Error: URL cannot be empty.';
    submitBtn.textContent = 'Generate URL';
    submitBtn.disabled = false;
    return;
  }

  if (!/^https?:\/\/mega\.nz\/file\/.+$/.test(url)) {
    result.textContent = 'Error: URL must be a valid Mega.nz file link.';
    submitBtn.textContent = 'Generate URL';
    submitBtn.disabled = false;
    return;
  }

  try {
    const response = await fetch('/encript-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error('Failed to encrypt URL. Please try again.');
    }

    const data = await response.json();
    encryptedUrl = data.encryptedUrl;
    result.textContent = 'URL generated successfully!';
    buttons.style.display = 'grid';
    submitBtn.textContent = 'Generate URL';
    submitBtn.disabled = false;
  } catch (error) {
    console.error('Error:', error);
    result.textContent = error.message || 'An unexpected error occurred. Please try again.';
    submitBtn.textContent = 'Generate URL';
    submitBtn.disabled = false;
  }
});

copyBtn.addEventListener('click', () => {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = `${window.location.origin}/stream-video?code=${encodeURIComponent(encryptedUrl)}`;
    document.body.appendChild(textarea);
    textarea.select();
    if (document.execCommand('copy')) {
      alert('URL copied to clipboard!');
    } else {
      alert('Failed to copy URL. Please try again.');
    }
    textarea.remove();
  } catch (error) {
    console.error('Error copying URL:', error);
    alert('An error occurred while copying the URL.');
  }
});

playerBtn.addEventListener('click', () => {
  try {
    if (!encryptedUrl) {
      alert('Error: No encrypted URL available. Please generate one first.');
      return;
    }
    window.location.href = `/player?code=${encodeURIComponent(encryptedUrl)}`;
  } catch (error) {
    console.error('Error navigating to player:', error);
    alert('An error occurred while opening the player.');
  }
});
