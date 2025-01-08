import React, { useEffect, useState } from 'react';
import './WorkDiary.css';

const WorkDiary = ({ theme }) => {
  const [contributions, setContributions] = useState(null);

  useEffect(() => {
    // Fetch pre-built data from the static JSON file
    const fetchContributions = async () => {
      try {
        const response = await fetch('/work-diary-data.json');
        const data = await response.json();
        setContributions(data.viewer.contributionsCollection.contributionCalendar);
      } catch (error) {
        console.error('Error loading contributions data:', error);
      }
    };

    fetchContributions();
  }, []);

  if (!contributions) {
    return <div>Loading...</div>;
  }

  const renderHeatmap = () => {
    return contributions.weeks.map((week) => week.contributionDays);
  };

  const heatmap = renderHeatmap();

  return (
    <div className={`work-diary ${theme}-theme`}>
      <h2>Work Diary</h2>
      <div className="work-diary__heatmap">
        {heatmap.map((week, weekIndex) => (
          <div key={weekIndex} className="work-diary__week">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className="day"
                style={{
                  backgroundColor: day.contributionCount
                    ? `var(--contribution-color-${Math.min(day.contributionCount, 4)})`
                    : 'var(--day-default-color)',
                }}
                title={`${day.date}: ${day.contributionCount} contributions`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkDiary;
