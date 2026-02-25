import './Loader.css';

const Loader = ({ show, text = 'Processing...' }) => {
  return (
    <div 
      id="loaderOverlay" 
      className={`loader-overlay ${show ? 'show' : ''}`} 
      aria-hidden={!show}
    >
      <div className="loader-inner">
        <svg className="loader-svg" viewBox="0 0 50 50" width="64" height="64" aria-hidden="true">
          <circle className="loader-ring" cx="25" cy="25" r="20" fill="none" strokeWidth="4"></circle>
        </svg>
        <div className="loader-text">{text}</div>
      </div>
    </div>
  );
};

export default Loader;
