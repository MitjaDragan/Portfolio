import React, { useState, useEffect } from 'react';
import './WorkDiary.css';
import Logs from '../assets/data/work-logs.json';

const WorkDiary = ({ theme }) => {
  const [logs, setLogs] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date()); // Tracks the currently displayed month/year
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // Options: "month", "year", "day"

  useEffect(() => {
    setLogs(Logs);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Map logs into a date-count structure
  const getDateCounts = () => {
    const counts = {};
    logs.forEach((day) => {
      counts[day.date] = day.logs.length;
    });
    return counts;
  };

  const dateCounts = getDateCounts();

  const generateCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Start from the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const startDayOfWeek = firstDayOfMonth.getDay(); // Day of week (0: Sunday, 6: Saturday)
    const calendarGrid = [];

    let currentGridDate = new Date(firstDayOfMonth);
    currentGridDate.setDate(currentGridDate.getDate() - startDayOfWeek); // Start with the first Sunday before the month's start

    // Fill a 6-week grid (42 days) for consistency
    for (let i = 0; i < 42; i++) {
      const dateString = currentGridDate.toISOString().split('T')[0];
      calendarGrid.push({
        date: dateString,
        count: dateCounts[dateString] || 0,
        isCurrentMonth: currentGridDate.getMonth() === month,
      });
      currentGridDate.setDate(currentGridDate.getDate() + 1); // Increment to the next day
    }

    return calendarGrid;
  };

  const calendarGrid = generateCalendarGrid();

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setViewMode('day');
  };

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setViewMode('month');
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setViewMode('month');
  };

  const handlePreviousYear = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
    setViewMode('year');
  };

  const handleNextYear = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
    setViewMode('year');
  };

  const handleBackToMonthView = () => {
    setViewMode('month');
    setSelectedDate(null);
  };

  return (
    <div className="work-diary">
      <div className="work-diary__navigation">
        <button onClick={handlePreviousYear}>&laquo; Previous Year</button>
        <button onClick={handlePreviousMonth}>&lsaquo; Previous Month</button>
        <h2>
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h2>
        <button onClick={handleNextMonth}>Next Month &rsaquo;</button>
        <button onClick={handleNextYear}>Next Year &raquo;</button>
      </div>

      {viewMode === 'month' && (
        <>
          <div className="work-diary__weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
          </div>
          <div className="work-diary__calendar">
            {calendarGrid.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${
                  day.isCurrentMonth ? '' : 'calendar-day--inactive'
                }`}
                style={{
                  backgroundColor: day.count
                    ? `rgba(0, 128, 0, ${Math.min(day.count / 5, 1)})`
                    : 'transparent',
                }}
                onClick={() => handleDateClick(day.date)}
                title={`${day.date}: ${day.count} tasks`}
              >
                {new Date(day.date).getDate()}
              </div>
            ))}
          </div>
        </>
      )}

      {viewMode === 'day' && (
        <div className="work-diary__details">
          <button onClick={handleBackToMonthView}>Back to Month View</button>
          <h3>Logs for {selectedDate}</h3>
          <div className="work-diary__logs">
            {logs
              .find((log) => log.date === selectedDate)
              ?.logs.map((log, index) => (
                <div key={index} className="work-diary__log">
                  <h4>{log.task}</h4>
                  <p>
                    <span>Category:</span> {log.category}
                  </p>
                </div>
              )) || <p>No logs available for this date.</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkDiary;
