// WelcomePage.js
import React, { useEffect, useState } from 'react';
import '../component/WelcomePage.css';

const WelcomePage = ({ onLoadingComplete }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      onLoadingComplete();
    }, 3000); // Adjust the time as needed
  }, []);

  return (
    <div className={`welcome-page ${loading ? 'loading' : ''}`}>
      <div className="animation-text">
        <span>S</span>
        <span>t</span>
        <span>y</span>
        <span>l</span>
        <span>e</span>
        <span>&nbsp;</span>
        <span>R</span>
        <span>e</span>
        <span>p</span>
        <span>l</span>
        <span>i</span>
        <span>c</span>
        <span>a</span>
        <span>t</span>
        <span>i</span>
        <span>o</span>
        <span>n</span>
      </div>
    </div>
  );
};

export default WelcomePage;
