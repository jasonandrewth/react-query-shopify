import React from "react";

//Components
import Marquee from "react-fast-marquee";
import { Patreon, Instagram } from "components/Icons";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 z-50 w-screen bg-black text-white grid grid-cols-[auto_auto]">
      <div className="flex border-r border-r-white p-4">
        <button className="hover:opacity-80 mr-2">
          <a
            href="https://www.patreon.com/ben_ditto"
            target="_blank"
            rel="noreferrer"
          >
            <Patreon className="h-5 w-6" />
          </a>
        </button>
        <button className="hover:opacity-80 mr-2">
          <img className="max-h-6" src="/instagram.svg" alt="Instagram Logo" />
        </button>
        <button className="hover:opacity-80">
          <img className="max-h-6" src="/discord.svg" alt="Discord Logo" />
        </button>
      </div>

      <Marquee
        pauseOnHover
        gradient={false}
        className="p-4 uppercase font-bold"
      >
        DOOM SCROLL - Doom scroll - Doom scroll - Doom scroll - Doom scroll -
        Doom scroll - DOOM SCROLL - Doom scroll - Doom scroll - Doom scroll -
        Doom scroll - Doom scroll - DOOM SCROLL - Doom scroll - Doom scroll -
        Doom scroll - Doom scroll - Doom scroll - DOOM SCROLL - Doom scroll -
        Doom scroll - Doom scroll - Doom scroll - Doom scroll -
      </Marquee>
    </footer>
  );
};

export default Footer;
