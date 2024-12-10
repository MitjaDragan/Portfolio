import React, { useEffect, useState } from 'react';
import { GraphQLClient } from 'graphql-request';
import './WorkDiary.css';

const GITHUB_API = 'https://api.github.com/graphql';
const TOKEN = process.env.REACT_APP_WORKDIARY_TOKEN;

const WorkDiary = () => {
  const [contributions, setContributions] = useState(null);
  const username = 'MitjaDragan';

  const fetchContributions = async () => {
    const from = new Date(new Date().getFullYear(), 0, 1).toISOString();
    const to = new Date(new Date().getFullYear(), 11, 31).toISOString();

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
      console.log('Contributions:', data.user.contributionsCollection.contributionCalendar);
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
  
  const heatmap = renderHeatmap();
  
  return (
    <div className="work-diary">
      <h2>{new Date().getFullYear()} Contribution Heatmap</h2>
      <div className="work-diary__grid">
        <div className="work-diary__months">
          {contributions.months.map((month, index) => (
            <div key={index} className="month-label">{month.name}</div>
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
                      ? `rgba(0, 128, 0, ${Math.min(day.contributionCount / 10, 1)})`
                      : '#ebedf0',
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
