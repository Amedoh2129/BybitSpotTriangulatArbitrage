const { log, error } = console;
const socket = require("socket.io");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const server = app.listen(3000, () => {
  log("Bybit spot triangular arbitrage finder has started. Please wait while the bot identifies possible paths...");
});

app.use(cors());
app.use("/JS", express.static(path.join(__dirname, "./Pages/JS")));

// Serve the index.html for the root URL
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "./Pages/index.html"));
});

// Set up Socket.IO
const io = socket(server);

const arbitrage = require("./arbitrage");

// Initialize the arbitrage process
const initialize = async () => {
  try {
    await arbitrage.getPairs();
    arbitrage.wsconnect();
  } catch (err) {
    error("Error initializing arbitrage:", err);
    process.exit(1);  // Exit process if arbitrage initialization fails
  }
};

// Handle incoming arbitrage data and emit it to connected clients
arbitrage.eventEmitter.on("ARBITRAGE", (pl) => {
  io.sockets.emit("ARBITRAGE", pl);
});

// Handle WebSocket connections and disconnections
io.on("connection", (socket) => {
  log("A new client connected.");
  
  socket.on("disconnect", () => {
    log("A client disconnected.");
  });
});

// Start the initialization process
initialize().catch((err) => {
  error("Error during initialization:", err);
  process.exit(1);  // Exit the process if initialization fails
});

// Global error handling for express routes
app.use((err, req, res, next) => {
  error("Unhandled error:", err);
  res.status(500).send("Something went wrong.");
});
