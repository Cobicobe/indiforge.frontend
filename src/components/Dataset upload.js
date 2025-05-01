import React, { useState } from 'react';

function DatasetUpload() {
  const [fileName, setFileName] = useState('');
  const [licenseMsg, setLicenseMsg] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setLicenseMsg(`License generated for dataset: ${file.name}`);
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <input type="file" onChange={handleFileChange} />
      {fileName && <p>Uploaded: {fileName}</p>}
      {licenseMsg && <p>{licenseMsg}</p>}
    </div>
  );
}

export default DatasetUpload;
