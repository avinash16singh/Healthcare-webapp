import React, { useState } from "react";
import {
  Input,
  Button,
  Typography,
  Card,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInAction } from "@/redux/userSlice";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const features = [
  {
    title: "Appointments",
    description: "Book and manage patient schedules seamlessly.",
    icon: "📅",
    color: "bg-blue-100 dark:bg-blue-800/40",
  },
  {
    title: "Emergency Alerts",
    description: "Real-time alerts for emergency room triage.",
    icon: "🚨",
    color: "bg-red-100 dark:bg-red-800/40",
  },
  {
    title: "Medical Records",
    description: "Secure access to patient history and diagnostics.",
    icon: "📁",
    color: "bg-green-100 dark:bg-green-800/40",
  },
  {
    title: "Billing & Insurance",
    description: "Integrated payment and insurance workflows.",
    icon: "💳",
    color: "bg-yellow-100 dark:bg-yellow-800/40",
  },
];

export function SignIn() {
  const [formObj, setFormObj] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormObj((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { email, password } = formObj;

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      const result = await dispatch(signInAction({ email, password }));
      if (signInAction.fulfilled.match(result)) {
        navigate("/");
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"></div>
        <img
          src="/hospital-bg.svg"
          alt="medical illustration"
          className="absolute top-0 right-0 w-1/2 opacity-10 pointer-events-none"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-center"
      >
        {/* Left: Login Card */}
        <Card className="w-full max-w-md p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-2xl border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="text-center mb-6">
            <Typography variant="h3" className="font-bold text-gray-900 dark:text-white">
              Welcome to Healium
            </Typography>
            <Typography className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Sign in to access your hospital dashboard.
            </Typography>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              label="Email"
              name="email"
              size="lg"
              type="email"
              value={formObj.email}
              onChange={handleChange}
              className="dark:text-white"
              color="blue"
              crossOrigin=""
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                size="lg"
                type={showPassword ? "text" : "password"}
                value={formObj.password}
                onChange={handleChange}
                className="dark:text-white pr-10"
                color="blue"
                crossOrigin=""
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {error && (
              <Typography className="text-red-600 text-sm">{error}</Typography>
            )}

            <Button type="submit" size="lg" color="blue" fullWidth className="mt-2">
              Sign In
            </Button>
          </form>

          <div className="flex justify-between items-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            <Link to="#" className="hover:underline">
              Forgot password?
            </Link>
            <span>
              New here?
              <Link to="/auth/sign-up" className="text-blue-600 hover:underline dark:text-blue-400 ml-1">
                Create account
              </Link>
            </span>
          </div>
        </Card>

        {/* Right: Feature Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              className={`rounded-xl p-5 ${feature.color} shadow-md border border-gray-100 dark:border-gray-800 backdrop-blur-md`}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <Typography variant="h6" className="font-semibold text-gray-800 dark:text-white">
                {feature.title}
              </Typography>
              <Typography className="text-sm text-gray-700 dark:text-gray-300">
                {feature.description}
              </Typography>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default SignIn;
