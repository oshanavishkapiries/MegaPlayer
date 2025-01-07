const { File } = require('megajs');
const path = require('path');
const { encrypt, decrypt } = require('../utils/encript-link');


// Helper function to determine mime type
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

// Controller to stream video
exports.streamVideo = async (req, res) => {

  const fileUrl = decrypt(req.query.code)

  if (!fileUrl) {
    return res.status(400).send('Mega.nz file URL is required');
  }

  try {
    const file = File.fromURL(fileUrl);
    await file.loadAttributes();

    const fileName = file.name;
    const fileSize = file.size;

    const mimeType = getMimeType(fileName);

    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Transfer-Encoding': 'binary'
      });

      const downloadStream = file.download({
        start,
        end
      });

      downloadStream.pipe(res);

      downloadStream.on('error', (err) => {
        console.error('Error streaming file:', err);
        if (!res.headersSent) {
          res.status(500).send('Error streaming file');
        }
      });
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
        'Accept-Ranges': 'bytes'
      });

      const downloadStream = file.download();
      downloadStream.pipe(res);

      downloadStream.on('error', (err) => {
        console.error('Error streaming file:', err);
        if (!res.headersSent) {
          res.status(500).send('Error streaming file');
        }
      });
    }

  } catch (err) {
    console.error('Error processing Mega.nz file URL:', err);
    res.status(500).send('Invalid Mega.nz file URL or other error');
  }
};

exports.encriptLink = (req, res) => {
    const { url } = req.body;
    const encryptedUrl = encrypt(url);
    res.json({ encryptedUrl });
  };

exports.indexPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
};

// Controller to render the player page with the Mega URL
exports.playerPage = (req, res) => {
  const videoUrl = req.query.url;
  res.sendFile(path.join(__dirname, '../views/player.html'), { videoUrl });
};
