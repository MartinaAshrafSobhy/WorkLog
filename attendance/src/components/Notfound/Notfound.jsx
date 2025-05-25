import React from 'react'
import { Link } from 'react-router-dom';

export default function Notfound() {
  return <>
   <div className='border rounded-3' style={styles.container}>
      <h1 style={styles.heading}>404 - Page Not Found</h1>
      <p style={styles.text}>
        Oops! We couldn't find what you're looking for. Try searching again or go back home.
      </p>
      <Link to="/" style={styles.link}>Go to Home</Link>
      
    </div>
  </>
}

const styles = {
    container: {
      background: '#F2F2F2',
      textAlign: 'center',
      margin: '50px',
      padding: '100px',
    },
    heading: {
      fontSize: '2rem',
      color: '#ff6347',
    },
    text: {
      fontSize: '1.2rem',
      color: '#555',
    },
    link: {
      fontSize: '1rem',
      color: '#007bff',
      textDecoration: 'none',
    }
  };