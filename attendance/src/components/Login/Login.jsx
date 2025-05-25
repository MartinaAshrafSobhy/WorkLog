import React, { useState, useContext } from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import style from './Login.module.css';
import { UserContext } from '../../Context/UserContext';
import { Helmet } from 'react-helmet';



export default function Login() {
  const navigate = useNavigate();
  const { setUserToken } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const submitLogin = async (values) => {
    try {
      setisLoading(true)
      const { data } = await axios.post('http://localhost:7000/user/logIn', values);
      if (data.message === 'done') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('refreshToken', data.ref_Token);
        setUserToken(data.token);
        setisLoading(false);
        navigate('/');

      }
    } catch (err) {
      setisLoading(false)
      setError(err.response?.data?.message || 'Invalid login. Please try again.');
      console.log(err);
      
    }
    console.log(values);
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Username is required'),
      password: Yup.string()
        .required('Password is required')
        ,

    }),
    onSubmit: submitLogin
  });

  return <>

    <Helmet>
      <title>Login | WorkLog Manager</title>
      <meta name="description" content="Login to access the attendance management dashboard." />
    </Helmet>
    <div className={style.wrapper}>
      <div className={`${style.formBox} login`}>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={formik.handleSubmit}>
          <h1 style={{ color: '#FDC800' }}>Login</h1>

          <div className={style.inputBox}>
            <input
              type="text"
              name="name"
              className='form-control'
              placeholder="Username"
              autoComplete='username'
              {...formik.getFieldProps('name')}
            />
            <FaUser className={style.icon} />
            {formik.touched.name && formik.errors.name && (
              <div className={style.error}>{formik.errors.name}</div>
            )}
          </div>

          <div className={style.inputBox}>
            <input
              type="password"
              name="password"
              className='form-control'
              autoComplete='current-password'
              placeholder="Password"
              {...formik.getFieldProps('password')}
            />
            <FaLock className={style.icon} />
            {formik.touched.password && formik.errors.password && (
              <div className={style.error}>{formik.errors.password}</div>
            )}
          </div>


          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
          <div className={style.registerLink}>
            <p>
              Don't have an account?{' '}
              <Link onClick={() => navigate('/register')}>Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </>
    ;
}