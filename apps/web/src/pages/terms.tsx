import type { NextPage } from 'next';
import Link from 'next/link';
import { Layout } from '../components/Layout';

const TermsOfService: NextPage = () => {
  return (
    <Layout>
      <div style={{ paddingTop: '80px' }}>
        {/* Hero */}
        <section style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)', padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>Terms of Service</h1>
            <p style={{ fontSize: '18px', color: '#aaa' }}>Please read our Terms of Service carefully</p>
          </div>
        </section>

        {/* Content */}
        <section style={{ padding: '60px 20px', background: '#0a0a0a' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', color: '#ccc' }}>
            <div style={{ lineHeight: '1.8' }}>
              {/* Section 1 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>⚒️ Resource Usage</h2>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇩🇪 Ressourcennutzung</h3>
                  <p style={{ marginBottom: '12px' }}>
                    Jegliche Art von CPU-Mining (z. B. Kryptowährungen oder Mining-Scripts) ist strengstens untersagt. Solche Aktivitäten führen zu einer sofortigen Sperrung deines Accounts und aller zugehörigen Server.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇺🇸 Resource Usage</h3>
                  <p>
                    Any form of CPU or cryptocurrency mining is strictly prohibited. Violations will result in immediate suspension of your account and all associated servers.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>🐞 Exploits & Vulnerabilities</h2>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇩🇪 Ausnutzung von Schwachstellen</h3>
                  <p style={{ marginBottom: '12px' }}>
                    Das absichtliche Ausnutzen von Bugs, Sicherheitslücken oder Serverfehlern ist verboten. Bitte melde gefundene Fehler verantwortungsvoll an das Support-Team.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇺🇸 Exploits & Vulnerabilities</h3>
                  <p>
                    Deliberately exploiting bugs, security flaws, or server errors is prohibited. Please report any discovered vulnerabilities responsibly to our support team.
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>⚖️ Legal Use Only</h2>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇩🇪 Nur legale Nutzung</h3>
                  <p style={{ marginBottom: '12px' }}>
                    Unsere Services dürfen nur für legale Zwecke genutzt werden. Das Hosten von illegalen Inhalten, Botnetzen oder anderen illegalen Aktivitäten ist strengstens verboten.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇺🇸 Legal Use Only</h3>
                  <p>
                    Our services may only be used for legal purposes. Hosting illegal content, botnets, or engaging in any illegal activities is strictly prohibited.
                  </p>
                </div>
              </div>

              {/* Section 4 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>💳 Premium vs. Free</h2>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇩🇪 Premium vs. Kostenlos</h3>
                  <p style={{ marginBottom: '12px' }}>
                    Kostenlose Accounts können jederzeit ohne Vorankündigung gelöscht werden. Premium-Accounts genießen Schutz vor willkürlichen Löschungen gemäß unserer Richtlinien.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇺🇸 Premium vs. Free</h3>
                  <p>
                    Free accounts may be deleted at any time without notice. Premium accounts are protected from arbitrary deletion in accordance with our policies.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>🔐 Multi-Accounting</h2>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇩🇪 Multi-Accounting</h3>
                  <p style={{ marginBottom: '12px' }}>
                    Das Erstellen mehrerer Accounts zur Umgehung von Limits oder Beschränkungen ist untersagt. Bei Verdacht werden alle betroffenen Accounts gelöscht.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇺🇸 Multi-Accounting</h3>
                  <p>
                    Creating multiple accounts to circumvent limitations or restrictions is prohibited. Suspected accounts will be terminated.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>📊 Data Responsibility</h2>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇩🇪 Datenverwaltung</h3>
                  <p style={{ marginBottom: '12px' }}>
                    Du bist allein verantwortlich für die Sicherheit und das Backup deiner Daten. Wir haften nicht für Datenverluste aufgrund von Account-Kompromittierung oder fahrlässiger Nutzung.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇺🇸 Data Responsibility</h3>
                  <p>
                    You are solely responsible for the security and backup of your data. We are not liable for data loss due to account compromise or negligent use.
                  </p>
                </div>
              </div>

              {/* Section 7 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>📋 General Clause</h2>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇩🇪 Allgemeine Klausel</h3>
                  <p style={{ marginBottom: '12px' }}>
                    Diese Bedingungen können jederzeit ohne Vorankündigung geändert werden. Durch die fortgesetzte Nutzung stimmst du den aktualisierten Bedingungen zu.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇺🇸 General Clause</h3>
                  <p>
                    These terms may change at any time without notice. Continued use constitutes acceptance of updated terms.
                  </p>
                </div>
              </div>

              {/* Section 8 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>✅ Acceptance</h2>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇩🇪 Zustimmung</h3>
                  <p style={{ marginBottom: '12px' }}>
                    Durch die Registrierung und Nutzung unserer Services akzeptierst du diese Bedingungen vollständig.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇺🇸 Acceptance</h3>
                  <p>
                    By registering and using our services, you fully accept these terms and conditions.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #1f1f1f', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link href="/refund">
                  <button style={{ padding: '14px 36px', background: '#ff2d2d', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>Refund Policy</button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default TermsOfService;
