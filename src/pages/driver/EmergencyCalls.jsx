import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  fetchDriverModelByUserIdAction,
  acceptEmergencyAction,
  fetchMyActiveEmergencyAction,
  fetchUnclaimedEmergenciesAction,
  fetchPastEmergenciesAction,
} from "@/redux/driverSlice";
import TrackLocation from "@/components/common/TrackLocation";
import { MapPinIcon, ClockIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

const socket = io("http://localhost:5000");

const EmergencyCalls = () => {
  const dispatch = useDispatch();
  const [emergencies, setEmergencies] = useState([]);
  const [currentEmergency, setCurrentEmergency] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [pastEmergencies, setPastEmergencies] = useState([]);

  const profile = JSON.parse(localStorage.getItem("profile"));
  const { driver } = useSelector((state) => state.driver_slice);

  // Fetch driver info
  useEffect(() => {
    if (profile?.user?._id) {
      dispatch(fetchDriverModelByUserIdAction(profile.user._id));
    }
  }, [dispatch, profile]);

  // Fetch assigned emergency
  useEffect(() => {
    if (driver?._id) {
      dispatch(fetchMyActiveEmergencyAction(driver._id))
        .unwrap()
        .then((data) => {
          if (data && data.status !== "completed") {
            setCurrentEmergency(data);
            startDriverLocationUpdates(driver._id);
          }
        });
    }
  }, [driver]);

  // Fetch unclaimed emergencies
  useEffect(() => {
    dispatch(fetchUnclaimedEmergenciesAction())
      .unwrap()
      .then(setEmergencies);
  }, [dispatch]);

  // Past emergency records
  useEffect(() => {
    if (driver?._id) {
      dispatch(fetchPastEmergenciesAction(driver._id))
        .unwrap()
        .then(setPastEmergencies);
    }
  }, [driver]);

  // Socket listeners
  useEffect(() => {
    socket.on("newEmergency", (data) => {
      if (!data.driver) setEmergencies((prev) => [...prev, data]);
    });

    socket.on("emergencyClaimed", ({ emergencyId, driverId }) => {
      if (driverId !== driver?._id) {
        setEmergencies((prev) => prev.filter((e) => e._id !== emergencyId));
      }
    });

    return () => {
      socket.off("newEmergency");
      socket.off("emergencyClaimed");
    };
  }, [driver]);

  // Accept emergency
  const handleAccept = async (emergencyId) => {
    try {
      await dispatch(acceptEmergencyAction({ emergencyId, driverId: driver._id })).unwrap();
      socket.emit("acceptEmergency", { emergencyId, driverId: driver._id });

      const accepted = emergencies.find((e) => e._id === emergencyId);
      setCurrentEmergency(accepted);
      setEmergencies((prev) => prev.filter((e) => e._id !== emergencyId));
      startDriverLocationUpdates(driver._id);
    } catch (err) {
      console.error("Accept failed:", err);
    }
  };

  // Driver location emitter
  let locationIntervalId = null;
  const startDriverLocationUpdates = (driverId) => {
    if (locationIntervalId || !navigator.geolocation) return;

    locationIntervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setDriverLocation({ lat: latitude, long: longitude });
          socket.emit("driverLocationUpdate", { driverId, lat: latitude, long: longitude });
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (locationIntervalId) clearInterval(locationIntervalId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-rose-600 mb-10">
        🚑 Emergency Dispatch Center
      </h1>

      {/* Active Emergency */}
      {currentEmergency ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-10 border border-rose-200 dark:border-rose-700"
        >
          <h2 className="text-2xl font-semibold text-red-600 mb-2">🚨 Current Response</h2>
          <p className="text-gray-800 dark:text-gray-200 mb-2">Emergency ID: {currentEmergency._id}</p>
          <p className="mb-2">Hospital: <strong>{currentEmergency.hospital?.name}</strong></p>
          <p className="mb-2 flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-blue-500" />
            {currentEmergency.location?.address}
          </p>

          {driverLocation ? (
            <>
              <p className="mb-2">🧭 Your Position: {driverLocation.lat.toFixed(4)}, {driverLocation.long.toFixed(4)}</p>
              <TrackLocation
                driverCoords={driverLocation}
                patientCoords={{
                  lat: currentEmergency.location?.lat,
                  long: currentEmergency.location?.long,
                }}
              />
            </>
          ) : (
            <p>📡 Getting your current location…</p>
          )}
        </motion.div>
      ) : (
        <>
          {/* New Emergencies */}
          <h2 className="text-xl font-semibold text-blue-600 mb-4">🆕 Unclaimed Emergencies</h2>
          {emergencies.length === 0 ? (
            <p className="text-gray-500">No unclaimed calls at the moment.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {emergencies.map((e) => (
                <motion.div
                  key={e._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border hover:shadow-xl transition"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">🏥 {e.hospital?.name}</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    📍 {e.location?.address}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">Lat: {e.location?.lat}, Long: {e.location?.long}</p>
                  {e.driver ? (
                    <p className="text-red-500 font-medium">Already claimed</p>
                  ) : (
                    <button
                      onClick={() => handleAccept(e._id)}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
                    >
                      Accept Emergency
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Past Emergencies */}
      <div className="mt-16">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <ClipboardDocumentListIcon className="w-6 h-6 text-gray-500" />
          Past Emergency Logs
        </h2>
        {pastEmergencies.length === 0 ? (
          <p className="text-gray-500">No completed cases yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-separate border-spacing-y-2">
              <thead className="text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Hospital</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {pastEmergencies.map((e) => (
                  <tr
                    key={e._id}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <td className="px-4 py-2">{e._id.slice(-6)}</td>
                    <td className="px-4 py-2">{e.hospital?.name}</td>
                    <td className="px-4 py-2">
                      {new Date(e.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 capitalize text-sm">
                      {e.status === "completed" ? (
                        <span className="text-green-600 font-medium">Completed</span>
                      ) : (
                        <span className="text-yellow-500 font-medium">{e.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyCalls;
