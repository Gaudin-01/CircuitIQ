import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// This is the standard way to render your app
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// import "./index.css";
// import { createRoot } from "react-dom/client";
// import App from "./App.tsx";

// createRoot(document.getElementById("root")!).render(<App />);

// await window.Clerk.session.getToken({ template: "convex" });
// Run this again after refreshing
// window.Clerk.session.getToken({ template: "convex" }).then(console.log);

// This checks what Convex sees as your identity
// console.log(await window.Clerk.session.getToken({ template: "convex" }));





// "eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDIyMkFBQSIsImtpZCI6Imluc18zQ0EwQ2FzQUFTYm1QUkh0QVMxc3poeFBCUkEiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJjb252ZXgiLCJhenAiOiJodHRwOi8vbG9jYWxob3N0OjUxNzMiLCJlbWFpbCI6ImVtbXlyYXBoOEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZXhwIjoxNzc2MDQyMjQ5LCJmYW1pbHlfbmFtZSI6IkNodWt3dWRpIiwiZ2l2ZW5fbmFtZSI6IkVtbWFudWVsIiwiaWF0IjoxNzc2MDM4NjQ5LCJpc3MiOiJodHRwczovL3N0cm9uZy1oYWRkb2NrLTU2LmNsZXJrLmFjY291bnRzLmRldiIsImp0aSI6ImQ2YTAzY2MxY2E4OWU0ZmJmNGIzIiwibmFtZSI6IkVtbWFudWVsIENodWt3dWRpIiwibmJmIjoxNzc2MDM4NjQ0LCJuaWNrbmFtZSI6bnVsbCwicGhvbmVfbnVtYmVyIjpudWxsLCJwaG9uZV9udW1iZXJfdmVyaWZpZWQiOmZhbHNlLCJwaWN0dXJlIjoiaHR0cHM6Ly9pbWcuY2xlcmsuY29tL2V5SjBlWEJsSWpvaWNISnZlSGtpTENKemNtTWlPaUpvZEhSd2N6b3ZMMmx0WVdkbGN5NWpiR1Z5YXk1a1pYWXZiMkYxZEdoZloyOXZaMnhsTDJsdFoxOHpRMEZZTTFsdWEycHVXRWhHY0hGeFRYbFJXR1U0T0dka1ZVUWlmUSIsInN1YiI6InVzZXJfM0NBWDNYaUxtVWh1TEozS0cyazZLcVo5ZFdNIiwidXBkYXRlZF9hdCI6MTc3NjAzNjExOX0.I2hoq6ZzuaXBZXiBcSuhrvU1z-ru2Awy61C8o561dSiesReaIbs1B_HPpI7I87whAiF_zZhscCeRzMssBZQ8zwH_2pu4_bO9VDxSJ3IQHd1o686JpiG490BJaU9E_lVu5NfRlxx_FWSLWZWhd6DVTEf0JznKDgIYM09bmJ5c3c5psho5oPHBWb-EgeT87Nykfb0SS0Smiz0Fm3OVW-yimGYD05Zc_pzJx4zRACFUyQh9o4WahXQ5JKUup7GahiLZZ36pVrwKrsx4aK_1DHb69aB-w05ZCzw3F3UY2i3xEJkhZHvAV9KZK2OpRrIzMZ7Ie3DTRlIOzawtaSZXqQPDWA";