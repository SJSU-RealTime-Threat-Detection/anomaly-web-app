import { useState, useEffect } from "react";
import axios from "axios"; // Axios for HTTP requests

const getRandomIp = () => {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(
    Math.random() * 255
  )}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
};

const getRandomPath = () => {
  const paths = [
    "/index.html",
    "/login",
    "/dashboard",
    "/api/data",
    "/profile",
    "/search",
    "/admin",
    "/upload",
    "/logout",
    "/favicon.ico",
  ];
  return paths[Math.floor(Math.random() * paths.length)];
};

const getRandomUserAgent = () => {
  const agents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36",
  ];
  return agents[Math.floor(Math.random() * agents.length)];
};

const getFormattedDate = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const now = new Date();
  return `${String(now.getDate()).padStart(2, "0")}/${
    months[now.getMonth()]
  }/${now.getFullYear()}:${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")} +0000`;
};

const getRandomStatusCode = () => {
  const codes = [200, 201, 301, 400, 403, 404, 500, 429, 401];
  return codes[Math.floor(Math.random() * codes.length)];
};

const getRandomResponseSize = () => Math.floor(Math.random() * 5000) + 200;

const logTypes = {
  normal: () =>
    `${getRandomIp()} - - [${getFormattedDate()}] "GET ${getRandomPath()} HTTP/1.1" ${getRandomStatusCode()} ${getRandomResponseSize()} "-" "${getRandomUserAgent()}"`,
};

const anomalyLogTypes = {
  sql_injection: () => {
    const payloads = [
      "/search?q=' OR '1'='1",
      "/search?q=' UNION SELECT username, password FROM users--",
      "/search?q='; DROP TABLE users;--",
      "/search?q=' OR 1=1 --",
      "/search?q='; EXEC xp_cmdshell('whoami');--",
    ];
    return `${getRandomIp()} - - [${getFormattedDate()}] "GET ${
      payloads[Math.floor(Math.random() * payloads.length)]
    } HTTP/1.1" 500 ${getRandomResponseSize()} "-" "${getRandomUserAgent()}" SQL Injection Attack Detected`;
  },

  xss: () => {
    const payloads = [
      "/profile?name=<script>alert('XSS')</script>",
      "/profile?bio=<img src=x onerror=alert('XSS')>",
      "/comment?text=<svg onload=alert(1)>",
      "/search?query=<iframe src=javascript:alert(1)>",
      "/messages?msg=<body onload=alert('Hacked!')>",
    ];
    return `${getRandomIp()} - - [${getFormattedDate()}] "GET ${
      payloads[Math.floor(Math.random() * payloads.length)]
    } HTTP/1.1" 403 ${getRandomResponseSize()} "-" "${getRandomUserAgent()}" Cross-Site Scripting (XSS) Attack Detected`;
  },

  csrf: () =>
    `${getRandomIp()} - - [${getFormattedDate()}] "POST /transfer HTTP/1.1" 401 ${getRandomResponseSize()} "-" "${getRandomUserAgent()}" Cross-Site Request Forgery (CSRF) Attempt Detected`,

  ddos: () =>
    `${getRandomIp()} - - [${getFormattedDate()}] "GET ${getRandomPath()} HTTP/1.1" 429 ${getRandomResponseSize()} "-" "${getRandomUserAgent()}" DDoS Attack Detected: Excessive requests`,

  command_injection: () =>
    `${getRandomIp()} - - [${getFormattedDate()}] "GET /ping?ip=;rm -rf / HTTP/1.1" 500 ${getRandomResponseSize()} "-" "${getRandomUserAgent()}" Command Injection Attempt Detected`,
};

export default function LogGenerator() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      generateLog();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const generateLog = async (anomaly = null) => {
    const log = anomaly ? anomaly() : logTypes.normal();
    setLogs((prevLogs) => [log, ...prevLogs.slice(0, 19)]);

    try {
      // Send log to the backend via POST request
      await axios.post("http://localhost:5000/send-log", { log });
    } catch (error) {
      console.error("Error sending log to backend:", error);
    }
  };

  return (
    <div className="log-container">
      <h1>Log Anomaly Simulator</h1>
      <div className="button-container">
        {Object.keys(anomalyLogTypes).map((type) => (
          <button key={type} onClick={() => generateLog(anomalyLogTypes[type])}>
            Trigger {type.replace("_", " ")} anomaly
          </button>
        ))}
      </div>
      <div className="log-box">
        {logs.map((log, index) => (
          <p key={index} className="log-entry">
            {log}
          </p>
        ))}
      </div>
    </div>
  );
}
