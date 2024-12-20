import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadDocument } from '../services/frontend.service';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert('Please select a file before uploading.');
      return;
    }

    try {
      const response = await uploadDocument(file);
      setUploadStatus(response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('An error occurred during file upload.');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    }
  });

  return (
    <>
      <h2 className="text-lg mb-4">Upload a Document</h2>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 p-8 text-center cursor-pointer mb-4"
      >
        <input {...getInputProps()} />
        {file ? (
          <p className="text-sm text-gray-700 mt-2">
            <strong>Selected file:</strong> {file.name}
          </p>
        ) :
          <p>Drag & drop a file here, or click to select a file</p>
        }
      </div>
      <button
        type="submit"
        onClick={handleFileUpload}
        className="bg-blue-500 text-white px-4 py-2 w-24 rounded"
      >
        Upload
      </button>
      {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
    </>
  );
};

export default FileUpload;
