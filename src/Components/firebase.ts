// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import {
  doc,
  getFirestore,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  writeBatch,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  mffessagingSenderId: import.meta.env.VITE_APP_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export async function checkUserDocumentExists() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if(!user) {
        return null
      }
      console.log("checkUserDocumentExists内のuid: ", user.uid);
      if (user) {
        const uid = user.uid;
        const userRef = doc(db, "users", uid);

        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            console.log("ユーザードキュメントが存在します");
            resolve(true);
          } else {
            console.log("ユーザードキュメントが存在しません");
            resolve(false);
          }
        } catch (error) {
          console.error("エラーが発生しました:", error);
          resolve(false);
        }
      } else {
        console.log("ユーザーがログインしていません");
        resolve(false);
      }
    });
  });
}

export const createUser = async (userData: {
  username: string;
  email: string;
}) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("No authenticated user found");
    return null;
  }

  // ユーザーのuidを使用してドキュメント参照を作成
  const userDocRef = doc(db, "users", user.uid);

  // ドキュメントが既に存在するかチェック
  const userDocSnap = await getDoc(userDocRef);

  if (!userDocSnap.exists()) {
    // ドキュメントが存在しない場合、新しく作成
    await setDoc(userDocRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // profileImageUrl: user.photoURL // Googleアカウントの画像URLを追加
    });
  } else {
    // ドキュメントが既に存在する場合、更新
    await setDoc(
      userDocRef,
      {
        ...userData,
        updatedAt: serverTimestamp(),
        // profileImageUrl: user.photoURL // Googleアカウントの画像URLを追加
      },
      { merge: true }
    );
    console.log("Existing user document updated with ID:", user.uid);
  }

  // ユーザーのuidを返す
  return user.uid;
};

export async function confirmExistedEmail(
  email: string | null
): Promise<boolean> {
  if (!email) return false;

  try {
    console.log("関数内の", email);
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false;
  }
}
export async function toggleFollow(
  currentUser: User | null,
  targetUserId: string
) {
  try {
    if (!currentUser) {
      console.error("現在のユーザーが存在しません");
      return;
    }

    const followsRef = collection(db, "follows");
    const q = query(
      followsRef,
      where("follower", "==", currentUser.uid),
      where("following", "==", targetUserId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // フォロー関係が存在しない場合、新しくフォローする
      await addDoc(followsRef, {
        follower: currentUser.uid,
        following: targetUserId,
        timestamp: serverTimestamp(),
      });
      console.log("フォローに成功しました");
    } else {
      // フォロー関係が存在する場合、フォローを解除する
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log("フォロー解除に成功しました");
    }
  } catch (error) {
    console.error("フォロー操作中にエラーが発生しました", error);
  }
}

export async function updateUserProfile(user: any, userData: any) {
  const uid = user.uid;

  console.log("db:", db);
  console.log("uid:", uid);
  const userRef = doc(db, "users", uid);

  try {
    await updateDoc(userRef, {
      username: userData.username,
      userId: userData.userId,
      statusMessage: userData.statusMessage,
      tags: arrayUnion(...userData.tags),
    });
    console.log("ユーザープロフィールが更新されました");
  } catch (error) {
    console.error("エラー:", error);
  }
}

// 同じuserIdがないかの処理
export async function checkUserIdExists(targetUserId: string) {
  const db = getFirestore();
  const usersRef = collection(db, 'users');
  
  try {
    const querySnapshot = await getDocs(usersRef);
    
    for (const doc of querySnapshot.docs) {
      const userData = doc.data();
      if (userData.userId === targetUserId) {
        return true; // 一致するuserIdが見つかった
      }
    }
    
    return false; // 一致するuserIdが見つからなかった
  } catch (error) {
    console.error("Error checking userId:", error);
    throw error;
  }
}