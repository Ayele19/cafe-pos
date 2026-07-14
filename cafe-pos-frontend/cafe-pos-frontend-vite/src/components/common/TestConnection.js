import React, { useEffect, useState } from "react";
import axios from "axios";

function TestConnection() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    axios.get("/api/menu")
      .then(res => {
        console.log(res.data);
        setStatus("✅ Connected to backend. Menu loaded.");
      })
      .catch(err => {
        console.error(err);
        setStatus("❌ Not connected to backend.");
      });
  }, []);

  return (
    <div style={{ padding: "20px", fontSize: "18px" }}>
      {status}
    </div>
  );
}

export default TestConnection;
