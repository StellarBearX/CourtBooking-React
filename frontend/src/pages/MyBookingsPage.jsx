import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import '../index.css'; // Ensure Tailwind CSS is imported

const MyBookingsPage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        try {
          const res = await fetch("http://localhost:5001/api/bookings/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          setBookings(data);
        } catch (err) {
          console.error("❌ Error loading bookings:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="p-6">⏳ กำลังโหลด...</p>;

  if (!user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">กรุณา Login เพื่อดูการจองของคุณ</h2>
        <LoginButton />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📋 การจองของคุณ</h1>
<h1 className="text-2xl font-bold text-purple-600">✅ Tailwind ใช้ได้แน่นอน!</h1>
      {bookings.length === 0 ? (
        <p>ยังไม่มีรายการจอง</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="border rounded p-4 shadow-sm bg-white"
            >
              <p><strong>สนาม:</strong> #{booking.court_id}</p>
              <p><strong>วันที่:</strong> {booking.booking_date}</p>
              <p><strong>เวลา:</strong> {booking.time_slot}</p>
            </li>
          ))}
        </ul>
      )}

      <LogoutButton />
    </div>
  );
};

export default MyBookingsPage;