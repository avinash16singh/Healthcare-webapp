import React, { useState } from "react";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signUpAction } from "@/redux/userSlice";
import { motion } from "framer-motion";

const features = [
  {
    icon: "🩺",
    title: "Doctor Access",
    description: "Book appointments and access top-tier doctors effortlessly.",
    color: "bg-blue-100 dark:bg-blue-800/40",
  },
  {
    icon: "📋",
    title: "Medical History",
    description: "View your reports, lab tests, and prescriptions anytime.",
    color: "bg-green-100 dark:bg-green-800/40",
  },
  {
    icon: "🚨",
    title: "Emergency Help",
    description: "Emergency alerts and direct access to care teams.",
    color: "bg-red-100 dark:bg-red-800/40",
  },
  {
    icon: "💳",
    title: "Billing & Insurance",
    description: "Manage bills and insurance claims with ease.",
    color: "bg-yellow-100 dark:bg-yellow-800/40",
  },
];

export function SignUp() {
  const [formObj, setFormObj] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreed: false,
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormObj((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword, phone, agreed } = formObj;

    if (!fullName || !email || !password || !confirmPassword || !phone || !agreed) {
      alert("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const payload = {
      name: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      cpassword: confirmPassword,
      phone: phone.trim(),
      role: "patient",
    };

    dispatch(signUpAction(payload));
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-black overflow-hidden">
      {/* Background Blur Circles */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl"></div>
        <img
          src="/hospital-bg.svg"
          alt="hospital background"
          className="absolute top-0 right-0 w-1/2 opacity-10 pointer-events-none"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 px-6"
      >
        {/* Sign-Up Card */}
        <Card className="w-full max-w-md p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-xl border border-gray-200 dark:border-gray-800 rounded-xl">
          <Typography variant="h3" className="text-center font-bold text-gray-900 dark:text-white mb-4">
            Create Your Account
          </Typography>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              size="lg"
              name="fullName"
              placeholder="Full Name"
              value={formObj.fullName}
              onChange={handleChange}
              label="Full Name"
              crossOrigin=""
            />

            <Input
              size="lg"
              name="email"
              placeholder="Email Address"
              value={formObj.email}
              onChange={handleChange}
              label="Email"
              type="email"
              crossOrigin=""
            />

            <Input
              size="lg"
              name="phone"
              placeholder="Phone Number"
              value={formObj.phone}
              onChange={handleChange}
              label="Phone"
              type="tel"
              crossOrigin=""
            />

            <Input
              size="lg"
              name="password"
              placeholder="Password"
              value={formObj.password}
              onChange={handleChange}
              label="Password"
              type="password"
              crossOrigin=""
            />

            <Input
              size="lg"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formObj.confirmPassword}
              onChange={handleChange}
              label="Confirm Password"
              type="password"
              crossOrigin=""
            />

            <Checkbox
              name="agreed"
              checked={formObj.agreed}
              onChange={handleChange}
              label={
                <Typography variant="small" className="flex items-center text-gray-600 dark:text-gray-300">
                  I agree to the&nbsp;
                  <a href="#" className="underline text-blue-700 dark:text-blue-400">
                    Terms and Conditions
                  </a>
                </Typography>
              }
            />

            <Button type="submit" size="lg" color="blue" fullWidth>
              Register Now
            </Button>

            <Typography variant="small" className="text-center text-gray-600 dark:text-gray-400 mt-4">
              Already have an account?
              <Link to="/auth/sign-in" className="text-blue-600 dark:text-blue-400 ml-1 underline">
                Sign in
              </Link>
            </Typography>
          </form>
        </Card>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
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

export default SignUp;
