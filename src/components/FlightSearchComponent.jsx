import React, { useState, useEffect } from "react";
import API_BASE_URL from "../config"; // ✅ import ngrok URL

const FlightSearchComponent = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [flights, setFlights] = useState([]);
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    const fetchAllFlights = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/flights`);
        const all = await res.json();
        setFlights(showAll ? all : []);

        const dates = [
          ...new Set(
            all.map(
              (flight) => flight.DepartureTime.split("T")[0].split(" ")[0]
            )
          ),
        ];
        setAvailableDates(dates.sort());
      } catch (err) {
        console.error("Error loading flights:", err);
      }
    };

    if (showAll) {
      fetchAllFlights();
    } else {
      setFlights([]);
    }
  }, [showAll]);

  const searchFlights = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/external/search?origin=${origin}&destination=${destination}&date=${date}`
      );
      const data = await res.json();
      setFlights(data);
    } catch (err) {
      console.error("Error fetching flights:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">🔍 Search Flights</h2>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="showAll"
          checked={showAll}
          onChange={(e) => setShowAll(e.target.checked)}
        />
        <label htmlFor="showAll" className="text-sm text-gray-700">
          Show all flights
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Origin (e.g. SIN)"
          className="p-2 border rounded"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination (e.g. NRT)"
          className="p-2 border rounded"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        >
          <option value="">Select Date</option>
          {availableDates.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={searchFlights}
      >
        Search
      </button>

      <div className="mt-6">
        {flights.length > 0 ? (
          <table className="w-full table-auto border mt-4 bg-white shadow-md">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Flight ID</th>
                <th className="p-2 border">Origin</th>
                <th className="p-2 border">Destination</th>
                <th className="p-2 border">Departure</th>
                <th className="p-2 border">Arrival</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.FlightId}>
                  <td className="p-2 border">{flight.FlightId}</td>
                  <td className="p-2 border">{flight.Origin}</td>
                  <td className="p-2 border">{flight.Destination}</td>
                  <td className="p-2 border">{flight.DepartureTime}</td>
                  <td className="p-2 border">{flight.ArrivalTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-4 text-gray-600">
            No flights found. Try searching or tick "Show all flights".
          </p>
        )}
      </div>
    </div>
  );
};

export default FlightSearchComponent;
