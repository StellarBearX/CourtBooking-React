// src/components/UserInfoBar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const UserInfoBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gray-100 text-sm text-gray-700 px-4 py-2 flex justify-end items-center gap-3">
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt="Avatar"
          className="w-6 h-6 rounded-full"
        />
      )}
      <span>👋 {user.displayName || user.email}</span>
      <button
        onClick={handleLogout}
        className="text-red-500 hover:underline text-xs"
      >
        ออกจากระบบ
      </button>
    </div>
  );
};

export default UserInfoBar;