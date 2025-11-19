import React from "react";
import Navbar from "./components/NavBar";
import Hero from "./Pages/Hero";
import "./index.css";
import Hook from "./components/Hook";
import Stats from "./components/Stats";
import ServicesHome from "./components/ServicesHome";

function App() {
  return (
    <div className="page relative overflow-hidden">
      <div className="w-full h-full">
        <main className="">
          <Hero>
                <Navbar />
          </Hero>
          <Hook/>
          <Stats />
          <ServicesHome/>
        </main>
      </div>
    </div>
  );
}

export default App;