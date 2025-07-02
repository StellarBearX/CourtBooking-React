import React, { useEffect, useState } from "react";
import CourtCard from "../components/CourtCard";

const CourtsPage = () => {
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/courts");
        const data = await res.json();
        setCourts(data);
      } catch (err) {
        console.error("Failed to load courts:", err);
      }
    };
    fetchCourts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏟️ สนามทั้งหมด</h1>
      <div className="grid gap-6 grid-coåls-1 sm:grid-cols-2 md:grid-cols-3">
        {courts.map((court) => (
          <CourtCard key={court.id} court={court} />
        ))}
      </div>
    </div>
  );
};

export default CourtsPage;