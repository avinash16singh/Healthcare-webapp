// src/pages/LandingPage.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import {
  HeartIcon,
  CalendarIcon,
  BellAlertIcon,
  FolderIcon,
} from "@heroicons/react/24/solid";
import Lottie from "lottie-react";
import ambulanceAnim from "../../../public/img/ambulance-lottie.json";




export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-100 dark:from-gray-900 dark:via-black dark:to-gray-900 overflow-hidden">
      {/* Floating Backgrounds */}
      <div className="absolute top-0 left-0 w-[30rem] h-[30rem] bg-blue-300/20 dark:bg-blue-800/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[25rem] h-[25rem] bg-cyan-400/20 dark:bg-cyan-700/30 rounded-full blur-[100px] -z-10" />

      {/* Navigation */}
      <header className="w-full py-6 px-6 flex justify-between items-center">
        <Typography variant="h4" className="text-blue-700 dark:text-blue-400 font-bold">
          Healium
        </Typography>
        <Button
          color="blue"
          onClick={() => navigate("/auth/sign-in")}
          className="rounded-full px-6 py-2 text-sm font-medium shadow-lg"
        >
          Sign In
        </Button>
      </header>

      {/* Hero Section */}
      <div className="relative flex flex-col-reverse md:flex-row items-center justify-between px-8 md:px-16 py-12 md:py-24">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-center md:text-left"
        >
          <Typography variant="h2" className="font-extrabold text-4xl md:text-5xl text-gray-800 dark:text-white mb-6">
            Revolutionize Your Hospital Experience
          </Typography>
          <Typography className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            Real-time appointments, ambulance tracking, digital records & emergency support — Healium is your all-in-one healthcare gateway.
          </Typography>
          <Button
            size="lg"
            color="blue"
            onClick={() => navigate("/auth/sign-in")}
            className="mt-4 rounded-full shadow-xl px-8 py-3 text-base font-semibold"
          >
            Get Started
          </Button>
        </motion.div>

        {/* Right: Animated Ambulance */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, delay: 0.3 }}
          className="w-full max-w-md"
        >
          <Lottie animationData={ambulanceAnim} loop className="w-full h-auto" />
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="relative px-8 md:px-16 py-20">
        <Typography variant="h4" className="text-center text-3xl font-bold text-blue-700 dark:text-blue-400 mb-10">
          Why Choose Healium?
        </Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard icon={<CalendarIcon className="w-8 h-8" />} title="Appointments" color="bg-blue-100 dark:bg-blue-900" description="Book and manage doctor visits with ease." />
          <FeatureCard icon={<BellAlertIcon className="w-8 h-8" />} title="Emergency Alerts" color="bg-red-100 dark:bg-red-900" description="Get immediate response when emergencies strike." />
          <FeatureCard icon={<FolderIcon className="w-8 h-8" />} title="Medical Records" color="bg-green-100 dark:bg-green-900" description="Access and manage health records securely." />
          <FeatureCard icon={<HeartIcon className="w-8 h-8" />} title="Wellness Insights" color="bg-yellow-100 dark:bg-yellow-800" description="Smart health analytics to keep you informed." />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
        &copy; {new Date().getFullYear()} Healium HealthTech. All rights reserved.
      </footer>
    </section>
  );
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
      transition={{ duration: 0.4, type: "spring" }}
      className={`p-6 rounded-xl shadow-lg backdrop-blur-sm border border-gray-100 dark:border-gray-800 ${color}`}
    >
      <div className="mb-3 text-blue-700 dark:text-white">{icon}</div>
      <Typography variant="h6" className="text-gray-800 dark:text-white font-semibold">
        {title}
      </Typography>
      <Typography className="text-sm text-gray-700 dark:text-gray-300">
        {description}
      </Typography>
    </motion.div>
  );
}
