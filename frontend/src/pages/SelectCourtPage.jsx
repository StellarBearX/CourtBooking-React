// src/pages/SelectCourtPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SelectCourtPage = () => {
  const [courts, setCourts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { date, timeSlot } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [courtRes, bookingRes] = await Promise.all([
          fetch("http://localhost:5001/api/courts"),
          fetch(`http://localhost:5001/api/bookings?date=${date}&time=${timeSlot}`),
        ]);
        if (!courtRes.ok) {
          throw new Error(`Failed to fetch courts: ${courtRes.status} ${courtRes.statusText}`);
        }
        if (!bookingRes.ok) {
          throw new Error(`Failed to fetch bookings: ${bookingRes.status} ${bookingRes.statusText}`);
        }
        const courtData = await courtRes.json();
        const bookingData = await bookingRes.json();
        console.log("🏸 COURTS:", courtData);
        console.log("📋 BOOKINGS:", bookingData);
        if (!Array.isArray(courtData)) {
          console.warn("⚠️ courtData is not an array:", courtData);
          setCourts([]);
        } else {
          if (courtData.length === 0) {
            console.warn("⚠️ courtData loaded but is empty");
          }
          setCourts(courtData);
        }
        setBookings(bookingData);
      } catch (err) {
        console.error("❌ Failed to load courts or bookings", err);
      } finally {
        setLoading(false);
      }
    };
    if (date && timeSlot) {
      fetchData();
    }
  }, [date, timeSlot]);

  const isCourtBooked = (courtId) => {
    return bookings.some((b) => b.court_id === courtId);
  };

  const handleSelect = (court) => {
    navigate("/checkout", {
      state: {
        court,
        date,
        timeSlot,
      },
    });
  };

if (!date || !timeSlot) {
  return (
    <div className="p-6 text-center">
      <p>⚠️ กรุณาเลือกวันและเวลาให้เรียบร้อยก่อน</p>
    </div>
  );
}

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-6">เลือกสนามที่ต้องการจอง</h2>
      {loading ? (
        <p className="text-center">กำลังโหลดสนาม...</p>
      ) : courts.length === 0 ? (
        <p className="text-center text-red-500">❌ ไม่พบสนาม กรุณาตรวจสอบการเชื่อมต่อหรือข้อมูลในฐานข้อมูล</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courts.map((court) => {
            const booked = isCourtBooked(court.id);
            return (
              <div
                key={court.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col justify-between"
              >
                <img
                  src={court.image_url}
                  alt={court.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
                <div>
                  <h3 className="text-lg font-semibold">{court.name}</h3>
                  <p className="text-sm text-gray-600">📍 {court.location}</p>
                  <p className="text-sm text-gray-600">💸 {court.price_per_hour} บาท/ชม.</p>
                  <p className={`mt-2 text-sm font-medium ${booked ? "text-red-600" : "text-green-600"}`}>
                    {booked ? "❌ ไม่ว่าง" : "✅ ว่าง"}
                  </p>
                </div>
                <button
                  onClick={() => handleSelect(court)}
                  disabled={booked}
                  className={`mt-3 w-full py-2 rounded-lg text-white ${booked ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                >
                  📌 {booked ? "ไม่สามารถจองได้" : "จองสนามนี้"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SelectCourtPage;