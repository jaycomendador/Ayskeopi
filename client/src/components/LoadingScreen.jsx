import { useEffect, useState } from 'react'

export default function LoadingScreen({ onDone }) {
  const [phase, setPhase] = useState('enter')

  useEffect(() => {
    const holdTimer = setTimeout(() => setPhase('exit'), 2000)
    return () => clearTimeout(holdTimer)
  }, [])

  useEffect(() => {
    if (phase === 'exit') {
      const doneTimer = setTimeout(() => onDone?.(), 700)
      return () => clearTimeout(doneTimer)
    }
  }, [phase, onDone])

  return (
    <>
      <style>{`
        @keyframes ayskeopi-fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ayskeopi-pulse-ring {
          0%   { transform: scale(0.92); opacity: 0.6; }
          50%  { transform: scale(1.08); opacity: 0.15; }
          100% { transform: scale(0.92); opacity: 0.6; }
        }
        @keyframes ayskeopi-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .agy-loading-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: #0d0c0b;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 28px;
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .agy-loading-root.exit {
          opacity: 0;
          transform: scale(1.04);
          pointer-events: none;
        }
        .agy-logo-wrap {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: ayskeopi-fade-in 0.6s ease both;
        }
        .agy-pulse-ring {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          border: 2px solid rgba(201,168,76,0.35);
          animation: ayskeopi-pulse-ring 2.2s ease-in-out infinite;
        }
        .agy-spinner {
          position: absolute;
          inset: -18px;
          border-radius: 50%;
          border: 1.5px solid transparent;
          border-top-color: #c9a84c;
          border-right-color: rgba(201,168,76,0.3);
          animation: ayskeopi-spin-slow 1.4s linear infinite;
        }
        .agy-logo-img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(201,168,76,0.25);
          box-shadow: 0 0 32px rgba(201,168,76,0.18);
        }
        .agy-brand-text {
          text-align: center;
          animation: ayskeopi-fade-in 0.7s 0.25s ease both;
        }
        .agy-brand-name {
          font-family: 'Inter', sans-serif;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 0.2em;
          color: #e8e2d8;
          margin: 0 0 4px;
        }
        .agy-brand-sub {
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #c9a84c;
          margin: 0;
        }
      `}</style>

      <div className={`agy-loading-root${phase === 'exit' ? ' exit' : ''}`}>
        <div className="agy-logo-wrap">
          <div className="agy-pulse-ring" />
          <div className="agy-spinner" />
          <img src="/logo.png" alt="Ayskeopi Logo" className="agy-logo-img" />
        </div>

        <div className="agy-brand-text">
          <p className="agy-brand-name">AYSKEOPI</p>
          <p className="agy-brand-sub">Iced Coffee &amp; Cold Brew</p>
        </div>
      </div>
    </>
  )
}
