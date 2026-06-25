'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { Hand, HandGrab } from 'lucide-react';

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // User requested "normal speed like native mouse", so we remove the spring delay
  // and bind directly to the raw X/Y coordinates for zero lag.

  useEffect(() => {
    // Check if the device has a touch screen (mobile)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
      return; // Do not initialize custom cursor on mobile to prevent lag/choppiness
    }

    // Hide default cursor on body
    document.documentElement.style.cursor = 'none';

    const moveMouse = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.documentElement.style.cursor = 'auto';
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  // Hide the element on small screens completely via Tailwind as a fallback


  return (
    <motion.div
      className="fixed top-0 left-0 z-[999999] pointer-events-none select-none hidden md:flex items-center justify-center"
      style={{
        x: cursorX,
        y: cursorY,
        opacity: isVisible ? 1 : 0,
        translateX: '-40%', // Center horizontally a bit
        translateY: '-20%', // Shift to make the pointing tip accurate
      }}
      animate={{
        scale: isClicked ? 0.8 : 1,
        rotate: isClicked ? -15 : 0,
      }}
      transition={{ type: 'spring', stiffness: 600, damping: 25 }}
    >
      <div className="relative">
        {isClicked ? (
          <HandGrab className="w-8 h-8 text-slate-900 fill-white drop-shadow-md transition-all duration-200" />
        ) : (
          <Hand className="w-8 h-8 text-slate-900 fill-white drop-shadow-md transition-all duration-200" />
        )}
      </div>
    </motion.div>
  );
}
