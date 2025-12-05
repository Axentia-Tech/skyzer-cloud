import type { NextPage } from 'next';
import { Layout } from '../components/Layout';

const PrivacyPolicy: NextPage = () => {
  return (
    <Layout>
      <div className="bg-dark py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-5xl font-black text-white mb-4">Privacy Policy</h1>
            <p className="text-gray-400">Last updated: December 2024</p>
          </div>

          {/* Content */}
          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We collect information necessary to provide our services:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li><span className="font-bold">Account Information:</span> Name, email, phone number, address</li>
                <li><span className="font-bold">Payment Information:</span> Billing address, payment method (processed securely)</li>
                <li><span className="font-bold">Server Data:</span> Configuration, logs, usage statistics</li>
                <li><span className="font-bold">Technical Data:</span> IP address, browser type, access logs</li>
                <li><span className="font-bold">Communication:</span> Support tickets, emails, Discord messages</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Data</h2>
              <p className="text-gray-300 leading-relaxed">
                Your information is used to:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process payments and billing</li>
                <li>Respond to support requests</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Improve our services and products</li>
                <li>Send important notifications about your account</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Data Protection & Security</h2>
              <div className="bg-card border border-gray-700 p-6 rounded-lg space-y-4">
                <p className="text-gray-300">
                  We implement industry-standard security measures to protect your data:
                </p>
                <ul className="list-disc pl-6 text-gray-300 space-y-2">
                  <li>SSL/TLS encryption for all connections</li>
                  <li>Encrypted storage of sensitive data</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Two-factor authentication (2FA) support</li>
                  <li>Access controls and employee training</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We do not sell, rent, or trade your personal information. We may share data with:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li><span className="font-bold">Service Providers:</span> Payment processors, hosting providers (under NDA)</li>
                <li><span className="font-bold">Legal Requirements:</span> Law enforcement or court orders</li>
                <li><span className="font-bold">Safety:</span> To prevent fraud, abuse, or illegal activity</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Access your personal data</li>
                <li>Correct or update your information</li>
                <li>Delete your account and associated data (30-day period)</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability (receive a copy of your data)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Cookies & Tracking</h2>
              <p className="text-gray-300 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience. You can manage cookie preferences in your browser settings. We use:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mt-3">
                <li><span className="font-bold">Essential:</span> Authentication, security, functionality</li>
                <li><span className="font-bold">Analytics:</span> Usage patterns to improve services</li>
                <li><span className="font-bold">Marketing:</span> (only with your consent)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. International Data Transfer</h2>
              <p className="text-gray-300 leading-relaxed">
                Your data may be processed and stored in countries other than where you reside. By using our services, you consent to such transfers. We ensure appropriate safeguards are in place.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our services are not intended for children under 13. We do not knowingly collect data from children. If we discover such data, we will delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Policy Changes</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this policy. Changes will be posted with the updated date. Continued use of our services constitutes acceptance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
              <div className="bg-card border border-gray-700 p-6 rounded-lg">
                <p className="text-gray-300 mb-4">
                  For privacy questions or data requests, contact us:
                </p>
                <p className="text-gray-300">
                  <span className="font-bold text-white">Email:</span> privacy@skyzer.cloud
                </p>
                <p className="text-gray-300">
                  <span className="font-bold text-white">Support Ticket:</span> Open a ticket in our billing panel
                </p>
              </div>
            </section>
          </div>

          {/* Footer CTA */}
          <div className="mt-16 bg-primary/10 border border-primary rounded-lg p-8 text-center">
            <p className="text-gray-300 mb-4">Questions about your privacy?</p>
            <button className="btn btn-primary">Contact Privacy Team</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
