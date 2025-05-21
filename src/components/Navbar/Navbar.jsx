import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../YIyDxLvs61GeHV6M.png';
import { UserContext } from '../../Context/UserContext';
import style from './Navbar.module.css'


export default function Navbar() {
  let navigate = useNavigate();
  let { userToken, setUserToken } = useContext(UserContext);

 function logOut(e) {

  localStorage.removeItem("token");
  setUserToken(null);
  navigate("/login");
}

  return (
    <nav className="navbar navbar-expand-lg shadow-sm mb-3" style={styles.navbar}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logo}
            alt="Logo"
            width="50"
            height="50"
            className="d-inline-block align-top me-2"
          />
          <span className="fw-bold text-white fs-5">WorkLog Manager</span>
        </Link>

        <button
          className="navbar-toggler bg-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item mx-2">
              <Link className={style.navLink} to="/">Home</Link>
            </li>
            {userToken == null ? (
              <>
                <li className="nav-item mx-2">
                  <Link className={style.navLink} to="register">Register</Link>
                </li>
                <li className="nav-item mx-2">
                  <Link className={style.navLink} to="login">Login</Link>
                </li>
              </>
            ) : (
              <li className="nav-item mx-2">
                <Link
                  className={style.navLink}
                  href="/login"
                  onClick={() => {
                    logOut();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Logout
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#3f51b5',
    padding: '10px 0',
    borderBottom: '2px solid #FDC800',
  },
};
