'use client';

import React from 'react';
import Image from 'next/image';

const Logo = () => {
  return (
    <div className="relative flex w-[100px] h-[40px]  rounded-lg border border-gold-700 overflow-hidden ">
      <Image
        src="/2logo.jpg"
        alt="TheNews Logo"
        fill
        className=" object-cover absolute"
      />
    </div>
  );
};

export default Logo;
