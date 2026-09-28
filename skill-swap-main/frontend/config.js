// ============================================================
// FRONTEND BACKEND API CONFIGURATION
// ============================================================
// The backend always runs on port 5000 during local development.
// Using window.location.hostname means the same frontend works on:
//   http://localhost:8000
//   http://127.0.0.1:8000
//   http://192.168.x.x:8000
// without changing the IP address in every fetch() call.
//
// For production, replace this with your deployed backend URL.
//
// The backend serves BOTH the API (/api/...) and these frontend pages on the
// same origin, so we simply reuse the page's own origin. This makes the app
// port-agnostic — run the server on any PORT (e.g. 5001 if macOS AirPlay is
// holding 5000) and the frontend, API, Socket.IO and WebRTC all follow.
// ============================================================
const API_BASE_URL = window.location.origin;
