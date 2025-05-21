import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Notfound from './components/Notfound/Notfound';
import Register from './components/Register/Register';
import Attendance from './components/Attendance/Attendance';
import UserContextProvider, { UserContext } from './Context/UserContext';
import { useContext, useEffect } from 'react';
import Login from './components/Login/Login';
import Shift from './components/Shift/Shift';
import Week from './components/Week/Week';


let routes = createBrowserRouter([
  {
    path: '/', element: <Layout />, errorElement: <Notfound />, children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'week', element: <Week/> },
      { path: 'shift', element: <Shift/> },
      { path: 'attendance', element: <Attendance /> }
    ]
  }
])

function App() {
 

  return <div style={{ backgroundColor: '#002147', minHeight: '100vh' }}>
    <UserContextProvider>
      <RouterProvider router={routes}></RouterProvider>
  </UserContextProvider>
  </div>
}

export default App;
