import React from "react";

const CourtCard = ({ court }) => {
  return (
    <div className="border rounded-lg shadow-md p-4 max-w-sm w-full">
      <img
        src={court.image_url}
        alt={court.name}
        className="w-full h-48 object-cover rounded"
      />
      <h2 className="text-xl font-semibold mt-2">{court.name}</h2>
      <p className="text-gray-600">{court.type}</p>
      <p className="text-gray-800 font-bold">฿{court.price_per_hour}/ชม.</p>
      <p className="text-sm text-gray-500">{court.location}</p>
    </div>
  );
};

export default CourtCard;