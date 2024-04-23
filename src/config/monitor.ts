import expressStatusMonitor from "express-status-monitor";

const url = new URL(process.env.URL);
const PORT = process.env.PORT;
const PROTOCOL = url.protocol;
const HOST = url.host;

const monitor = expressStatusMonitor({
  title: "TrainTrack Status", // The title of the status page
  path: "/status",
  spans: [
    {
      interval: 1, // Every second
      retention: 60, // Keep 60 datapoints in memory
    },
    {
      interval: 5, // Every 5 seconds
      retention: 60,
    },
    {
      interval: 15, // Every 15 seconds
      retention: 60,
    },
  ],
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    responseTime: true,
    rps: true,
    statusCodes: true,
  },
  healthChecks: [],
});

export default monitor;
