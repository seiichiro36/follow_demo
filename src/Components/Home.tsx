import { Box, Button, grid, Grid } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Mypage from "./Mypage";
import OtherPage from "./OtherPage";
import FollowPage from "./FollowPage";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

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

const Home = () => {
  const user = useAuth();
  console.log("Home内のuser", user?.uid);

  const [gridCount, setGridCount] = useState<"1" | "2" | "3">("1");
  return (
    <>
      <Box w="100vw">
        <Grid templateColumns={`repeat(${gridCount}, 1fr)`}>
          <Mypage setGridCount={setGridCount}  user={user}/>
          {gridCount === "2" || gridCount === "3" ? (
            <FollowPage setGridCount={setGridCount} user={user} />
          ) : (
            <></>
          )}
          {gridCount === "3" ? <OtherPage /> : <></>}
        </Grid>
      </Box>
    </>
  );
};

export default Home;
