import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './Resume.css';
import leftImage from '../assets/left-image_interview_Image.jpg';
import new_Image from '../assets/business-meeting-room-office.jpg';

const Resume = () => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setIsDragActive(false);
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      console.log('Uploaded file:', file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  return (
    <div className="resume-container">
      {/* Left Section */}
      <div className="left-section">
        <div className="title-page">AI Interview</div>
        <img src={leftImage} alt="Interview" className="interview-image" />
      </div>

      {/* Right Section */}
      <div className="right-section">
        <h2 className="upload-title">Upload Resume</h2>

        <div 
          {...getRootProps()} 
          className={`upload-container ${isDragActive ? 'active' : ''} ${isDragReject ? 'reject' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="upload-content">
            <svg className="upload-icon" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
              <path d="M8 15.01l3.09 3.89L16 13.01 14.21 12 11.17 15.99 9 13.5z"/>
            </svg>

            {!uploadedFile ? (
              <>
                <p className="upload-subtitle">Drag & Drop or</p>
                <button className="browse-button">Browse File</button>
                <p className="file-type">Only PDF</p>
              </>
            ) : (
              <div className="upload-success">
                <p className="file-name">{uploadedFile.name}</p>
                <p className="success-message">Uploaded Successfully!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;

