import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FlightSearchComponent from "./FlightSearchComponent";
import ReservationComponent from "./ReservationComponent";
import API_BASE_URL from "../config"; // ✅ import base URL

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userInfo, setUserInfo] = useState(null);
  const [reservations, setReservations] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reservations/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setReservations(data);
    } catch (err) {
      console.error("Failed to load reservations", err);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUserInfo(data);
    } catch (err) {
      console.error("Failed to load user info", err);
    }
  };

  const deleteReservation = async (resId) => {
    const confirm = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(`${API_BASE_URL}/reservations/${resId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to cancel");
      }

      fetchReservations();
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchReservations();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🧑‍💻 User Dashboard</h1>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {userInfo ? (
        <div className="mb-6 p-4 bg-white shadow rounded border">
          <p>
            <strong>Username:</strong> {userInfo.Username}
          </p>
          <p>
            <strong>Hashed Password:</strong> {userInfo.UserPassword}
          </p>
          <p>
            <strong>Role:</strong> {userInfo.Role}
          </p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}

      <FlightSearchComponent />
      <ReservationComponent onReservationSuccess={fetchReservations} />

      <h2 className="text-xl font-semibold mb-2 mt-10">My Reservations</h2>
      {reservations.length > 0 ? (
        <ul className="bg-white p-4 rounded shadow space-y-2">
          {reservations.map((r) => (
            <li
              key={r.ResId}
              className="border p-2 rounded flex justify-between items-center"
            >
              <span>
                Reservation ID: <strong>{r.ResId}</strong> | Flight:{" "}
                <strong>{r.FlightId}</strong> | Seat:{" "}
                <strong>
                  {r.SeatNumber} ({r.SeatClass})
                </strong>
              </span>

              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                onClick={() => deleteReservation(r.ResId)}
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reservations found.</p>
      )}
    </div>
  );
};

export default Dashboard;
