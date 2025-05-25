import React, { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';
import Navbar from '../Navbar/Navbar';



export default function Layout() {
   let {setUserToken} = useContext(UserContext);
  
    useEffect(()=>{
      if (localStorage.getItem('userToken')!==null){
        setUserToken(localStorage.getItem('userToken'))
      }
    },[])
  return <>
  <Navbar/>
  <Outlet></Outlet>
  
  </>
}

