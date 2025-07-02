import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/select-sport");
    });
    return () => unsub();
  }, [navigate]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      navigate("/select-sport");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-6">เข้าสู่ระบบ</h1>
        <button
          onClick={handleLogin}
          className="flex items-center justify-center gap-3 border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded hover:bg-gray-50 w-full"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
            alt="Google Logo"
            className="w-5 h-5"
          />
          <span className="font-medium">Login with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;