import React from 'react';

export const BackgroundOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Background base radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(30,35,50,0.35)_0%,rgba(5,5,8,1)_85%)]" />

      {/* Floating 3D Glossy Orbs */}
      {/* Top Left Large Orb */}
      <div className="orb orb-glossy orb-tl animate-float-slow" />
      
      {/* Top Right Orb */}
      <div className="orb orb-glossy orb-tr animate-float-medium" />

      {/* Center Right Massive Orb */}
      <div className="orb orb-glossy orb-mr animate-float-slow" />

      {/* Bottom Center-Left Orb */}
      <div className="orb orb-glossy orb-bl animate-float-fast" />

      {/* Bottom Center Orb */}
      <div className="orb orb-glossy orb-bc animate-float-medium" />

      {/* Mid Left Small Orb */}
      <div className="orb orb-glossy orb-ml animate-float-slow" />
    </div>
  );
};
