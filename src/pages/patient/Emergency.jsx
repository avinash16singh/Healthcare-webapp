import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewEmergencyAction,
  fetchActiveEmergencyByUserId,
} from "../../redux/patientSlice";
import socketIOClient from "socket.io-client";
import { motion } from "framer-motion";
import TrackLocation from "@/components/common/TrackLocation";
import { MapPinIcon, UserIcon, TruckIcon } from "@heroicons/react/24/solid";

const socket = socketIOClient("http://localhost:5000");

const Emergency = () => {
  const dispatch = useDispatch();
  const userId = JSON.parse(localStorage.getItem("profile"))?.user?._id;

  const { emergency } = useSelector((state) => state.patient_slice);

  const [loading, setLoading] = useState(false);
  const [driverLocation, setDriverLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId) {
      dispatch(fetchActiveEmergencyByUserId(userId));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    if (!emergency?.driver) return;

    const driverId = emergency.driver._id;

    const listener = (data) => {
      if (data.driverId === driverId) {
        setDriverLocation({ lat: data.lat, long: data.long });
      }
    };

    socket.on("driverLocationUpdate", listener);

    return () => {
      socket.off("driverLocationUpdate", listener);
    };
  }, [emergency?.driver]);

  const handleEmergencyRequest = () => {
    setLoading(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        const formObj = {
          userId,
          lat,
          long,
          address: "Unknown",
        };

        try {
          await dispatch(createNewEmergencyAction(formObj)).unwrap();
          await dispatch(fetchActiveEmergencyByUserId(userId));
        } catch (err) {
          setError("🚫 Failed to create emergency. Please try again.");
        }

        setLoading(false);
      },
      () => {
        setError("📍 Location access denied.");
        setLoading(false);
      }
    );
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-black px-6 py-12 flex items-center justify-center">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-400/20 rounded-full blur-2xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-red-600 dark:text-red-400 mb-4">
          Emergency Assistance
        </h2>
        <p className="text-center text-gray-700 dark:text-gray-300 mb-6">
          Instantly request an ambulance to your current location. Stay calm, help is on the way.
        </p>

        {!emergency && (
          <div className="flex justify-center">
            <motion.button
              onClick={handleEmergencyRequest}
              disabled={loading}
              whileTap={{ scale: 0.95 }}
              className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4 rounded-full shadow-lg relative overflow-hidden animate-pulse transition"
            >
              {loading ? "Requesting..." : "🚨 Request Emergency Ambulance"}
            </motion.button>
          </div>
        )}

        {emergency && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4 border border-gray-100 dark:border-gray-700"
          >
            <h3 className="text-xl font-semibold text-red-700 dark:text-red-300 flex items-center gap-2">
              <UserIcon className="h-6 w-6" />
              Emergency In Progress
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300">Emergency ID: {emergency._id}</p>

            {emergency.driver ? (
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium text-md">
                  <TruckIcon className="h-5 w-5" />
                  Ambulance Assigned
                </h4>
                {driverLocation ? (
                  <>
                    <div className="flex gap-4 text-sm text-gray-800 dark:text-gray-200">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>Lat: {driverLocation.lat.toFixed(5)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>Long: {driverLocation.long.toFixed(5)}</span>
                      </div>
                    </div>

                    <TrackLocation
                      driverCoords={driverLocation}
                      patientCoords={{
                        lat: emergency.location?.lat,
                        long: emergency.location?.long,
                      }}
                    />
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">📡 Awaiting driver's location...</p>
                )}
              </div>
            ) : (
              <p className="text-yellow-600 dark:text-yellow-400">⏳ Looking for the nearest ambulance...</p>
            )}
          </motion.div>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center text-red-500 font-medium"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
};

export default Emergency;
