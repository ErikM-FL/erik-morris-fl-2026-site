
  import nodemailer from 'nodemailer';

  export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    try {
      const { name = '', email = '', county = '', availability = '', roles = [], message = '', subscribe = false } = req.body || {};
      if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' });

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      });

      const to = process.env.TO_EMAIL;
      const from = process.env.FROM_EMAIL || process.env.SMTP_USER;

      const text = [
        `Volunteer submission`,
        `Name: ${name}`,
        `Email: ${email}`,
        `County: ${county}`,
        `Availability: ${availability}`,
        `Preferred roles: ${Array.isArray(roles)? roles.join(', '): roles}`,
        `Subscribe to mailing list: ${subscribe ? 'Yes' : 'No'}`,
        '',
        'Message:',
        message
      ].join('
');

      await transporter.sendMail({ to, from, subject: `Volunteer interest — ${name}`, text });
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to send. Please try again later.' });
    }
  }
