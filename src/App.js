import React from 'react';
import { useState } from 'react';
import Papa from 'papaparse';
import Select from 'react-select';

function now() {
  return typeof window.performance !== 'undefined'
    ? window.performance.now()
    : 0;
}

export default function App() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState(null);
  const [time, setTime] = useState(null);
  const [stream, setStream] = useState(false);
  const [worker, setWorker] = useState(false);
  const [renderSelect, setRenderSelect] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);

  const handleDrag = (event) => {
    event.preventDefault();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (
      event.dataTransfer.files &&
      event.dataTransfer.files[0] &&
      event.dataTransfer.files[0].type === 'text/csv'
    ) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  const handleParse = (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setTime(null);
    setOptions(null);
    let end = 0;
    const start = now();
    Papa.parse(file, {
      header: true,
      error: (error, file) => {
        end = now();
        console.error('ERROR:', err, file);
        setError(error);
        setLoading(false);
      },
      complete: (results) => {
        end = now();
        setError(null);
        console.table(results.data);
        setOptions(
          results.data.map((row) => ({
            value: row.Postcode,
            label: row.Postcode,
          }))
        );
        setTime(end - start);
        setLoading(false);
      },
    });
  };

  return (
    <div className="container mx-auto pt-20">
      <div className="shadow sm:overflow-hidden sm:rounded-md">
        <form onSubmit={handleParse}>
          <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
              Parse CSV
            </h1>

            <div className="mt-4 space-y-4">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="stream"
                    name="stream"
                    type="checkbox"
                    value={stream}
                    onChange={(event) => setStream(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="stream" className="font-medium text-gray-700">
                    Stream
                  </label>
                  <p className="text-gray-500">
                    Results are delivered row by row to a step function. Use
                    with large inputs that would crash the browser.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="worker"
                    name="worker"
                    type="checkbox"
                    value={worker}
                    onChange={(event) => setWorker(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="worker" className="font-medium text-gray-700">
                    Worker thread
                  </label>
                  <p className="text-gray-500">
                    Uses a separate thread so the web page doesn't lock up.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="renderSelect"
                    name="renderSelect"
                    type="checkbox"
                    value={renderSelect}
                    onChange={(event) => setRenderSelect(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="renderSelect"
                    className="font-medium text-gray-700"
                  >
                    Render select input
                  </label>
                  <p className="text-gray-500">
                    Test how rendering performance are affected by the number of
                    postal codes
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <div className="text-sm">
                <p className="font-medium text-gray-700">Postal Codes</p>
                <p className="text-gray-500 ">
                  The CSV should be in the format (Country is optional)
                </p>
                <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mt-2 prose-primary bg-gray-100">
                  <pre>
                    <code>
                      Postcode;Country
                      <br />
                      00001;Sweden
                    </code>
                  </pre>
                </div>
              </div>

              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  draggable
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {file && (
                    <p className="mb-2 text-sm text-gray-500 dakr:text-gray-400 font-semibold">
                      {file.name}
                    </p>
                  )}
                  {!file && (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        aria-hidden="true"
                        className="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{' '}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        .csv
                      </p>
                    </div>
                  )}
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={(event) => setFile(event.target.files[0])}
                    accept="text/csv"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
              disabled={!file}
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Parse
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="mt-6 text-center">
          <div role="status">
            <svg
              className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      {error && <div>{error}</div>}

      {time && (
        <div className="mt-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Stats
          </h2>
          <div className="mt-2">
            <div className="shadow sm:overflow-hidden sm:rounded-md">
              <div className="bg-white px-4 py-5 sm:p- sm:py-6">
                <p className="text-sm font-semibold text-gray-400 dark:text-gray-200">
                  Time
                </p>
                <h3 className="text-xl font-extrabold tracking-tight text-slate-900">
                  {time} ms
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderSelect && options && (
        <Select
          className="mt-4 mb-8"
          defaultValue={options}
          isMulti
          options={options}
        />
      )}
    </div>
  );
}
