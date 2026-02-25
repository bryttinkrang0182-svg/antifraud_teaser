import { useState, useEffect, useCallback } from 'react';
import { getVictimCount } from '../services/api';
import Navigation from '../components/Navigation';
import VictimTiles from '../components/VictimTiles';
import Loader from '../components/Loader';
import NoticeOverlay from '../components/NoticeOverlay';
import './VictimCountPage.css';

const VictimCountPage = () => {
  const [loading, setLoading] = useState(true);
  const [victimCount, setVictimCount] = useState(0);
  const [pushed, setPushed] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const data = await getVictimCount();
        if (data && data.success) {
          const cnt = Number(data.count) || 0;
          setVictimCount(cnt);
        }
      } catch (err) {
        console.error('Failed to fetch count', err);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchCount();
  }, []);

  const handleNoticeStart = useCallback(() => {
    setPushed(true);
  }, []);

  const startCount = victimCount > 0 ? victimCount - 1 : 0;

  return (
    <>
      <section id="page2" className="page active">
        <Navigation />

        <img src="/images/ECOBANK_WRONG_LOGO.png" alt="Logo" className="page-logo" />
        
        <div className={`side-wrap ${pushed ? 'pushed' : ''}`}>
          <img src="/images/benz.png" alt="Car" className="side-image left" />
          <img src="/images/wagadri_man.png" alt="Man" className="side-image right" />
        </div>

        <div className={`count-wrap ${pushed ? 'pushed' : ''}`}>
          <p style={{ fontWeight: 700, fontSize: 'clamp(3.5rem, 15vw, 12rem)' }} id="victimTitle">
            Welcome
          </p>
          <p style={{ fontWeight: 500, fontSize: 'clamp(1.5rem, 5vw, 3rem)' }} id="victimSub">
            Victim No.
          </p>
          <p id="victimName" className="victim-name"></p>

          {!loading && (
            <VictimTiles fromCount={startCount} toCount={victimCount} />
          )}

          <div className="count-actions"></div>
        </div>
      </section>

      <Loader show={loading} text="Loading…" />
      
      {!loading && <NoticeOverlay onStart={handleNoticeStart} />}
    </>
  );
};

export default VictimCountPage;
