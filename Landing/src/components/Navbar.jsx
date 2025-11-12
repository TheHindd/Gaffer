import React from "react";

const Navbar = () =>  {
  return (
    <div className="flex justify-around items-center m-7" role="banner">
        
          <div className="flex">
            <img src="/whiteLogo.png" alt="Gaffer Logo" className="w-30" />
          </div>

          <div className="flex gap-6 justify-center text-sm font-semibold " role="menubar" aria-label="Primary">
            <a role="menuitem" href="#home">Home</a>
            <a role="menuitem" href="#about">About Us</a>
            <a role="menuitem" href="#work">Our Work</a>
            <a role="menuitem" href="#services">Our Services</a>
          </div>
          

          {/* Right: language toggle */}
          <div className="flex" >
            <button
              type="button"
              className="lang-toggle"
              aria-label="Switch language to Arabic"
            >
              العربية
            </button>
          </div>
    
    </div>
  );
}

export default Navbar