import React, { useEffect, useState } from "react";

const ReservationComponent = ({ onReservationSuccess }) => {
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState("");
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [fareCode, setFareCode] = useState("Y123");

  const token = localStorage.getItem("token");

  // 🛬 Load flights
  useEffect(() => {
    fetch("http://localhost:3000/flights", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch flights");
        return res.json();
      })
      .then(setFlights)
      .catch((err) => console.error("Error fetching flights:", err));
  }, [token]);

  // 🎟️ Load available seats when flight is selected
  useEffect(() => {
    if (!selectedFlight) return;

    fetch(`http://localhost:3000/seats/${selectedFlight}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch seats");
        return res.json();
      })
      .then(setSeats)
      .catch((err) => console.error("Error loading seats:", err));
  }, [selectedFlight, token]);

  const reserveSeat = async () => {
    try {
      const res = await fetch("http://localhost:3000/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          FlightId: selectedFlight,
          SeatId: selectedSeat,
          FareCode: fareCode,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Reservation failed");
      }

      const result = await res.json();
      alert(`✅ Reservation successful! ID: ${result.ResId}`);

      // 🆕 Trigger refresh in Dashboard
      if (onReservationSuccess) onReservationSuccess();
    } catch (err) {
      console.error("Reservation failed:", err);
      alert(`❌ ${err.message}`);
    }
  };

  return (
    <div className="mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">🎫 Make a Reservation</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Flight</label>
        <select
          className="p-2 border rounded w-full"
          value={selectedFlight}
          onChange={(e) => setSelectedFlight(e.target.value)}
        >
          <option value="">-- Choose a flight --</option>
          {flights.map((flight) => (
            <option key={flight.FlightId} value={flight.FlightId}>
              {flight.FlightId} | {flight.Origin} → {flight.Destination}
            </option>
          ))}
        </select>
      </div>

      {seats.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Seat</label>
          <select
            className="p-2 border rounded w-full"
            value={selectedSeat}
            onChange={(e) => setSelectedSeat(e.target.value)}
          >
            <option value="">-- Choose a seat --</option>
            {seats.map((seat) => (
              <option key={seat.SeatId} value={seat.SeatId}>
                {seat.SeatNumber} ({seat.SeatClass})
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSeat && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Fare Code</label>
          <input
            type="text"
            value={fareCode}
            onChange={(e) => setFareCode(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="e.g. Y123"
          />
        </div>
      )}

      <button
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-300"
        onClick={reserveSeat}
        disabled={!selectedFlight || !selectedSeat || !fareCode}
      >
        Reserve
      </button>
    </div>
  );
};

export default ReservationComponent;
