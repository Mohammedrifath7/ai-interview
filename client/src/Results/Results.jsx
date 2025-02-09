import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import './Results.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Results = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { scores = [], totalScore = 0, passed = false, questions = [], answers = [] } = state || {};

  // Data for the Doughnut chart (Overall Performance)
  const doughnutData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        label: 'Score',
        data: [totalScore, 100 - totalScore],
        backgroundColor: ['#4CAF50', '#FF5252'],
        borderColor: ['#4CAF50', '#FF5252'],
        borderWidth: 1,
      },
    ],
  };

  // Data for the Bar chart (Question-wise Performance)
  const barData = {
    labels: questions.map((_, index) => `Q${index + 1}`),
    datasets: [
      {
        label: 'Score',
        data: scores,
        backgroundColor: '#6366f1',
        borderColor: '#4f46e5',
        borderWidth: 1,
      },
    ],
  };

  // Insights based on scores
  const getInsights = () => {
    const totalQuestions = questions.length;
    const correctAnswers = scores.filter(score => score >= 7).length;
    const partialAnswers = scores.filter(score => score >= 4 && score < 7).length;
    const incorrectAnswers = scores.filter(score => score < 4).length;

    return {
      correctAnswers,
      partialAnswers,
      incorrectAnswers,
      accuracy: ((correctAnswers / totalQuestions) * 100).toFixed(2),
    };
  };

  const insights = getInsights();

  return (
    <div className="results-container">
      <div className={`result-header ${passed ? 'passed' : 'failed'}`}>
        <h1>{passed ? '🎉 Congratulations!' : '😞 Better Luck Next Time'}</h1>
        <h2>Final Score: {totalScore}/100</h2>
      </div>

      <div className="analytics-section">
        <div className="chart-container">
          <div className="chart-card">
            <h3>Overall Performance</h3>
            <Doughnut data={doughnutData} />
          </div>
          <div className="chart-card">
            <h3>Question-wise Performance</h3>
            <Bar data={barData} />
          </div>
        </div>

        <div className="insights-container">
          <h3>Key Insights</h3>
          <div className="insight-card">
            <p><strong>Accuracy:</strong> {insights.accuracy}%</p>
            <p><strong>Correct Answers:</strong> {insights.correctAnswers}</p>
            <p><strong>Partial Answers:</strong> {insights.partialAnswers}</p>
            <p><strong>Incorrect Answers:</strong> {insights.incorrectAnswers}</p>
          </div>
        </div>
      </div>

      <div className="score-breakdown">
        {questions.map((question, index) => (
          <div key={index} className="score-card">
            <h4>Q{index + 1}: {question}</h4>
            <p className="user-answer"><strong>Your Answer:</strong> {answers[index] || 'No answer provided'}</p>
            <div className="score-bar">
              <div
                className="score-progress"
                style={{ width: `${((scores[index] || 0) / 10) * 100}%` }}
              ></div>
              <span>{(scores[index] || 0)}/10</span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/')} className="restart-button">
        Start New Interview
      </button>
    </div>
  );
};

export default Results;