import React, { useEffect, useState } from 'react';
import { GraphQLClient } from 'graphql-request';
import './WorkDiary.css';

const GITHUB_API = 'https://api.github.com/graphql';
const TOKEN = process.env.REACT_APP_WORKDIARY_TOKEN; // Replace with your token

const WorkDiary = ({ theme }) => {
  const [contributions, setContributions] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const username = 'MitjaDragan'; // Replace with your GitHub username

  const fetchContributions = async () => {
    const from = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
    const to = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
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

    const variables = { username, from, to };
    const client = new GraphQLClient(GITHUB_API, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    try {
      const data = await client.request(query, variables);
      const contributionDays = data.user.contributionsCollection.contributionCalendar.weeks.flatMap(
        (week) => week.contributionDays
      );
      setContributions(contributionDays);
    } catch (error) {
      console.error('Error fetching contributions:', error);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, [currentDate]);

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Fill blank days before the first of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ date: null, count: 0 });
    }

    // Fill actual days of the month with contributions
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day).toISOString().split('T')[0];
      const contribution = contributions.find((c) => c.date === date) || { contributionCount: 0 };
      days.push({ date, count: contribution.contributionCount });
    }

    return days;
  };

  const calendarDays = renderCalendar();

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  return (
    <div className="work-diary">
      <div className="work-diary__navigation">
        <button onClick={handlePreviousMonth}>&laquo; Previous Month</button>
        <h2>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h2>
        <button onClick={handleNextMonth}>Next Month &raquo;</button>
      </div>
      <div className="work-diary__weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>
      <div className="work-diary__calendar">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${day.date ? '' : 'calendar-day--inactive'}`}
            style={{
              backgroundColor: day.count
                ? `rgba(0, 128, 0, ${Math.min(day.count / 10, 1)})`
                : 'transparent',
            }}
            title={day.date ? `${day.date}: ${day.count} contributions` : ''}
          >
            {day.date ? new Date(day.date).getDate() : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkDiary;
