const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const ENVIRONMENT = process.env.ENVIRONMENT || "BLUE";
const VERSION = process.env.VERSION || "1.0.0";

const startTime = Date.now();

app.get("/", (req, res) => {
  res.json({
    message: "Blue-Green Deployment Demo API",
    environment: ENVIRONMENT,
    version: VERSION,
    status: "running"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    environment: ENVIRONMENT,
    version: VERSION,
    timestamp: new Date().toISOString()
  });
});

app.get("/api/version", (req, res) => {
  res.json({
    environment: ENVIRONMENT,
    version: VERSION
  });
});

app.get("/api/info", (req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  res.json({
    application: "Blue-Green Deployment Demo",
    environment: ENVIRONMENT,
    version: VERSION,
    status: "healthy",
    uptime_seconds: uptimeSeconds,
    node_version: process.version,
    timestamp: new Date().toISOString()
  });
});

/*
 * NEW FEATURE IN VERSION 2.0.0
 * This endpoint is used to demonstrate
 * the difference between Blue v1.0.0 and Green v2.0.0.
 */
app.get("/api/features", (req, res) => {
  res.json({
    environment: ENVIRONMENT,
    version: VERSION,
    features: [
      "Blue-Green Deployment",
      "Docker Containerization",
      "Nginx Traffic Switching",
      "Health Monitoring",
      "Fast Rollback"
    ],
    deployment_status: "v2 deployment ready"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("======================================");
  console.log(" Blue-Green Deployment Demo API");
  console.log("======================================");
  console.log(`Environment : ${ENVIRONMENT}`);
  console.log(`Version     : ${VERSION}`);
  console.log(`Port        : ${PORT}`);
  console.log(`Status      : Running`);
  console.log("======================================");
});
