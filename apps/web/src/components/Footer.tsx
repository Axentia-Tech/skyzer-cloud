import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="footer transition-smooth">
      <div className="container" style={{ paddingBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          <div>
            <h3 style={{ color: '#fff', fontWeight: 800, marginBottom: '12px', fontSize: '1.15rem' }}>⚡ Skyzer Cloud</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '16px', lineHeight: 1.6 }}>Next-gen Minecraft hosting. Enterprise quality. Affordable pricing.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://discord.gg/Xrf8ErxF5q" style={{ display: 'inline-block', fontSize: '1.4rem' }}>💬</a>
              <a href="https://www.youtube.com/@Skyzer.CloudYT" style={{ display: 'inline-block', fontSize: '1.4rem' }}>▶️</a>
            </div>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '12px', fontSize: '0.95rem' }}>Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}><Link href="/pricing" style={{ color: '#888' }}>Minecraft Hosting</Link></li>
              <li style={{ marginBottom: '8px' }}><Link href="/bot-hosting" style={{ color: '#888' }}>Bot Hosting</Link></li>
              <li><a href="https://status.skyzer.cloud" style={{ color: '#888' }}>Status Page</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '12px', fontSize: '0.95rem' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}><a href="mailto:leon@skyzer.cloud" style={{ color: '#888' }}>Email</a></li>
              <li style={{ marginBottom: '8px' }}><a href="https://docs.skyzer.cloud" style={{ color: '#888' }}>Knowledge Base</a></li>
              <li><a href="#" style={{ color: '#888' }}>Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '12px', fontSize: '0.95rem' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '8px' }}><Link href="/terms" style={{ color: '#888' }}>Terms of Service</Link></li>
              <li style={{ marginBottom: '8px' }}><Link href="/refund" style={{ color: '#888' }}>Refund Policy</Link></li>
              <li><Link href="/privacy" style={{ color: '#888' }}>Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #1f1f1f', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#666' }}>
          <p>© 2025 Skyzer Cloud. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: '#666' }}>Status</a>
            <a href="#" style={{ color: '#666' }}>Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
