// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const COURTS = [
  { id: 1, name: "CMU Court 1", image: "/court1.jpg" },
  { id: 2, name: "CMU Court 2", image: "/court2.jpg" },
  { id: 3, name: "CMU Court 3", image: "/court3.jpg" },
  { id: 4, name: "CMU Court 4", image: "/court4.jpg" },
  { id: 5, name: "CMU Court 5", image: "/court5.jpg" },
  { id: 6, name: "CMU Court 6", image: "/court6.jpg" },
];

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState([]);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("18:00-19:00");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/login");
      } else {
        setUser(firebaseUser);
        setLoading(false);
      }
    });
    return () => unsub();
  }, [navigate]);

  const goToCourt = (id) => navigate(`/courts/${id}`);

  const checkAvailability = async () => {
    const res = await fetch("http://localhost:5001/api/courts/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_date: date, time_slot: timeSlot }),
    });
    const data = await res.json();
    setAvailability(data);
  };

  const getCourtAvailability = (id) => {
    const found = availability.find((a) => a.court_id === id);
    return found ? found.available : null;
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">เลือกสนามที่ต้องการจอง</h1>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
        >
          <option value="17:00-18:00">17:00-18:00</option>
          <option value="18:00-19:00">18:00-19:00</option>
          <option value="19:00-20:00">19:00-20:00</option>
        </select>
        <button
          onClick={checkAvailability}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          🔍 ตรวจสอบสถานะ
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {COURTS.map((court) => {
          const available = getCourtAvailability(court.id);
          return (
            <div
              key={court.id}
              className="border rounded-lg shadow hover:shadow-md"
            >
              <img
                src={court.image}
                alt={court.name}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              <div className="p-4 text-center">
                <h2 className="text-lg font-semibold mb-2">{court.name}</h2>
                {available === null ? (
                  <span className="text-sm text-gray-500">ยังไม่ตรวจสอบ</span>
                ) : available ? (
                  <span className="text-sm text-green-600 font-medium">✅ ว่าง</span>
                ) : (
                  <span className="text-sm text-red-500 font-medium">❌ ไม่ว่าง</span>
                )}

                <button
                  onClick={() => goToCourt(court.id)}
                  className={`mt-3 w-full py-2 rounded text-white ${
                    available ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!available}
                >
                  📌 จองสนาม
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;