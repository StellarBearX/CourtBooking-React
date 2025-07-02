import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const SelectTimePage = () => {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("18:00-19:00");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
      await signInWithPopup(auth, provider);
      alert("✅ เข้าสู่ระบบแล้ว");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleNext = () => {
    if (!date) return alert("กรุณาเลือกวันที่");
    navigate("/select-court", { state: { date, timeSlot } });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
       
        <h2 className="text-2xl font-semibold text-center">📆 เลือกวันและช่วงเวลา</h2>
        <input
          type="date"
          className="border rounded w-full p-3"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          className="border rounded w-full p-3"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
        >
          <option value="17:00-18:00">17:00-18:00</option>
          <option value="18:00-19:00">18:00-19:00</option>
          <option value="19:00-20:00">19:00-20:00</option>
        </select>
        <button
          onClick={handleNext}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
        >
          ➡️ เลือกสนาม
        </button>
      </div>
    </div>
  );
};

export default SelectTimePage;