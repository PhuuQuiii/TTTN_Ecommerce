// Super simple API endpoint without any dependencies
// This should always work regardless of any other issues

module.exports = (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Minimal API is working without any dependencies",
    timestamp: new Date().toISOString(),
    requestPath: req.url,
    requestMethod: req.method,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || "unknown",
  });
};
