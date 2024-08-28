import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage = ({user} : any) => {
  if (!user) {
    return
  }

  const username = user.uid
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5); // 5秒のカウントダウン

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home"); // '/home'は遷移先のパスです。適宜変更してください。
    }, 5000); // 5000ミリ秒 = 5秒後に遷移

    // カウントダウンの更新
    const interval = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    // コンポーネントのアンマウント時にタイマーをクリアする
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="welcome-page">
      <h1>ようこそ、{username}さん！</h1>
      <p>{countdown}秒後にホームページに移動します...</p>
    </div>
  );
};

export default WelcomePage;
