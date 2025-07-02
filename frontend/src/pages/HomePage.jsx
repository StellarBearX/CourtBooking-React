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

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">เลือกสนามที่ต้องการจอง</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {COURTS.map((court) => (
          <div
            key={court.id}
            className="border rounded-lg shadow hover:shadow-md cursor-pointer"
            onClick={() => goToCourt(court.id)}
          >
            <img
              src={court.image}
              alt={court.name}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="p-4 text-center">
              <h2 className="text-lg font-semibold">{court.name}</h2>
              <span className="text-sm text-green-600 font-medium">
                ว่าง
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;