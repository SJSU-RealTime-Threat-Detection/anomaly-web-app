# Log Anomaly Simulator

A web application for simulating and visualizing log entries, including normal and anomalous (attack) logs, built with React and Vite.

## Features

- **Real-time Log Generation:** Automatically generates synthetic log entries at regular intervals.
- **Anomaly Injection:** Trigger specific log anomalies (SQL Injection, XSS, Command Injection) with dedicated buttons.
- **Color-coded Logs:** Anomalous logs are visually distinguished for easy identification.
- **Backend Integration:** Sends generated logs to a backend server via HTTP POST requests.
- **Responsive UI:** Clean, modern interface styled with CSS.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/log-anomaly-simulator.git
   cd log-anomaly-simulator
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

### Running the Application

#### Start the development server

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to view the app.

#### Build for production

```sh
npm run build
```

#### Preview the production build

```sh
npm run preview
```

### Linting

```sh
npm run lint
```

## Usage

- The app will automatically generate normal log entries every 2 seconds.
- Use the **Pause Generation** button to stop/resume automatic log generation.
- Use the anomaly buttons to inject specific attack logs (SQL Injection, XSS, Command Injection).
- All logs are sent to a backend endpoint at `http://localhost:5000/send-log` (ensure your backend is running and listening on this endpoint).

## Project Structure

```
.
├── public/
│   └── vite.svg
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   ├── assets/
│   │   └── react.svg
│   └── components/
│       ├── LogGenerator.jsx
│       └── LogGenerator.css
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

- Main logic for log generation: `src/components/LogGenerator.jsx`
- Styling: `src/App.css`, `src/index.css`, `src/components/LogGenerator.css`
- Entry point: `src/main.jsx`

## Backend Endpoint

The frontend expects a backend server running at `http://localhost:5000/send-log` that accepts POST requests with the following payload:

```json
{
  "log": "your log entry here"
}
```

You need to implement this backend separately (e.g., with Node.js/Express, Python/Flask, etc.).

## Dependencies

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Axios](https://axios-http.com/)
- [kafkajs](https://kafka.js.org/) (listed, but not used in frontend code)
