import CourtCard from "../components/CourtCard";

const courts = [
  {
    id: 1,
    name: "สนามแบดมินตัน CMU",
    location: "มหาวิทยาลัยเชียงใหม่",
    image: "https://via.placeholder.com/400x200?text=Court+1",
  },
  {
    id: 2,
    name: "สนามฟุตบอล 5",
    location: "ลำพูน",
    image: "https://via.placeholder.com/400x200?text=Court+2",
  },
];

export default function HomePage() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {courts.map((court) => (
        <CourtCard key={court.id} court={court} />
      ))}
    </div>
  );
}