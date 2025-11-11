import React from 'react';
import './AnimatedCirclesBackground.css';

const AnimatedCirclesBackground = ({ children }) => {
  return (
    <div className="circles-container">
      <div className="circle-small"></div>
      <div className="circle-medium"></div>
      <div className="circle-large"></div>
      <div className="circle-xlarge"></div>
      <div className="circle-xxlarge"></div>
      {children}
    </div>
  );
};

export default AnimatedCirclesBackground;
