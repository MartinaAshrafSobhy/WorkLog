import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

export default function Week() {
  const [data, setData] = useState([]);
  const [filteredDay, setFilteredDay] = useState(null);

  const daysOfWeek = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:7000/attendance/allSheets");
        const json = await res.json();
        setData(json.sheet || json.sheets || []);
      } catch (err) {
        console.error("Error fetching attendance data:", err);
      }
    };

    fetchData();
  }, []);

  const handleDayClick = (day) => {
    setFilteredDay(day);
  };

  const formatTime = (value) => {
        if (!value || isNaN(value)) return '';
        const minutes = Math.floor(value * 24 * 60);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

  const filteredData = filteredDay
    ? data.filter((entry) => entry.day === filteredDay)
    : [];

  return <>
  <Helmet>
        <title>Weekly Logs</title>
        <meta property="og:title" content="Weekly Logs" />
        <meta property="og:description" content="Manage attendance records, search, filter, and export reports." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/home " />
        <link rel="canonical" href="https://yourdomain.com/home " />
      </Helmet>
    <div style={{backgroundColor: '#F2F2F2'}} className="container mt-4 p-3 border rounded">
      <h2>Attendance by Day</h2>

      <div className="mb-3">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            onClick={() => handleDayClick(day)}
            style={{
              margin: '5px',
              padding: '8px 12px',
              backgroundColor: filteredDay === day ? '#007bff' : '#f0f0f0',
              color: filteredDay === day ? '#fff' : '#000',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {day}
          </button>
        ))}
      </div>

      {filteredDay && (
        <>
          <h4>Records for: {filteredDay}</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Code</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Arrives</th>
                <th style={{ padding: '10px', border: '1px solid #ddd' }}>Leaves</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((user, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.userId?.code}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.userId?.name}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatTime(user.arrivalTime)}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{formatTime(user.leavingTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  </>;
}
