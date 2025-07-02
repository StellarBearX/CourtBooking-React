// src/pages/CourtDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const TIME_SLOTS = [
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
];

const CourtDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [date, setDate] = useState("");
  const [status, setStatus] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (date) {
      checkSlotStatus();
    }
  }, [date]);

  const checkSlotStatus = async () => {
    const slotStatuses = {};

    for (const time_slot of TIME_SLOTS) {
      const res = await fetch("http://localhost:5001/api/courts/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_date: date, time_slot }),
      });
      const data = await res.json();
      const court = data.find((c) => c.court_id === parseInt(id));
      slotStatuses[time_slot] = court ? court.available : false;
    }
    setStatus(slotStatuses);
  };

  const handleBooking = async (timeSlot) => {
    if (!user) return alert("กรุณา Login ก่อน");
    const token = await user.getIdToken();

    const res = await fetch("http://localhost:5001/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        court_id: parseInt(id),
        booking_date: date,
        time_slot: timeSlot,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setMessage(`✅ จองสำเร็จ: ${data.booking_date} ${data.time_slot}`);
      checkSlotStatus();
    } else {
      const err = await res.json();
      setMessage(`❌ ไม่สามารถจองได้: ${err.error}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📍 สนามหมายเลข {id}</h1>

      <label className="block mb-2">เลือกวันที่:</label>
      <input
        type="date"
        className="border p-2 rounded mb-4 w-full"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <h2 className="text-lg font-semibold mb-2">⏰ เลือกช่วงเวลาที่ต้องการจอง:</h2>
      <div className="space-y-3">
        {TIME_SLOTS.map((slot) => (
          <div
            key={slot}
            className="flex justify-between items-center border p-3 rounded shadow"
          >
            <span>{slot}</span>
            {status[slot] === false ? (
              <span className="text-red-500 font-medium">❌ เต็ม</span>
            ) : (
              <button
                onClick={() => handleBooking(slot)}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                📌 จอง
              </button>
            )}
          </div>
        ))}
      </div>

      {message && <p className="mt-4 text-center font-medium">{message}</p>}
    </div>
  );
};

export default CourtDetailPage;