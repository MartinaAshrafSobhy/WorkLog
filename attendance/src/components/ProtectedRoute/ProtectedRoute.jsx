
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

export default function ProtectedRoute({ children }) {
  const { userToken, setUserToken } = useContext(UserContext);
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!userToken && token) {
      setUserToken(token);
    }

    if (!token) {
      navigate("/login");
    }

    setIsChecking(false);
  }, [userToken, navigate, setUserToken]);

  if (isChecking) {
    return <div>Loading...</div>; 
  }

  return userToken ? children : null;
}