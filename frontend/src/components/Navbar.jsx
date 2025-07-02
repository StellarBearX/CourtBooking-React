import { Link } from "react-router-dom";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between">
      <Link to="/" className="font-bold text-xl">CourtBooking</Link>
      <div className="space-x-4 flex items-center">
        <Link to="/">Home</Link>
        <Link to="/courts">Courts</Link>
        <Link to="/booking">Booking</Link>
        <Link to="/my-bookings">My Bookings</Link>
        {user ? <LogoutButton /> : <LoginButton />}
      </div>
    </nav>
  );
}