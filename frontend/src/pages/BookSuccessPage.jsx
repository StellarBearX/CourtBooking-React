// 5️⃣ BookSuccessPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookSuccessPage = () => {
  const { state } = useLocation();
  const { court_id, date, timeSlot } = state || {};
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 จองสำเร็จ!</h1>
        <p className="text-gray-700">สนาม: CMU Court {court_id}</p>
        <p className="text-gray-700">วันที่: {date}</p>
        <p className="text-gray-700 mb-4">ช่วงเวลา: {timeSlot}</p>

        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          🔙 กลับหน้าหลัก
        </button>
      </div>
    </div>
  );
};

export default BookSuccessPage;