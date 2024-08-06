import { Box, Button, Divider, Flex, Input, Text } from "@chakra-ui/react";
import React, { MouseEventHandler, useState } from "react";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import {
  auth,
  provider,
  createUser,
  confirmExistedEmail,
  db,
  // checkUserDocumentExists,
} from "./firebase";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();

  const [loginUser, setLoginUser] = useState<string>();
  const [existedEmail, setExistedEmail] = useState<boolean>();

  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google サインイン成功:", user);

      console.log("Eメール", user.email);
      setExistedEmail(await confirmExistedEmail(user.email));

      await createUser({
        username: user.displayName || "",
        email: user.email || "",
      });

      return user;
    } catch (error: any) {
      console.error("Google サインインエラー:", error.code, error.message);
      throw error;
    }
  }

  async function handleGoogleSignIn() {
    try {
      const userCredential = await signInWithGoogle();
      console.log("userCredential:", userCredential);
      const user = userCredential;
      console.log(user);

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.hasLoggedInBefore) {
            console.log("既存ユーザーです。ホームページに遷移します。");

            navigate("./home");
          } else {
            // 初回ログインの場合
            await updateDoc(userRef, { hasLoggedInBefore: true });
            console.log("新規ユーザーです。初期設定ページに遷移します。");

            navigate("./initialSetting");
          }
        } else {
          // ドキュメントが存在しない場合（完全に新規のユーザー）
          await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName,
            hasLoggedInBefore: true,
            createdAt: new Date(),
          });
          console.log("新規ユーザーです。初期設定ページに遷移します。");
          navigate("./initialSetting");
        }
      }
    } catch (error) {
      console.error("サインインエラー:", error);
    }
  }
  return (
    <>
      <Box bg={"tomato"} h="100vh" w="100vw">
        <Flex justifyContent="center">
          <Box h="100vh" bg={"gray.200"} w="600px">
            <Flex flexDirection={"column"} alignItems={"center"}>
              <Text mt="30px">サインイン</Text>
              <Box w="500px" bg={"gray.50"} m="40px" px="40px">
                <Button w="100%" my="20px" onClick={handleGoogleSignIn}>
                  Googleでサインイン
                </Button>
                <Divider />
                <Button w="100%">Githubでサインイン</Button>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Login;
