import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.min.mjs'; 
import './Resume.css';
import leftImage from '../assets/left-image_interview_Image.jpg';
import Groq from 'groq-sdk';
import { GROQ_API_KEY } from '../constants/config';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const Resume = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const extractTextFromPDF = async (file) => {
    const fileReader = new FileReader();
    
    return new Promise((resolve, reject) => {
      fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;
        let extractedText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          extractedText += pageText + '\n';
        }

        resolve(extractedText);
      };

      fileReader.onerror = () => reject('Error reading the file');
      fileReader.readAsArrayBuffer(file);
    });
  };

  const generateInterviewQuestions = async (resumeText) => {
    try {
      const groqClient = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true });

      const response = await groqClient.chat.completions.create({
        messages: [{
          role: "user",
          content: `Generate 10 separate and structured technical interview questions based on this resume: ${resumeText}. Format as a numbered list with clear separation.`
        }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3
      });

      let questions = response.choices[0].message.content.split(/\d+\.\s+/).filter(q => q.trim());
      if (questions.length > 10) questions = questions.slice(1, 11); // Remove unwanted first line if present
      return questions;
    } catch (error) {
      console.error("Error generating interview questions:", error);
      return [];
    }
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setLoading(true);
    const file = acceptedFiles[0];

    if (file && file.type === 'application/pdf') {
      try {
        const resumeText = await extractTextFromPDF(file);
        const questions = await generateInterviewQuestions(resumeText);

        navigate('/interview', { state: { questions } });
      } catch (error) {
        console.error('Error processing resume:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [navigate]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  return (
    <div className="resume-container">
      <div className="left-section">
        <div className="title-page">AI Interview</div>
        <img src={leftImage} alt="Interview" className="interview-image" />
      </div>

      <div className="right-section">
        <h2 className="upload-title">Upload Resume</h2>

        <div {...getRootProps()} className="upload-container">
          <input {...getInputProps()} />
          <div className="upload-content">
            {loading ? <div className="loading-spinner"></div> : (
              <>
                <p className="upload-subtitle">Drag & Drop or</p>
                <button className="browse-button">Browse File</button>
                <p className="file-type">Only PDF</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
