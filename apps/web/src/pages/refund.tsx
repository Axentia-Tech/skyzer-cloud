import type { NextPage } from 'next';
import Link from 'next/link';
import { Layout } from '../components/Layout';

const RefundPolicy: NextPage = () => {
  return (
    <Layout>
      <div style={{ paddingTop: '80px' }}>
        {/* Hero */}
        <section style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)', padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>Refund Policy</h1>
            <p style={{ fontSize: '18px', color: '#aaa' }}>Learn about our refund terms and conditions</p>
          </div>
        </section>

        {/* Content */}
        <section style={{ padding: '60px 20px', background: '#0a0a0a' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', color: '#ccc' }}>
            <div style={{ lineHeight: '1.8' }}>
              {/* Section 1 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>🕒 24-Hour Money-Back Guarantee</h2>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇩🇪 24-Stunden-Geld-zurück-Garantie</h3>
                  <p style={{ marginBottom: '12px' }}>
                    Du hast das Recht auf eine vollständige Rückerstattung innerhalb von 24 Stunden nach dem Kauf. Diese Garantie gilt nur, wenn kein Verstoß gegen unsere Terms of Service vorliegt.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇺🇸 24-Hour Money-Back Guarantee</h3>
                  <p>
                    You are entitled to a full refund within 24 hours of purchase. This guarantee only applies if no violation of our Terms of Service has occurred.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>⚠️ Exceptions & Violations</h2>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇩🇪 Ausnahmen & Verstöße</h3>
                  <p style={{ marginBottom: '12px' }}>
                    Wenn du gegen unsere TOS verstößt, erlischt dein Recht auf eine Rückerstattung – auch innerhalb der 24-Stunden-Frist. Dies gilt insbesondere bei Missbrauch, illegalen Aktivitäten oder Server-Manipulationen.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇺🇸 Exceptions & Violations</h3>
                  <p>
                    If you violate our TOS, you forfeit your right to a refund – even within the 24-hour period. This applies especially to abuse, illegal activities, or server manipulation.
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>🧾 Refunds After 24 Hours</h2>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇩🇪 Rückerstattungen nach 24 Stunden</h3>
                  <p style={{ marginBottom: '12px' }}>
                    Nach Ablauf der 24 Stunden sind Rückerstattungen grundsätzlich ausgeschlossen, außer in nachweisbaren Sonderfällen wie:
                  </p>
                  <ul style={{ marginLeft: '24px', marginBottom: '12px' }}>
                    <li>Hohe oder anhaltende Server-Downtime</li>
                    <li>Datenverlust, verursacht durch Fehler auf unserer Seite</li>
                  </ul>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇺🇸 Refunds After 24 Hours</h3>
                  <p style={{ marginBottom: '12px' }}>
                    After 24 hours, refunds are generally not provided, except in proven special cases such as:
                  </p>
                  <ul style={{ marginLeft: '24px' }}>
                    <li>Severe or extended server downtime</li>
                    <li>Data loss caused by our system or staff error</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>🚫 No Refund for Change of Mind</h2>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇩🇪 Kein Refund bei Meinungsänderung</h3>
                  <p style={{ marginBottom: '12px' }}>
                    „Ich will den Server nicht mehr" ist kein gültiger Rückerstattungsgrund. Rückerstattungen werden nicht gewährt, wenn du einfach entscheidest, den Service nicht weiter nutzen zu wollen.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇺🇸 No Refund for Change of Mind</h3>
                  <p>
                    "I no longer want the server" is not a valid refund reason. Refunds will not be issued if you simply decide to no longer use the service.
                  </p>
                </div>
              </div>

              {/* Section 5 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>📧 How to Request a Refund</h2>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇩🇪 Rückerstattung anfordern</h3>
                  <p style={{ marginBottom: '12px' }}>
                    Um eine Rückerstattung anzufordern, kontaktiere unser Support-Team innerhalb von 24 Stunden nach dem Kauf via Discord oder Ticket-System. Stelle klare Gründe dar und antworte auf Rückfragen promptly.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇺🇸 How to Request a Refund</h3>
                  <p>
                    To request a refund, contact our support team within 24 hours of purchase via Discord or ticket system. Provide clear reasons and respond promptly to any follow-up questions.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '20px' }}>✅ Acceptance</h2>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇩🇪 Zustimmung</h3>
                  <p style={{ marginBottom: '12px' }}>
                    Durch den Kauf akzeptierst du diese Refund Policy vollständig.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#ff2d2d', marginBottom: '12px' }}>🇺🇸 Acceptance</h3>
                  <p>
                    By making a purchase, you fully accept this Refund Policy.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid #1f1f1f', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Link href="/terms">
                  <button style={{ padding: '14px 36px', background: '#ff2d2d', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>Terms of Service</button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default RefundPolicy;
