import React from "react";
import { getAuth, signOut } from "firebase/auth";

const LogoutButton = () => {
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      alert("👋 ออกจากระบบแล้ว");
      // No need to reload the page, onAuthStateChanged will update the UI
    } catch (err) {
      console.error("❌ Logout ผิดพลาด:", err);
      alert("เกิดข้อผิดพลาดขณะ Logout");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded mt-4"
    >
      🔓 Logout
    </button>
  );
};

export default LogoutButton;