import { useParams, useNavigate } from "react-router-dom";

const mockCourts = [
  {
    id: "1",
    name: "สนามแบดมินตัน CMU",
    location: "มหาวิทยาลัยเชียงใหม่",
    image: "https://via.placeholder.com/600x300?text=Court+1",
    slots: ["08:00-09:00", "09:00-10:00", "10:00-11:00"],
  },
  {
    id: "2",
    name: "สนามฟุตบอล 5",
    location: "ลำพูน",
    image: "https://via.placeholder.com/600x300?text=Court+2",
    slots: ["15:00-16:00", "16:00-17:00", "17:00-18:00"],
  },
];

export default function CourtDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const court = mockCourts.find((c) => c.id === id);

  if (!court) return <h2 className="text-center mt-10">ไม่พบข้อมูลสนาม</h2>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <img src={court.image} alt={court.name} className="w-full rounded shadow mb-4" />
      <h1 className="text-2xl font-bold">{court.name}</h1>
      <p className="text-gray-600 mb-4">{court.location}</p>

      <h2 className="text-xl font-semibold mb-2">ช่วงเวลาที่เปิดจอง:</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {court.slots.map((slot, idx) => (
          <button
            key={idx}
            onClick={() => navigate(`/booking/${id}?slot=${encodeURIComponent(slot)}`)}
            className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
          >
            {slot}
          </button>
        ))}
      </div>
    </div>
  );
}