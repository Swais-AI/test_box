'use client';
import { useState, useEffect } from 'react';

export default function StandardHeader() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; 
      const hh = String(hours).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      
      setTime(`${dd}-${mm}-${yyyy} | ${hh}:${mins} ${ampm}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-white text-[#0f2851] py-4 px-8 flex justify-between items-center shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="flex items-center font-bold text-lg tracking-wide">
        <span className="font-extrabold mr-2">SWAIS</span>
        <span className="text-gray-300 mx-2">|</span>
        <span>Saraf Worldsphere AI Services</span>
      </div>
      
      <div className="font-semibold tracking-wide text-[#0f2851]">
        {time}
      </div>
    </header>
  );
}
