'use client';

import React from 'react';
import Image from 'next/image';

const Logo = () => {
  return (
    <div className="relative flex w-[150px] h-[40px]">
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
