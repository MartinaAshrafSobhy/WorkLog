import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import ExcelUploadForm from '../ExcelUploadForm/ExcelUploadForm';

export default function Header() {
  let navigate = useNavigate();
      const [users, setUsers] = useState([]);
  
  const handleUploadSuccess = (newData) => {
    setUsers(newData);
  };


  return <>

    <header style={styles.container}>
      <section className="container-fluid d-flex justify-content-between align-items-center py-3 px-5">


        {/* Left: Attendance Button */}
        <div className="text-center">
          <button
            className="button px-5"
            onClick={() => navigate('/attendance')}
          >
            Attendance
          </button>
        </div>

        {/* Center: Excel Upload */}
        <div>
          <ExcelUploadForm onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Right: Menu + Search */}
        <div className="d-flex align-items-center gap-3">
          <div className="dropdown">
            <button
              className="button px-5"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Sort by
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><Link className="dropdown-item" to="/shift">Shift</Link></li>
              <li><Link className="dropdown-item" to="/week">Week</Link></li>
            </ul>
          </div>
        </div>

      </section>
    </header>

  </>
};

const styles = {
  container: { textAlign: 'center', margin: '15px', padding: '10px', background: 'rgba(165, 203, 247, 0.78) ', color: '#fff', borderRadius: '8px' },
  searchInput: { padding: '10px', width: '60%', marginLeft: '20px' },
  ctaButton: { padding: '5px', cursor: 'pointer', margin: '0px 5px' }
};
