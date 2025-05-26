import axios from "axios";
import useragent from "useragent";

export async function requestLogger(req, res, next) {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgentString = req.headers["user-agent"];
    const agent = useragent.parse(userAgentString);

    let locationInfo = {};

    if (ip !== "::1" && ip !== "127.0.0.1") {
      const geo = await axios.get(`http://ip-api.com/json/${ip}`);
      locationInfo = {
        city: geo.data.city,
        region: geo.data.regionName,
        country: geo.data.country,
        isp: geo.data.isp,
        timezone: geo.data.timezone,
      };
    } else {
      locationInfo = {
        city: "Localhost",
        region: "Local",
        country: "N/A",
        isp: "N/A",
        timezone: "N/A",
      };
    }

    const logData = {
      ip,
      location: `${locationInfo.city}, ${locationInfo.country}`,
      region: locationInfo.region,
      isp: locationInfo.isp,
      timezone: locationInfo.timezone,
      browser: agent.family,
      os: agent.os.toString(),
      device: agent.device.toString(),
      timestamp: new Date(),
    };
    req.clientInfo = logData;

    console.log("🔍 Request Info:", logData);

    // Optionally: Save to DB
    // await LogModel.create(logData);
  } catch (err) {
    console.error("Error logging request info:", err.message);
  }

  next(); // Move to next middleware or route
}
