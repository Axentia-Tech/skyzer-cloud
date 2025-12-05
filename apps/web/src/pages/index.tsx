import type { NextPage } from 'next';
import Link from 'next/link';
import { Layout } from '../components/Layout';

const Home: NextPage = () => {
  return (
    <Layout>
      <div>
        {/* Hero Section */}
        <section
          className="site-hero"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(255, 45, 45, 0.1) 0%, rgba(10, 10, 10, 0.8) 100%), url('https://images.unsplash.com/photo-1633356713697-e53cc1dc6ba1?w=1600&h=900&fit=crop')`,
          }}
        >
          <div className="hero-inner">
            <h1 className="h1 large">Next-Gen Minecraft Server Hosting</h1>
            <p className="lead">Fast • Reliable • Affordable</p>
            <p className="muted" style={{ fontSize: '1.1rem', marginBottom: '30px' }}>Enterprise-grade infrastructure with zero complexity. Start your free server in 67 seconds.</p>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
              <Link href="/pricing"><button className="btn btn-primary">Get Started Free</button></Link>
              <button className="btn" style={{ backgroundColor: 'transparent', border: '2px solid #fff', color: '#fff' }}>Learn More</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px', marginTop: '60px' }}>
              <div style={{ padding: '20px', backgroundColor: 'rgba(255, 45, 45, 0.15)', borderRadius: '8px', border: '1px solid rgba(255, 45, 45, 0.3)' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ff2d2d', marginBottom: '5px' }}>99.99%</div>
                <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Uptime SLA</div>
              </div>
              <div style={{ padding: '20px', backgroundColor: 'rgba(255, 45, 45, 0.15)', borderRadius: '8px', border: '1px solid rgba(255, 45, 45, 0.3)' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ff2d2d', marginBottom: '5px' }}>24/7</div>
                <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Support</div>
              </div>
              <div style={{ padding: '20px', backgroundColor: 'rgba(255, 45, 45, 0.15)', borderRadius: '8px', border: '1px solid rgba(255, 45, 45, 0.3)' }}>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ff2d2d', marginBottom: '5px' }}>67s</div>
                <div style={{ fontSize: '0.9rem', color: '#aaa' }}>Setup Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ backgroundColor: '#0a0a0a', padding: '80px 20px', borderTop: '1px solid #1f1f1f' }}>
          <div className="container">
            <h2 className="h1" style={{ textAlign: 'center', marginBottom: '15px' }}>Why Choose Skyzer Cloud?</h2>
            <p className="muted" style={{ textAlign: 'center', marginBottom: '60px', fontSize: '1.1rem' }}>Everything you need for a professional Minecraft server</p>

            <div className="cards">
              {[
                { icon: '🔌', title: 'Plugin Installer', desc: 'One-click installation, auto-updates, and compatibility checks' },
                { icon: '🧩', title: 'Mods Support', desc: 'Forge & Fabric support with automatic conflict detection' },
                { icon: '🌐', title: 'Free Subdomains', desc: 'Custom DNS, free subdomain per server, SSL included' },
                { icon: '🎮', title: 'Game Control Panel', desc: 'Powerful interface to manage everything in one place' },
                { icon: '🔄', title: 'Version Changer', desc: 'Java & Bedrock support with safe version rollbacks' },
                { icon: '🛡️', title: 'DDoS Protection', desc: 'Enterprise security with 24/7 monitoring, no extra fees' },
              ].map((f, i) => (
                <div key={i} className="card transition-smooth" style={{ cursor: 'pointer' }} onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = '#ff2d2d';
                  el.style.transform = 'translateY(-8px)';
                }} onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = '#1f1f1f';
                  el.style.transform = 'translateY(0)';
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{f.icon}</div>
                  <h3 className="title" style={{ marginBottom: '10px' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ backgroundImage: 'linear-gradient(135deg, #ff2d2d 0%, #ff4444 100%)', padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 className="h1" style={{ color: '#fff', marginBottom: '20px' }}>Start Your Minecraft Server Now</h2>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.95)', marginBottom: '30px' }}>Free 48-hour trial • No credit card required • Money-back guarantee</p>
            
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
              <Link href="/pricing"><button className="btn" style={{ backgroundColor: '#fff', color: '#ff2d2d', fontWeight: 800 }}>Get Started Free</button></Link>
              <button className="btn" style={{ backgroundColor: 'transparent', color: '#fff', border: '2px solid #fff', fontWeight: 800 }}>View All Plans</button>
            </div>
            
            <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 600 }}>✓ Satisfaction Guaranteed • ✓ 24/7 Support • ✓ Free Trial</p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
