import React from "react";

const Navbar = () =>  {
  return (
    <div className="container" >
        <header>
            <img src="/whiteLogo.png" alt="Gaffer Logo" className="w-30" />

          <nav className="flex gap-6 justify-center text-sm font-semibold " role="menubar" aria-label="Primary">
            <a href="#home">Home</a>
            <a  href="#about">About Us</a>
            <a  href="#work">Our Work</a>
            <a role="menuitem" href="#services">Our Services</a>
          </nav>
          
            <button className="nav-button"
              type="nav-button"
              aria-label="Switch language to Arabic"
            >
              العربية
            </button>
    
        </header>
    </div>
  );
}

export default Navbar