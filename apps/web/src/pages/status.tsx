import type { NextPage } from 'next';
import { Layout } from '../components/Layout';

const Status: NextPage = () => {
  const locations = [
    { name: 'New York', region: 'NA', status: 'operational', uptime: 99.99, flag: '🇺🇸' },
    { name: 'Miami', region: 'NA', status: 'operational', uptime: 99.98, flag: '🇺🇸' },
    { name: 'Frankfurt', region: 'EU', status: 'operational', uptime: 100, flag: '🇩🇪' },
    { name: 'Singapore', region: 'AS', status: 'operational', uptime: 99.99, flag: '🇸🇬' },
    { name: 'Sydney', region: 'AU', status: 'operational', uptime: 99.95, flag: '🇦🇺' },
  ];

  const incidents = [
    {
      date: '2024-12-03',
      location: 'Singapore',
      duration: '2 hours',
      status: 'resolved',
      description: 'Network maintenance - All services restored',
    },
    {
      date: '2024-11-28',
      location: 'All Locations',
      duration: '15 minutes',
      status: 'resolved',
      description: 'DDoS attack mitigated - No user impact',
    },
  ];

  return (
    <Layout>
      <div className="bg-dark py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <h1 className="text-5xl font-black text-white mb-4">Server Status</h1>
            <p className="text-gray-400">Real-time status and incident history for Skyzer Cloud</p>
          </div>

          {/* Overall Status */}
          <div className="bg-gradient-to-r from-green-600/20 to-green-900/20 border border-green-600 rounded-lg p-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <h2 className="text-2xl font-black text-white">All Systems Operational</h2>
                <p className="text-gray-300">All services are running normally</p>
              </div>
            </div>
          </div>

          {/* Locations Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-black text-white mb-8">Server Locations</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {locations.map((loc) => (
                <div key={loc.name} className="bg-card border border-gray-700 p-6 rounded-lg hover:border-primary transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{loc.flag}</span>
                      <div>
                        <h3 className="font-bold text-white">{loc.name}</h3>
                        <p className="text-sm text-gray-400">{loc.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-bold text-green-400">Operational</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Uptime (30d):</span>
                      <span className="font-bold text-white">{loc.uptime}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${loc.uptime}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Incident History */}
          <div>
            <h2 className="text-3xl font-black text-white mb-8">Incident History</h2>
            <div className="space-y-4">
              {incidents.map((incident, i) => (
                <div key={i} className="bg-card border border-gray-700 p-6 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-white">{incident.location}</p>
                      <p className="text-sm text-gray-400">{incident.date}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs font-bold rounded">
                      {incident.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-2">{incident.description}</p>
                  <p className="text-sm text-gray-500">Duration: {incident.duration}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 bg-primary/10 border border-primary rounded-lg p-8 text-center">
            <p className="text-gray-300 mb-4">Issues or questions about our services?</p>
            <button className="btn btn-primary">Report Issue</button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Status;
