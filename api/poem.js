// api/poem.js — Vercel serverless function
import multer from 'multer';
import fs from 'fs';
import fetch from 'node-fetch';

const upload = multer({ dest: '/tmp' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    upload.single('image')(req, res, async (err) => {
      if (err) return reject(err);
      try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const buffer = fs.readFileSync(req.file.path);
        const base64 = buffer.toString('base64');

        const prompt = `You are an imaginative poet. Based on this image (base64 truncated) create a vivid 4-line poem.\n\n${base64.slice(0,200)}...`;

        const apiKey = process.env.OPENAI_API_KEY;
        const response = await fetch('https://api.openai.com/v1/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'text-davinci-003',
            prompt,
            max_tokens: 100,
          }),
        });

        const data = await response.json();
        const poem = data.choices?.[0]?.text?.trim() || 'No poem returned';

        res.status(200).json({ poem });
        resolve();
      } catch (error) {
        res.status(500).json({ error: error.message });
        reject(error);
      }
    });
  });
}
