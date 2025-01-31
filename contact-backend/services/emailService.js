const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const path = require('path'); // Import path module
const router = express.Router();

const upload = multer({ dest: 'uploads/' }); // Temporary storage for file uploads

// Send email route
router.post('/:id/send-email', upload.single('attachment'), async (req, res) => {
  try {
    const { to, subject, content } = req.body;
    const attachment = req.file;

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'mail.smtp2go.com', // Correct SMTP service
      port: 587, // Usually 587 for secure TLS connections
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Set up email options
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to,
      subject,
      html: content,
      attachments: attachment
        ? [
            {
              filename: path.basename(attachment.path), // Name of the file sent
              path: attachment.path, // Path to the file stored temporarily
            },
          ]
        : [],
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

module.exports = router;