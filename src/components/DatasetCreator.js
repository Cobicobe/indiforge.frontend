import React, { useState } from 'react';
import JSZip from 'jszip';

const profanityList = ['badword1', 'badword2']; // extend this

function DatasetCreator({ onDatasetReady }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [hash, setHash] = useState('');
  const [warnings, setWarnings] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const analyzeContent = async (file) => {
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (['exe', 'bat', 'sh'].includes(fileExt)) {
      return `Blocked file type: ${fileExt}`;
    }

    if (['txt', 'csv', 'json'].includes(fileExt)) {
      const text = await file.text();
      const found = profanityList.find(word => text.toLowerCase().includes(word));
      if (found) return `Inappropriate content found: ${found}`;
    }

    return null;
  };

  const createZipAndHash = async () => {
    const zip = new JSZip();
    const allWarnings = [];

    for (const file of files) {
      const warning = await analyzeContent(file);
      if (warning) allWarnings.push(`${file.name}: ${warning}`);
      zip.file(file.name, file);
    }

    setWarnings(allWarnings);
    if (allWarnings.length > 0) return;

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const arrayBuffer = await zipBlob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    setHash(hashHex);
    onDatasetReady({ title, description, hash: hashHex });
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Create a Dataset</h2>
      <input
        type="text"
        placeholder="Dataset Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      /><br /><br />
      <textarea
        placeholder="Dataset Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      /><br /><br />
      <input type="file" multiple onChange={handleFileChange} /><br /><br />
      <button onClick={createZipAndHash}>Analyze & Hash</button>
      {warnings.length > 0 && (
        <div style={{ color: 'red' }}>
          <h4>Warnings:</h4>
          <ul>{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
        </div>
      )}
      {hash && <p>SHA-256 Hash: {hash}</p>}
    </div>
  );
}

export default DatasetCreator;
