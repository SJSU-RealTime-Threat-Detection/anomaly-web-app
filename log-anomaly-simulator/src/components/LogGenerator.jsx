import { useState, useEffect } from "react";

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

const logTypes = {
  sql_injection: () =>
    `${getRandomIp()} - - [${new Date().toISOString()}] "GET /search?q=' OR '1'='1' HTTP/1.1" 500 - SQL Injection Attack Detected`,
  xss: () =>
    `${getRandomIp()} - - [${new Date().toISOString()}] "GET /profile?name=<script>alert('XSS')</script> HTTP/1.1" 403 - Cross-Site Scripting (XSS) Attack Detected`,
  csrf: () =>
    `${getRandomIp()} - - [${new Date().toISOString()}] "POST /transfer HTTP/1.1" 401 - Cross-Site Request Forgery (CSRF) Attempt Detected`,
  ddos: () =>
    `${getRandomIp()} - - [${new Date().toISOString()}] "GET /${getRandomPath()} HTTP/1.1" 429 - DDoS Attack Detected: Excessive requests`,
  command_injection: () =>
    `${getRandomIp()} - - [${new Date().toISOString()}] "GET /ping?ip=;rm -rf / HTTP/1.1" 500 - Command Injection Attempt Detected`,
};

const normalLogs = [
  () =>
    `${getRandomIp()} - - [${new Date().toISOString()}] "GET ${getRandomPath()} HTTP/1.1" 200 - Normal Log User-Agent: ${getRandomUserAgent()}`,
  () =>
    `${getRandomIp()} - - [${new Date().toISOString()}] "POST /login HTTP/1.1" 200 - User login successful User-Agent: ${getRandomUserAgent()}`,
  () =>
    `${getRandomIp()} - - [${new Date().toISOString()}] "GET /dashboard HTTP/1.1" 200 - Dashboard accessed User-Agent: ${getRandomUserAgent()}`,
  () =>
    `${getRandomIp()} - - [${new Date().toISOString()}] "POST /api/data HTTP/1.1" 201 - Data successfully submitted User-Agent: ${getRandomUserAgent()}`,
];

export default function LogGenerator() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      generateLog();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const generateLog = (anomaly = null) => {
    const log = anomaly
      ? anomaly()
      : normalLogs[Math.floor(Math.random() * normalLogs.length)]();
    setLogs((prevLogs) => [log, ...prevLogs.slice(0, 19)]);
  };

  return (
    <div className="log-container">
      <h1>Log Anomaly Simulator</h1>
      <div className="button-container">
        {Object.keys(logTypes).map((type) => (
          <button key={type} onClick={() => generateLog(logTypes[type])}>
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
