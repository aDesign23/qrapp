const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Supported file extensions (add more if needed)
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf'];

router.get('/:program/:grade/:subject/:chapter/:topic', (req, res) => {
  const { program, grade, subject, chapter, topic } = req.params;
  const rtmDir = path.join(__dirname, '..', 'rtm', grade, subject, chapter, topic);

  // Try to find a file with allowed extension
  let foundFile = null;
  for (const ext of allowedExtensions) {
    const filePath = path.join(rtmDir, topic + ext);
    if (fs.existsSync(filePath)) {
      foundFile = filePath;
      break;
    }
  }

  if (!foundFile) {
    return res.status(404).send('Material not found');
  }

  // Get the file extension
  const ext = path.extname(foundFile).toLowerCase();
  const relFilePath = path.relative(path.join(__dirname, '..'), foundFile).replace(/\\/g, '/');

  // Render the EJS view
  res.render('content', {
    program,
    grade,
    subject,
    chapter,
    topic,
    filePath: `/api/${relFilePath}`,
    ext
  });
});

// Serve the file securely via a sub-route
router.get('/rtm/:grade/:subject/:chapter/:topic/:filename', (req, res) => {
  const { grade, subject, chapter, topic, filename } = req.params;
  const filePath = path.join(__dirname, '..', 'rtm', grade, subject, chapter, topic, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }
  res.sendFile(filePath);
});

module.exports = router; 