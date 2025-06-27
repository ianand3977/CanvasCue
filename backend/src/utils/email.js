const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendOtpEmail(email, otp) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`
  });
}

async function sendArtworkSubmissionEmail(email, artwork) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Artwork Submission Received',
    text: `Your artwork "${artwork.title}" has been submitted and is pending curator review.\n\nDescription: ${artwork.description}\nStatus: Pending Review\n\nThank you for submitting your art!`
  });
}

async function sendArtworkStatusEmail(email, artwork, status, feedback) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `Artwork ${status === 'approved' ? 'Approved' : 'Rejected'}`,
    text: `Your artwork "${artwork.title}" has been ${status}.\n\nDescription: ${artwork.description}\nStatus: ${status.charAt(0).toUpperCase() + status.slice(1)}\n${feedback ? `Curator Feedback: ${feedback}` : ''}\n\nThank you for being part of our community!`
  });
}

module.exports = { sendOtpEmail, sendArtworkSubmissionEmail, sendArtworkStatusEmail };
