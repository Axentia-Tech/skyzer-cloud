import type { NextPage } from 'next';
import Link from 'next/link';
import { Layout } from '../components/Layout';

const Pricing: NextPage = () => {
  const products = [
    { name: 'Chicken', ram: '3GB', storage: '5 GB', cpu: '200%', price: 'Free', color: '#888888' },
    { name: 'Zombie', ram: '2GB', storage: '5 GB', cpu: '200%', price: '€1.99', color: '#4a9eff' },
    { name: 'Skelleton', ram: '3GB', storage: '10 GB', cpu: '200%', price: '€2.99', color: '#7c3aed' },
    { name: 'Creeper', ram: '4GB', storage: '15 GB', cpu: '250%', price: '€3.99', color: '#10b981', popular: true },
    { name: 'Slime', ram: '6GB', storage: '20 GB', cpu: '300%', price: '€5.99', color: '#f59e0b' },
    { name: 'Villager', ram: '8GB', storage: '25 GB', cpu: '400%', price: '€7.99', color: '#ec4899' },
    { name: 'Ghast', ram: '10GB', storage: '30 GB', cpu: '500%', price: '€9.99', color: '#14b8a6' },
    { name: 'Blaze', ram: '12GB', storage: '40 GB', cpu: '600%', price: '€11.99', color: '#f97316' },
    { name: 'Enderman', ram: '16GB', storage: '50 GB', cpu: '800%', price: '€15.99', color: '#6366f1' },
  ];

  return (
    <Layout>
      <div style={{ margin: 0, padding: 0 }}>
        {/* Hero Section */}
        <section style={{
          backgroundImage: `linear-gradient(135deg, rgba(255, 45, 45, 0.1) 0%, rgba(20, 20, 20, 0.9) 100%), url('https://images.unsplash.com/photo-1633356713697-e53cc1dc6ba1?w=1600&h=900&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          padding: '100px 20px',
          textAlign: 'center',
          position: 'relative',
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            color: '#ffffff',
            marginBottom: '15px',
            textShadow: '0 4px 20px rgba(0,0,0,0.7)',
          }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{
            fontSize: '1.3rem',
            color: '#d0d0d0',
            marginBottom: '10px',
          }}>
            Choose the perfect plan for your Minecraft server
          </p>
          <p style={{
            fontSize: '1.1rem',
            color: '#ff2d2d',
            fontWeight: 700,
            marginBottom: '30px',
          }}>
            🎁 Free Tier • No Credit Card Required • Money-back Guarantee
          </p>
        </section>

        {/* Pricing Cards Grid */}
        <section style={{
          backgroundColor: '#0a0a0a',
          padding: '80px 20px',
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '25px',
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
              {products.map((product, i) => (
                <div key={i} style={{
                  position: 'relative',
                  padding: '30px',
                  backgroundColor: '#151515',
                  border: product.popular ? '2px solid #ff2d2d' : '1px solid #2a2a2a',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  transform: product.popular ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: product.popular ? '0 20px 60px rgba(255, 45, 45, 0.2)' : 'none',
                  minWidth: '300px',
                  flex: '1 1 300px',
                  maxWidth: '350px',
                }} onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  if (!product.popular) {
                    el.style.borderColor = '#ff2d2d';
                    el.style.transform = 'translateY(-8px)';
                  }
                }} onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  if (!product.popular) {
                    el.style.borderColor = '#2a2a2a';
                    el.style.transform = 'translateY(0)';
                  }
                }}>
                  {product.popular && (
                    <div style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#ff2d2d',
                      color: '#ffffff',
                      padding: '6px 16px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      Most Popular
                    </div>
                  )}
                  
                  <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <img 
                      src={`/assets/product_pictures/${product.name.toLowerCase()}.jpg`}
                      alt={product.name}
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        border: `3px solid ${product.color}`,
                        marginBottom: '15px',
                      }}
                    />
                    <h3 style={{
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      marginBottom: '15px',
                    }}>
                      {product.name}
                    </h3>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                      marginBottom: '20px',
                    }}>
                      <div style={{
                        padding: '15px',
                        backgroundColor: `${product.color}20`,
                        border: `2px solid ${product.color}`,
                        borderRadius: '8px',
                        textAlign: 'center',
                      }}>
                        <div style={{
                          fontSize: '1.8rem',
                          fontWeight: 900,
                          color: product.color,
                        }}>
                          {product.ram}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#888888', marginTop: '3px' }}>RAM</div>
                      </div>
                      
                      <div style={{
                        padding: '15px',
                        backgroundColor: `${product.color}20`,
                        border: `2px solid ${product.color}`,
                        borderRadius: '8px',
                        textAlign: 'center',
                      }}>
                        <div style={{
                          fontSize: '1.8rem',
                          fontWeight: 900,
                          color: product.color,
                        }}>
                          {product.cpu}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#888888', marginTop: '3px' }}>CPU</div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    marginBottom: '25px',
                    paddingBottom: '25px',
                    borderBottom: '1px solid #2a2a2a',
                  }}>
                    <div style={{
                      fontSize: '2.5rem',
                      fontWeight: 900,
                      color: '#ffffff',
                      marginBottom: '5px',
                    }}>
                      {product.price}
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#888888' }}>
                      {product.price === 'Free' ? 'per month' : 'per month'}
                    </div>
                  </div>

                  <button style={{
                    width: '100%',
                    padding: '14px 20px',
                    backgroundColor: product.popular ? '#ff2d2d' : '#2a2a2a',
                    color: product.popular ? '#ffffff' : '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: '15px',
                  }} onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    if (product.popular) {
                      el.style.backgroundColor = '#ff1a1a';
                      el.style.transform = 'scale(1.02)';
                    } else {
                      el.style.backgroundColor = '#3a3a3a';
                    }
                  }} onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.backgroundColor = product.popular ? '#ff2d2d' : '#2a2a2a';
                    el.style.transform = 'scale(1)';
                  }}>
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section style={{
          backgroundColor: '#0a0a0a',
          padding: '80px 20px',
          borderTop: '1px solid #2a2a2a',
        }}>
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: '60px',
            }}>
              Included in All Plans
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '30px',
            }}>
              {[
                { icon: '✓', title: 'Free Tier', desc: 'Try before you buy' },
                { icon: '✓', title: '24/7 Support', desc: 'Always here to help' },
                { icon: '✓', title: 'Money-Back Guarantee', desc: '100% satisfaction' },
                { icon: '✓', title: 'DDoS Protection', desc: 'Enterprise security' },
                { icon: '✓', title: 'One-Click Installer', desc: 'Plugins & mods' },
                { icon: '✓', title: 'Easy Control Panel', desc: 'Manage everything' },
              ].map((feature, i) => (
                <div key={i} style={{
                  padding: '25px',
                  backgroundColor: '#151515',
                  borderRadius: '8px',
                  border: '1px solid #2a2a2a',
                  textAlign: 'center',
                }}>
                  <div style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: '#ff2d2d',
                    marginBottom: '10px',
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '5px',
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#888888',
                  }}>
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section style={{
          backgroundColor: '#0a0a0a',
          padding: '80px 20px',
          borderTop: '1px solid #2a2a2a',
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#ffffff',
              textAlign: 'center',
              marginBottom: '60px',
            }}>
              Frequently Asked Questions
            </h2>

            <div style={{
              display: 'grid',
              gap: '20px',
            }}>
              {[
                { q: 'Can I upgrade or downgrade my plan?', a: 'Yes, you can change your plan at any time without penalties.' },
                { q: 'Do you offer refunds?', a: 'Yes, full refund within 24 hours. After that, refunds are case-by-case.' },
                { q: 'Is there a setup fee?', a: 'No, setup is completely free and takes only 67 seconds.' },
                { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and more.' },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: '20px',
                  backgroundColor: '#151515',
                  borderRadius: '8px',
                  border: '1px solid #2a2a2a',
                }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    marginBottom: '10px',
                  }}>
                    {item.q}
                  </h3>
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#888888',
                  }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{
          backgroundImage: 'linear-gradient(135deg, #ff2d2d 0%, #ff4444 100%)',
          padding: '80px 20px',
          textAlign: 'center',
        }}>
          <div style={{
            maxWidth: '700px',
            margin: '0 auto',
          }}>
            <h2 style={{
              fontSize: '2.8rem',
              fontWeight: 900,
              color: '#ffffff',
              marginBottom: '20px',
            }}>
              Ready to Level Up?
            </h2>
            <p style={{
              fontSize: '1.1rem',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '30px',
            }}>
              Start your free tier today - no credit card required
            </p>
            <button style={{
              backgroundColor: '#ffffff',
              color: '#ff2d2d',
              border: 'none',
              padding: '16px 44px',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }} onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'scale(1.05)';
            }} onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.transform = 'scale(1)';
            }}>
              Get Started Free
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Pricing;
