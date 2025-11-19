// src/components/Navbar.jsx
import React, { useState } from "react";

const Navbar = ({ onToggleLang }) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((v) => !v);
  const handleLang = () => {
    if (onToggleLang) onToggleLang();
  };

  return (
    <header className="w-full z-50 bg-transparent">
      <div className="container flex items-center justify-between py-4">
        {/* Brand */}
        <a href="/" className="flex items-center gap-3">
          <img src="/whiteLogo.png" alt="Gaffer Logo" className="w-15 md:w-25" />
        </a>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-8"
          role="navigation"
          aria-label="Primary"
        >
          <a href="#home" className="text-sm font-bold uppercase hover:text-[#F0706C]">
            Home
          </a>
          <a href="#about" className="text-sm font-semibold uppercase hover:text-[#F0706C]">
            About Us
          </a>
          <a href="#work" className="text-sm font-semibold uppercase hover:text-[#F0706C]">
            Our Work
          </a>
          <a href="#services" className="text-sm font-semibold uppercase hover:text-[#F0706C]">
            Our Services
          </a>
        </nav>

        {/* Right side: language + mobile toggle */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Switch language"
            onClick={handleLang}
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            {/* small globe icon (SVG) - simplified and sized for web */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-5 h-5 text-gray-700"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M256 48C141.13 48 48 141.13 48 256s93.13 208 208 208 208-93.13 208-208S370.87 48 256 48zM96 256c0-32.72 7.14-63.6 19.83-91.02C158.1 197.7 190.9 224 232 224v64c-41.1 0-73.9 26.3-116.17 59.02C103.14 319.6 96 288.72 96 256zm160 208c-40.7 0-76.68-14.66-104.67-38.99C196.63 390.38 230 352 256 352s59.37 38.38 104.67 73.01C332.68 449.34 296.7 464 256 464z"
              />
            </svg>
            <span className="text-sm text-white font-semibold">AR</span>
          </button>

          {/* mobile menu button */}
          <button
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={handleToggle}
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              {open ? (
                <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="md:hidden bg-white shadow-sm">
          <div className="px-6 py-4 flex flex-col gap-3">
            <a href="#home" className="text-base font-medium">Home</a>
            <a href="#about" className="text-base font-medium">About Us</a>
            <a href="#work" className="text-base font-medium">Our Work</a>
            <a href="#services" className="text-base font-medium">Our Services</a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
