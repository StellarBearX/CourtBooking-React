import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const LoginButton = () => {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    try {
      await signInWithPopup(auth, provider);
      // No need to reload the page, just let onAuthStateChanged handle UI updates
    } catch (err) {
      console.error("❌ Login ผิดพลาด:", err);
      alert("เกิดข้อผิดพลาดขณะ Login");
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      🔐 Login ด้วย Google
    </button>
  );
};

export default LoginButton;