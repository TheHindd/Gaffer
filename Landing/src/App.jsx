import React from "react";
import Navbar from "./components/NavBar";
import Hero from "./sections/Hero";
import "./index.css";
import Hook from "./components/Hook";
import Stats from "./components/Stats";

function App() {
  return (
    <div className="page relative overflow-hidden">
      <div className="w-full h-full">
        <Navbar />

        {/* Hero Section */}
        <main className="hero relative">
          <Hero />
          <Hook/>
          <Stats />
        </main>
      </div>
    </div>
  );
}

export default App;