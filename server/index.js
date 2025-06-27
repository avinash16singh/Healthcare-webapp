// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";

// import adminRouter from './routes/admin.js';
// import doctoRouter from './routes/doctor.js';
// import driverRouter from './routes/driver.js';
// import hospitalRouter from './routes/hospital.js';
// import patientRouter from './routes/patient.js';
// import authRouter from './routes/auth.js';



// dotenv.config();

// const app = express();

// app.use(
//   cors({
//     origin: "*",
//   })
// );

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Routes
// app.use('/admin', adminRouter);
// app.use('/doctor', doctoRouter);
// app.use('/driver', driverRouter);
// app.use('/hospital', hospitalRouter);
// app.use('/patient', patientRouter);

// app.use('/auth', authRouter)


// // MongoDB connection and server start
// const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => {
//   res.send('Welcome Budyy!');
// })

// mongoose
//   .connect(process.env.MONGODB_URL)
//   .then(() => {
//     console.log("App connected to DB.");
//     app.listen(PORT, () => console.log(`App is listening to PORT: ${PORT}`));
//   })
//   .catch((error) => console.log(`DB connection failed. error: ${error}`));


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

// Routes
import adminRouter from "./routes/admin.js";
import doctorRouter from "./routes/doctor.js";
import driverRouter from "./routes/driver.js";
import hospitalRouter from "./routes/hospital.js";
import patientRouter from "./routes/patient.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();

// Create HTTP server to attach socket.io
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // You can restrict this in production
    methods: ["GET", "POST"]
  }
});

// Store connected drivers by ID (optional)
const onlineDrivers = new Map();

// Socket.io logic
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Driver joins with driverId
  socket.on("registerDriver", (driverId) => {
    console.log("Driver registered:", driverId);
    onlineDrivers.set(driverId, socket);
  });

  // Handle driver location updates
  socket.on("driverLocationUpdate", ({ driverId, lat, long }) => {
    console.log(`Location from ${driverId}:`, lat, long);
    // Broadcast to whoever needs it, e.g. patient
    io.emit("driverLocationUpdate", { driverId, lat, long });
  });

  // Driver accepts emergency
  socket.on("acceptEmergency", ({ driverId, emergencyId }) => {
    console.log(`Driver ${driverId} accepted emergency ${emergencyId}`);
    io.emit("emergencyAccepted", { driverId, emergencyId });
  });

  // On disconnect
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    for (const [key, value] of onlineDrivers.entries()) {
      if (value.id === socket.id) {
        onlineDrivers.delete(key);
        break;
      }
    }
  });
});

// Attach io to every request using middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/admin", adminRouter);
app.use("/doctor", doctorRouter);
app.use("/driver", driverRouter);
app.use("/hospital", hospitalRouter);
app.use("/patient", patientRouter);
app.use("/auth", authRouter);

// Default Route
app.get("/", (req, res) => {
  res.send("🚑 Emergency Response Server is Running!");
});

// DB & Server Start
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("✅ Connected to MongoDB.");
    server.listen(PORT, () => {
      console.log(`🚀 Server + Socket.io running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
  });
