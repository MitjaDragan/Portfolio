import React, { useEffect, useState } from 'react';
import { GraphQLClient } from 'graphql-request';
import './WorkDiary.css';

const GITHUB_API = 'https://api.github.com/graphql';
const TOKEN = process.env.REACT_APP_WORKDIARY_TOKEN;

const WorkDiary = () => {
  const [contributions, setContributions] = useState(null);
  const username = 'MitjaDragan';

  const fetchContributions = async () => {
    const from = new Date(2024, 0, 1).toISOString(); // Start from 30th November 2023
    const to = new Date(2024, 11, 31).toISOString(); // End at 31st December 2024

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

    const client = new GraphQLClient(GITHUB_API, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    try {
      const data = await client.request(query, { username, from, to });
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
    const weeks = contributions.weeks.map((week) => week.contributionDays);
    return weeks;
  };

  const calculateMonthAlignment = (firstDay) => {
    const firstDayDate = new Date(firstDay);
    const startDate = new Date(2023, 10, 30); // Start from 30th November 2023
    const daysSinceStart = Math.floor((firstDayDate - startDate) / (1000 * 60 * 60 * 24));
    return Math.floor(daysSinceStart / 7) + 1; // Calculate grid column (week index) for each month
  };

  const heatmap = renderHeatmap();

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="work-diary">
      <h2>2024 Contribution Heatmap</h2>
      <div className="work-diary__heatmap">
        {/* Month Labels */}
        <div className="work-diary__months">
          <div className="day-label-placeholder"></div> {/* Placeholder for day labels */}
          {contributions.months.map((month, index) => (
            <div
              key={index}
              className="month-label"
              style={{ gridColumnStart: calculateMonthAlignment(month.firstDay) + 2 }} // +2 for day labels column
            >
              {month.name}
            </div>
          ))}
        </div>
        {/* Heatmap with Day Labels */}
        <div className="work-diary__rows">
          {/* Day Labels */}
          <div className="work-diary__day-labels">
            {daysOfWeek.map((day, index) => (
              <div key={index} className="day-label">
                {day}
              </div>
            ))}
          </div>
          {/* Weekly Contributions */}
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
    </div>
  );
};

export default WorkDiary;
