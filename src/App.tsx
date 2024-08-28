import Login from "./Components/Login";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User, getAuth } from "firebase/auth";
import Home from "./Components/Home";
import SetInitialStatus from "./Components/SetInitialStatus";
import { Route, Routes } from "react-router-dom";
import WelcomePage from "./Components/WelcomePage";

function App() {
  const [userStatus, setUserStatus] = useState({
    username: "",
    userId: "",
    bid: "",
  });

  function useAuth() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
      });

      return () => unsubscribe();
    }, []);

    return user;
  }

  const user = useAuth();
  console.log("Home内のuser", user?.uid);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/initialSetting"
          element={
            <SetInitialStatus
              userStatus={userStatus}
              setUserStatus={setUserStatus}
              user={user}
            />
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/welcome" element={<WelcomePage user={user}/>} />
      </Routes>
    </>
  );
}

export default App;
