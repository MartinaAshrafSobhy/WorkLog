import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

export default function Shift() {
  const [uniqueUsers, setUniqueUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:7000/attendance/allSheets");
        const data = await res.json();

        const rawData = data.sheet || data.sheets || data;

        // only users in shift
        const seen = new Set();
        const unique = [];

        rawData.forEach((record) => {
          const id = record.userId?._id;
          if (!seen.has(id)) {
            seen.add(id);
            unique.push({
              code: record.userId?.code,
              name: record.userId?.name,
              shift: record.shiftId?.number,
            });
          }
        });

        setUniqueUsers(unique);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return <>
  <Helmet>
        <title>Shifts Summary</title>
        <meta property="og:title" content="Shifts Summary" />
        <meta property="og:description" content="Manage attendance records, search, filter, and export reports." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/home " />
        <link rel="canonical" href="https://yourdomain.com/home " />
      </Helmet>
    <div style={{backgroundColor: '#F2F2F2'}} className="container mt-4 p-3 border rounded">
      <h2 className="text-center mb-4" style={{ color: "#FDC800" }}>
        Shifts Summary
      </h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
          <th style={{ padding: '10px', border: '1px solid #ddd' }}>Code</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Shift Number</th>
          </tr>
        </thead>
        <tbody>
          {uniqueUsers.map((user, index) => (
            <tr key={index}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.code}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.shift}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>;
}
