import React from "react";
import Navbar from "./components/NavBar";
import Hero from "./sections/Hero";
import "./index.css";

function App() {
  return (
    <div className="page relative overflow-hidden">
      {/* Decorative background layers */}
      <div className="bg bg-1" />
      <div className="bg bg-2" />
      <div className="bg bg-3" />
      <div className="noise" />

      <div className="w-full h-full">
        <Navbar />

        {/* Hero Section */}
        <main className="hero relative">
          <Hero />
        </main>
      </div>
    </div>
  );
}

export default App;