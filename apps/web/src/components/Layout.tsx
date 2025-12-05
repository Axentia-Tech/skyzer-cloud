import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0a0a0a' }}>
      <Header />
      <main style={{ flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '20px', paddingTop: '100px', position: 'relative', zIndex: 10 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
