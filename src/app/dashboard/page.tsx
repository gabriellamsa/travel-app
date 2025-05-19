"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [userName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {};

    checkAuth();
  }, []);

  return (
    <div className="dashboardContainer">
      <header className="dashboardHeader">
        <h1>Welcome to Your Personal Area</h1>
        <div className="userInfo">
          <span>Hello, {userName || "User"}</span>
        </div>
      </header>

      <main>
        <section className="dashboardSection">
          <h2>Your Trips</h2>
          <div className="tripsGrid">
            <div className="tripCard">
              <h3>My Trips</h3>
              <p>No trips found</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
