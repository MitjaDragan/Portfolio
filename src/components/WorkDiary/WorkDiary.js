import React, { useEffect, useState } from 'react';
import './WorkDiary.css';

// Replace this with your actual backend URL
const BACKEND_API = 'https://portfolio-mitja-dragans-projects.vercel.app/api/workDiary';

const WorkDiary = ({ theme }) => {
  const [contributions, setContributions] = useState(null);
  const username = 'MitjaDragan';

  const fetchContributions = async () => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setFullYear(toDate.getFullYear() - 1);

    const from = fromDate.toISOString();
    const to = toDate.toISOString();

    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              months {
                name
                firstDay
              }
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch(BACKEND_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { username, from, to } }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setContributions(data.user.contributionsCollection.contributionCalendar);
    } catch (error) {
      console.error('Error fetching contributions:', error);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  if (!contributions) {
    return <div>Loading...</div>;
  }

  const renderHeatmap = () => {
    return contributions.weeks.map((week) => week.contributionDays);
  };

  const calculateMonthAlignment = (firstDay) => {
    const firstDayDate = new Date(firstDay);
    const startOfYear = new Date(firstDayDate.getFullYear(), 0, 1);
    
    // Find the index of the first full week that contains the month's first day
    let weekIndex = contributions.weeks.findIndex(week =>
      week.contributionDays.some(day => day.date === firstDay)
    );
  
    // If not found, approximate based on days since start of year
    if (weekIndex === -1) {
      const dayOffset = Math.floor((firstDayDate - startOfYear) / (1000 * 60 * 60 * 24));
      weekIndex = Math.floor(dayOffset / 7);
    }
  
    return weekIndex + 1; // Align with the correct grid column
  };
  
  const heatmap = renderHeatmap();

  return (
    <div className={`work-diary ${theme}-theme`}>
      <h2>Work Diary</h2>
      <div className="work-diary__heatmap">
      <div className="work-diary__months">
  {contributions.months.map((month, index) => {
    if (index > 0 && month.name === contributions.months[index - 1].name) {
      return null; // Prevent duplicate month labels
    }

    return (
      <div
        key={index}
        className="month-label"
        style={{ gridColumnStart: calculateMonthAlignment(month.firstDay) }}
      >
        {month.name}
      </div>
    );
  })}
</div>

        <div className="work-diary__weeks">
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
                  title={day.date ? `${day.date}: ${day.contributionCount} contributions` : ''}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkDiary;
