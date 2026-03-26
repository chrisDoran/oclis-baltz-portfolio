import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app"; // lowercase to match the file name
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);