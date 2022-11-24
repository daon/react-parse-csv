import React from 'react';
import './style.css';
import { useState } from 'react';
import Papa from 'papaparse';
import Select from 'react-select';

export default function App() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(null);

  const handleFileUpload = (event) => {
    setLoading(true);
    setOptions(null);
    const file = event.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
        if (result.error) {
          setError(result.error);
        } else {
          setError(null);
          setOptions(
            result.data
              .slice(1)
              .map((row) => ({ value: row[0], label: row[0] }))
          );
        }
        setLoading(false);
      },
    });
  };

  return (
    <div className="App">
      <h1>Parse CSV</h1>

      <input
        type="file"
        name="file"
        accept=".csv"
        style={{ display: 'block', margin: '10px auto' }}
        onChange={handleFileUpload}
      />

      {loading && <div>loading...</div>}

      {error && <div>{error}</div>}

      {options && <Select defaultValue={options} isMulti options={options} />}
    </div>
  );
}
