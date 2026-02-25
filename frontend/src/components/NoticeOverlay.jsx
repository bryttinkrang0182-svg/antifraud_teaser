import { useState, useEffect } from 'react';
import './NoticeOverlay.css';

const NoticeOverlay = ({ onStart }) => {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);

  const DELAY = 5000;
  const PUSH_DURATION = 720;
  const T_FIRST = 6000;
  const T_FEELING = 2200;

  useEffect(() => {
    const timer = setTimeout(() => {
      onStart?.();
      
      setTimeout(() => {
        setShow(true);
        setPhase(1);
      }, PUSH_DURATION);
    }, DELAY);

    return () => clearTimeout(timer);
  }, [onStart]);

  useEffect(() => {
    if (phase === 1) {
      const timer = setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          setExiting(false);
          setPhase(2);
        }, 600);
      }, T_FIRST);
      return () => clearTimeout(timer);
    }
    
    if (phase === 2) {
      const timer = setTimeout(() => {
        setExiting(true);
        setTimeout(() => {
          setExiting(false);
          setPhase(3);
        }, 1000);
      }, T_FEELING);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const renderContent = () => {
    if (phase === 1) {
      return (
        <div className={exiting ? 'exit-right' : ''}>
          <div style={{ fontWeight: 700, fontSize: 'clamp(3rem, 10vw, 9rem)' }} className="notice-title notice-strong">
            <span className="word-fade" style={{ animationDelay: '500ms' }}>Did</span>{' '}
            <span className="word-fade" style={{ animationDelay: '750ms' }}>you</span>{' '}
            <span className="word-fade" style={{ animationDelay: '1000ms' }}>notice?</span>
          </div>
          <ul style={{ fontSize: 'clamp(1.5rem, 5vw, 4rem)', fontWeight: 500 }} className="notice-list">
            <li className="type-writer" style={{ animationDelay: '1600ms' }}>Fake website address</li>
            <li className="type-writer" style={{ animationDelay: '2600ms' }}>Fake Brand Colour</li>
            <li className="type-writer" style={{ animationDelay: '3600ms' }}>Fake Logo</li>
          </ul>
        </div>
      );
    }

    if (phase === 2) {
      return (
        <div style={{ fontWeight: 700, fontSize: 'clamp(2.5rem, 8vw, 7.5rem)' }} className={`notice-ephemeral notice-strong type-writer ${exiting ? 'exit-right' : ''}`}>
          <span style={{ display: 'inline-block' }}>Feeling</span>&nbsp;
          <span style={{ display: 'inline-block' }}>is</span>&nbsp;
          <span style={{ display: 'inline-block' }}>believing</span>
        </div>
      );
    }

    if (phase === 3) {
      return (
        <>
          <div style={{ fontWeight: 700, fontSize: 'clamp(2.5rem, 8vw, 8rem)' }} className="notice-title notice-strong slide-up">
            <span className="shake-emphasis">Like play like play</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 'clamp(1.3rem, 3.5vw, 3.5rem)', animationDelay: '200ms' }} className="slide-up">
            You could have just been scammed
          </div>
          <p style={{ marginTop: 'clamp(40px, 15vh, 120px)', fontSize: 'clamp(1.5rem, 4vw, 4rem)', animationDelay: '1000ms' }} className="notice-final slide-up">
            Not all advert/request are legit
          </p>
          <p style={{ marginTop: 10, fontSize: 'clamp(1.5rem, 4vw, 4rem)', animationDelay: '1200ms' }} className="slide-up">
            Pay extra attention to details
          </p>
        </>
      );
    }

    return null;
  };

  return (
    <div 
      id="noticeOverlay" 
      className={`notice-overlay ${show ? 'show' : ''}`} 
      role="dialog" 
      aria-hidden={!show}
    >
      <div id="noticeMsg" className="notice-msg" aria-hidden={!show}>
        {renderContent()}
      </div>
    </div>
  );
};

export default NoticeOverlay;
