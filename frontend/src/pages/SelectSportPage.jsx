import React from "react";
import { useNavigate } from "react-router-dom";

const SelectSportPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-bold">เลือกประเภทกีฬา</h1>
        <button
          onClick={() => navigate("/select-time")}
          className="bg-blue-600 text-white py-3 px-6 rounded-xl shadow hover:bg-blue-700 w-full"
        >
          🏸 CMU Badminton
        </button>
        {/* ในอนาคตเพิ่มกีฬาอื่นได้ */}
      </div>
    </div>
  );
};

export default SelectSportPage;
