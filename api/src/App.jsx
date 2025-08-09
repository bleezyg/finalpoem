import React, { useState } from 'react';
import './index.css';

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [poem, setPoem] = useState('');
  const [loading, setLoading] = useState(false);

  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function submitImage() {
    if (!file) return alert('Pick an image first');
    setLoading(true);
    const fd = new FormData();
    fd.append('image', file);

    try {
      const resp = await fetch('/api/poem', { method: 'POST', body: fd });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || JSON.stringify(data));
      setPoem(data.poem);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-4">📸 Picture → Poem ✍️</h1>
      <input type="file" accept="image/*" onChange={handleFile} className="mb-4" />

      {preview && <img src={preview} alt="preview" className="rounded-lg shadow-lg max-w-md mb-4" />}

      <button
        onClick={submitImage}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Composing...' : 'Create Poem'}
      </button>

      {poem && (
        <div className="bg-white p-4 rounded-lg shadow-lg mt-6 max-w-md w-full whitespace-pre-wrap">
          <h3 className="text-xl font-semibold mb-2">Poem</h3>
          {poem}
        </div>
      )}
    </div>
  );
}
