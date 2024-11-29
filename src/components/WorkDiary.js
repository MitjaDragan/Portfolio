import React, { useState, useEffect } from 'react';
import './WorkDiary.css';

const WorkDiary = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('/assets/data/work-logs.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }
        return response.json();
      })
      .then((data) => setLogs(data))
      .catch((error) => console.error('Error fetching logs:', error));
  }, []);
  

  return (
    <div className="work-diary">
      <h2 className="work-diary__heading">Work Diary</h2>
      {logs.length === 0 ? (
        <p>Loading work logs...</p>
      ) : (
        logs.map((day, index) => (
          <div key={index} className="work-diary__day">
            <h3>{day.date}</h3>
            {day.logs.map((log, logIndex) => (
              <div key={logIndex} className="work-diary__log">
                <h4>{log.task}</h4>
                <p>Category: {log.category}</p>
                <p>Status: {log.completed ? 'Completed' : 'Pending'}</p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default WorkDiary;
