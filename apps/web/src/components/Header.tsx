import React from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  return (
    <header className="header transition-smooth">
      <div className="header-inner">
        <Link href="/" className="logo">⚡ Skyzer Cloud</Link>
        <nav className="nav">
          <Link href="/pricing" style={{ color: 'inherit', fontSize: '0.95rem', fontWeight: 600 }}>Minecraft</Link>
          <Link href="/bot-hosting" style={{ color: 'inherit', fontSize: '0.95rem', fontWeight: 600 }}>Bot Hosting</Link>
          <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>Login</button>
        </nav>
      </div>
    </header>
  );
};
