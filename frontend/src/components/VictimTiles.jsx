import { useState, useEffect, useRef } from 'react';
import './VictimTiles.css';

const VictimTiles = ({ fromCount, toCount }) => {
  const [tiles, setTiles] = useState([]);
  const [showTiles, setShowTiles] = useState([]);
  const containerRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const fromStr = String(fromCount).padStart(4, '0');
    const initialTiles = fromStr.split('').map((digit, index) => ({
      id: index,
      digit,
      show: false
    }));
    setTiles(initialTiles);
    setShowTiles(new Array(4).fill(false));

    // Stagger reveal
    initialTiles.forEach((_, index) => {
      setTimeout(() => {
        setShowTiles(prev => {
          const next = [...prev];
          next[index] = true;
          return next;
        });
      }, 80 * index + 60);
    });
  }, [fromCount]);

  useEffect(() => {
    if (toCount === undefined || animatedRef.current) return;
    
    const fromStr = String(fromCount).padStart(4, '0');
    const toStr = String(toCount).padStart(4, '0');
    
    let baseDelay = 1200;
    if (window.innerWidth <= 760) {
      baseDelay += 500;
    }
    const perDigitStagger = 90;
    
    const timer = setTimeout(() => {
      animateCountChange(fromStr, toStr);
      animatedRef.current = true;
    }, baseDelay + fromStr.length * perDigitStagger);
    
    return () => clearTimeout(timer);
  }, [toCount, fromCount]);

  const animateCountChange = (fromStr, toStr) => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < toStr.length; i++) {
      const fromDigit = fromStr[i];
      const toDigit = toStr[i];
      if (fromDigit === toDigit) continue;

      const tile = container.children[i];
      if (!tile) continue;

      const topEl = tile.querySelector('.top');
      const bottomEl = tile.querySelector('.bottom');

      const delay = Math.max(0, (toStr.length - 1 - i)) * 150;

      setTimeout(() => {
        // Create animating flaps
        const flipTop = document.createElement('div');
        flipTop.className = 'flip-top';
        flipTop.setAttribute('data-val', fromDigit);

        const flipBottom = document.createElement('div');
        flipBottom.className = 'flip-bottom';
        flipBottom.setAttribute('data-val', toDigit);

        tile.appendChild(flipTop);
        tile.appendChild(flipBottom);

        topEl.setAttribute('data-val', toDigit);

        requestAnimationFrame(() => {
          flipTop.classList.add('animate');
        });

        setTimeout(() => {
          flipBottom.classList.add('animate');

          setTimeout(() => {
            bottomEl.setAttribute('data-val', toDigit);
            flipTop.remove();
            flipBottom.remove();
            
            // Update React state
            setTiles(prev => prev.map((t, idx) => 
              idx === i ? { ...t, digit: toDigit } : t
            ));
          }, 250);
        }, 250);
      }, delay);
    }
  };

  return (
    <div className="tiles" id="victimTiles" ref={containerRef} aria-hidden="false">
      {tiles.map((tile, index) => (
        <div 
          key={tile.id} 
          className={`tile ${showTiles[index] ? 'show' : ''}`}
        >
          <div className="top" data-val={tile.digit}></div>
          <div className="bottom" data-val={tile.digit}></div>
        </div>
      ))}
    </div>
  );
};

export default VictimTiles;
