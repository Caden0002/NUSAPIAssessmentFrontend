import React, { useEffect, useState } from "react";

const MyBookingsPage = () => {
  const [reservations, setReservations] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:3000/reservations/mine", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await res.json();
        setReservations(data);
      } catch (err) {
        console.error("Error loading bookings:", err);
      }
    };

    fetchBookings();
  }, [token]);

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">📋 My Bookings</h1>

      {reservations.length > 0 ? (
        <table className="w-full table-auto border bg-white shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Reservation ID</th>
              <th className="p-2 border">Flight</th>
              <th className="p-2 border">Seat</th>
              <th className="p-2 border">Fare Code</th>
              <th className="p-2 border">Origin</th>
              <th className="p-2 border">Destination</th>
              <th className="p-2 border">Departure</th>
              <th className="p-2 border">Arrival</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.ResId}>
                <td className="p-2 border">{r.ResId}</td>
                <td className="p-2 border">{r.FlightId}</td>
                <td className="p-2 border">
                  {r.SeatNumber} ({r.SeatClass})
                </td>
                <td className="p-2 border">{r.FareCode}</td>
                <td className="p-2 border">{r.Origin}</td>
                <td className="p-2 border">{r.Destination}</td>
                <td className="p-2 border">{r.DepartureTime}</td>
                <td className="p-2 border">{r.ArrivalTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">You have no bookings yet.</p>
      )}
    </div>
  );
};

export default MyBookingsPage;
