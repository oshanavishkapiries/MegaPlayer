const { File } = require('megajs');
const path = require('path');
const { encrypt, decrypt } = require('../utils/encript-link');

function getMimeType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const mimeTypes = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mkv': 'video/x-matroska',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'm3u8': 'application/x-mpegURL',
    'ts': 'video/MP2T'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

exports.streamVideo = async (req, res) => {
  try {
    const fileUrl = decrypt(req.query.code);

    if (!fileUrl) {
      return res.status(400).json({ error: 'Mega.nz file URL is required' });
    }

    const file = File.fromURL(fileUrl);
    await file.loadAttributes();

    const fileName = file.name;
    const fileSize = file.size;
    const mimeType = getMimeType(fileName);
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Transfer-Encoding': 'binary'
      });

      const downloadStream = file.download({ start, end });
      downloadStream.pipe(res);

      downloadStream.on('error', (err) => {
        console.error('Error streaming file:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error streaming file' });
        }
      });
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
        'Accept-Ranges': 'bytes',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Transfer-Encoding': 'binary'
      });

      const downloadStream = file.download();
      downloadStream.pipe(res);

      downloadStream.on('error', (err) => {
        console.error('Error streaming file:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Error streaming file' });
        }
      });
    }
  } catch (err) {
    console.error('Error processing Mega.nz file URL:', err);
    res.status(500).json({ error: 'Invalid Mega.nz file URL or other error' });
  }
};

exports.encriptLink = (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    const encryptedUrl = encrypt(url);
    res.json({ encryptedUrl });
  } catch (err) {
    console.error('Error encrypting URL:', err);
    res.status(500).json({ error: 'Error encrypting URL' });
  }
};

exports.indexPage = (req, res) => {
  try {
    res.sendFile(path.join(__dirname, '../views/index.html'));
  } catch (err) {
    console.error('Error rendering index page:', err);
    res.status(500).json({ error: 'Error rendering index page' });
  }
};

exports.playerPage = (req, res) => {
  try {
    const videoUrl = req.query.code;
    if (!videoUrl) {
      return res.status(400).json({ error: 'Video URL is required' });
    }
    res.sendFile(path.join(__dirname, '../views/player.html'), { videoUrl });
  } catch (err) {
    console.error('Error rendering player page:', err);
    res.status(500).json({ error: 'Error rendering player page' });
  }
};
