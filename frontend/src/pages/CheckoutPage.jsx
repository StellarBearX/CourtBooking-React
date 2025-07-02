import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const CheckoutPage = () => {
  const { state } = useLocation();
  const { court_id, name, date, timeSlot } = state || {};
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleConfirm = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return alert("กรุณา Login ก่อน");
    const token = await user.getIdToken();

    const res = await fetch("http://localhost:5001/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ court_id, booking_date: date, time_slot: timeSlot }),
    });

    if (res.ok) {
      navigate("/success", { state: { court_id, date, timeSlot } });
    } else {
      const err = await res.json();
      setMessage("❌ จองไม่สำเร็จ: " + err.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold">🔐 สรุปการจอง</h1>
        <p>สนาม: CMU Court {court_id}</p>
        <p>วันที่: {date}</p>
        <p>ช่วงเวลา: {timeSlot}</p>
        <button
          onClick={handleConfirm}
          className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
        >
          ✅ ยืนยันการจอง
        </button>
        {message && <p className="text-red-500 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default CheckoutPage;