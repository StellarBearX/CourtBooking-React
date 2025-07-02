import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";

const BookingPage = () => {
  const [user, setUser] = useState(null);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("18:00-19:00");
  const [message, setMessage] = useState("");
  const courtId = 1;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleBooking = async () => {
    if (!user) {
      setMessage("❌ กรุณา Login ก่อนจองสนาม");
      return;
    }

    try {
      const token = await user.getIdToken();

      const res = await fetch("http://localhost:5001/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          court_id: courtId,
          booking_date: date,
          time_slot: timeSlot,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(`✅ จองสำเร็จ: ${data.booking_date} ${data.time_slot}`);
      } else {
        const error = await res.json();
        setMessage(`❌ จองไม่สำเร็จ: ${error.error}`);
      }
    } catch (err) {
      console.error("Booking error:", err);
      setMessage("❌ เกิดข้อผิดพลาดขณะจอง");
    }
  };

  const testAdminAllBookings = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const token = await user.getIdToken();

  const res = await fetch("http://localhost:5001/api/bookings/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  console.log("📋 All Bookings (admin):", data);
};

  // 🧪 ทดสอบดึงรายการจองของตัวเอง
  const testMyBookings = async () => {
    if (!user) return;
    const token = await user.getIdToken();

    const res = await fetch("http://localhost:5001/api/bookings/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("📋 My Bookings:", data);
  };



  if (!user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">กรุณา Login ก่อนจองสนาม</h2>
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">📅 จองสนาม</h1>

      <label className="block mb-2">วันที่:</label>
      <input
        type="date"
        className="border p-2 w-full mb-4"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <label className="block mb-2">ช่วงเวลา:</label>
      <select
        className="border p-2 w-full mb-4"
        value={timeSlot}
        onChange={(e) => setTimeSlot(e.target.value)}
      >
        <option value="17:00-18:00">17:00-18:00</option>
        <option value="18:00-19:00">18:00-19:00</option>
        <option value="19:00-20:00">19:00-20:00</option>
      </select>

      <button
        onClick={handleBooking}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        📌 จองสนาม
      </button>

      <button
        onClick={testMyBookings}
        className="mt-4 bg-gray-600 text-white px-4 py-2 rounded"
      >
        🧪 ทดสอบ My Bookings

      </button>
      <button
        onClick={testAdminAllBookings}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
      >
        🧑‍💼 ทดสอบดูการจองทั้งหมด (admin)
      </button>

      {message && <p className="mt-4">{message}</p>}

      <LogoutButton />
    </div>
  );
};

export default BookingPage;