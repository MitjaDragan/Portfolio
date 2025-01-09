import React, { useEffect, useState } from 'react';
import { GraphQLClient } from 'graphql-request';
import './WorkDiary.css';

const GITHUB_API = 'https://api.github.com/graphql';
const TOKEN = 'ghp_TfNut486GHiNrpIu30Ud12LO9n0ekr32M0q';

const WorkDiary = ({ theme }) => {
  const [contributions, setContributions] = useState(null);
  const username = 'MitjaDragan';

  console.log('API Key:', 'test');
  const fetchContributions = async () => {
    // Calculate 'from' date as one year ago
    const toDate = new Date(); // Current date
    const fromDate = new Date();
    fromDate.setFullYear(toDate.getFullYear() - 1); // Subtract 1 year
  
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
    return contributions.weeks.map((week) => week.contributionDays);
  };

  const calculateMonthAlignment = (firstDay) => {
    const firstDayDate = new Date(firstDay);
    const startDate = new Date(2024, 0, 1);
    const daysSinceStart = Math.floor((firstDayDate - startDate) / (1000 * 60 * 60 * 24));
    return Math.floor(daysSinceStart / 7) + 1;
  };

  const heatmap = renderHeatmap();

  return (
    <div className={`work-diary ${theme}-theme`}>
      <h2>Work Diary</h2>
      <div className="work-diary__heatmap">
        <div className="work-diary__months">
          {contributions.months.map((month, index) => {
            if (month.name === "Dec" && index === 0) return null; // Skip the first "Dec"
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
