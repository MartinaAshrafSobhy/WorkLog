import axios from 'axios';
import { useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import * as Yup from 'yup';
import styles from './Register.module.css';
import { FaUser, FaIdCard, FaLock } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

export default function Register() {
  const navigate = useNavigate();
  const { setUserToken } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  const submitRegister = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:7000/user/signUp', values);
      if (data.message === 'done') {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('refreshToken', data.ref_Token);
        setUserToken(data.token);
        navigate('/');

      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong!');
      console.log(err);

    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      code: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Username is required'),
      code: Yup.string().required('Code is required'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          'Password must include at least one letter, one number, and one special character'
        ),

    }),
    onSubmit: submitRegister,
  });

  return <>
    <Helmet>
      <title>Register | WorkLog Manager</title>
      <meta name="description" content="Create an account to start managing attendance logs." />
    </Helmet>
    <div className={styles.wrapper}>
      <div className={styles.formBox + ' register'}>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={formik.handleSubmit}>
          <h1 style={{ color: '#FDC800' }}>Register</h1>

          {/* Username */}
          <div className={styles.inputBox}>
            <input
              placeholder="Username"
              type="text"
              name="name"
              className="form-control"
              {...formik.getFieldProps('name')}
            />
            <FaUser className={styles.icon} />
            {formik.touched.name && formik.errors.name && (
              <div className={styles.error}>{formik.errors.name}</div>
            )}
          </div>

          {/* ID Code */}
          <div className={styles.inputBox}>
            <input
              placeholder="ID Code"
              type="text"
              name="code"
              className="form-control"
              autoComplete="code"
              {...formik.getFieldProps('code')}
            />
            <FaIdCard className={styles.icon} />
            {formik.touched.code && formik.errors.code && (
              <div className={styles.error}>{formik.errors.code}</div>
            )}
          </div>

          {/* Password */}
          <div className={styles.inputBox}>
            <input
              placeholder="Password"
              type="password"
              name="password"
              className="form-control"
              autoComplete="new-password"
              {...formik.getFieldProps('password')}
            />
            <FaLock className={styles.icon} />
            {formik.touched.password && formik.errors.password && (
              <div className={styles.error}>{formik.errors.password}</div>
            )}
          </div>

          <button type="submit" className="button" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>

          <div className={styles.registerLink}>
            <p>
              Already have an account?{' '}
              <Link href="#" onClick={() => navigate('/login')}>
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </>;
}
