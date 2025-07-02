import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import '../index.css';

const AdminBookingsPage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("18:00-19:00");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const res = await fetch("http://localhost:5001/api/bookings/all", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 403) {
            setError("คุณไม่มีสิทธิ์เข้าถึง (ไม่ใช่แอดมิน)");
            return;
          }

          const data = await res.json();
          setBookings(data);
        } catch (err) {
          console.error("❌ Admin fetch failed:", err);
          setError("เกิดข้อผิดพลาดขณะโหลดข้อมูล");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("คุณแน่ใจว่าต้องการลบรายการนี้?")) return;

    const token = await user.getIdToken();
    const res = await fetch(`http://localhost:5001/api/bookings/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setBookings(bookings.filter((b) => b.id !== id));
    } else {
      const err = await res.json();
      alert("❌ ลบไม่สำเร็จ: " + err.error);
    }
  };

  const handleSave = async (id) => {
    const token = await user.getIdToken();
    const res = await fetch(`http://localhost:5001/api/bookings/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        booking_date: editDate,
        time_slot: editTime,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setBookings(bookings.map((b) => (b.id === id ? { ...b, ...updated } : b)));
      setEditingId(null);
    } else {
      const err = await res.json();
      alert("❌ แก้ไขไม่สำเร็จ: " + err.error);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>กรุณา Login ก่อน</h2>
        <LoginButton />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>👥 รายการจองทั้งหมด (Admin)</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {bookings.length === 0 ? (
        <p>ยังไม่มีการจอง</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>สนาม</th>
              <th>วันที่</th>
              <th>เวลา</th>
              <th>สร้างเมื่อ</th>
              <th>ลบ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.id}</td>
                <td>{b.user_email}</td>
                <td>{b.court_id}</td>
                <td>{b.booking_date}</td>
                <td>{b.time_slot}</td>
                <td>{new Date(b.created_at).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDelete(b.id)}>🗑 ลบ</button>
                </td>
                <td>
                  {editingId === b.id ? (
                    <>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                      />
                      <select
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                      >
                        <option value="17:00-18:00">17:00-18:00</option>
                        <option value="18:00-19:00">18:00-19:00</option>
                        <option value="19:00-20:00">19:00-20:00</option>
                      </select>
                      <button onClick={() => handleSave(b.id)}>💾</button>
                      <button onClick={() => setEditingId(null)}>❌</button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(b.id);
                        setEditDate(b.booking_date);
                        setEditTime(b.time_slot);
                      }}
                    >
                      🔄 แก้ไข
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: 20 }}>
        <LogoutButton />
      </div>
    </div>
  );
};

export default AdminBookingsPage;