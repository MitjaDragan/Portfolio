import React, { useEffect, useState } from 'react';
import './WorkDiary.css';

// Replace this with your actual backend URL
const BACKEND_API = 'https://portfolio-mitja-dragans-projects.vercel.app/api/workDiary';

const WorkDiary = ({ theme }) => {
  const [contributions, setContributions] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, text: '', x: 0, y: 0 });

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

    let weekIndex = contributions.weeks.findIndex(week =>
      week.contributionDays.some(day => day.date === firstDay)
    );

    if (weekIndex === -1) {
      const dayOffset = Math.floor((firstDayDate - startOfYear) / (1000 * 60 * 60 * 24));
      weekIndex = Math.floor(dayOffset / 7);
    }

    return weekIndex + 1;
  };

  const heatmap = renderHeatmap();

  // Tooltip event handlers
  const showTooltip = (event, text) => {
    setTooltip({
      visible: true,
      text,
      x: event.pageX + 10, // Offset to prevent overlap
      y: event.pageY - 30,
    });
  };

  const hideTooltip = () => {
    setTooltip({ visible: false, text: '', x: 0, y: 0 });
  };

  return (
    <div className={`work-diary ${theme}-theme`}>
      <h2>Work Diary</h2>
      <div className="work-diary__heatmap">
        <div className="work-diary__months">
          {contributions.months.map((month, index) => (
            <div
              key={index}
              className="month-label"
              style={{ gridColumnStart: index === 0 ? 1 : calculateMonthAlignment(month.firstDay), }}
            >
              {month.name}
            </div>
          ))}
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
                  onMouseEnter={(e) =>
                    showTooltip(e, `${day.date}: ${day.contributionCount} contributions`)
                  }
                  onMouseMove={(e) =>
                    setTooltip((prev) => ({ ...prev, x: e.pageX + 10, y: e.pageY - 30 }))
                  }
                  onMouseLeave={hideTooltip}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Global tooltip element */}
      {tooltip.visible && (
        <div
          className="tooltip visible"
          style={{ top: tooltip.y, left: tooltip.x }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default WorkDiary;
