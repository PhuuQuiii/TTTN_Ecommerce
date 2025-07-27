// Debug endpoint for Vercel serverless
// This collects system and environment information

module.exports = (req, res) => {
  try {
    // Collect system info
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      env: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    };

    // Collect environment variables (filtering out sensitive ones)
    const safeEnv = {};
    Object.keys(process.env).forEach((key) => {
      if (
        !key.includes("SECRET") &&
        !key.includes("PASSWORD") &&
        !key.includes("KEY") &&
        !key.includes("TOKEN")
      ) {
        safeEnv[key] = process.env[key];
      } else {
        safeEnv[key] = "[FILTERED]";
      }
    });

    // Collect request info
    const requestInfo = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query,
    };

    return res.status(200).json({
      system: systemInfo,
      environment: safeEnv,
      request: requestInfo,
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
};
