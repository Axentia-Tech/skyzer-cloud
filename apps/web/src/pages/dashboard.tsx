import type { NextPage } from 'next';
import { Layout } from '../components/Layout';

const Dashboard: NextPage = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>

        {/* User Account Card */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-4">Account Info</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="font-semibold">user@example.com</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p className="font-semibold text-green-500">Active</p>
            </div>
          </div>
        </div>

        {/* Servers Overview */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-6">Your Servers</h2>
          <div className="text-center py-12 text-gray-400">
            <p>No servers yet. Create your first server to get started!</p>
            <button className="btn btn-primary mt-4">Create Server</button>
          </div>
        </div>

        {/* Billing Section */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold mb-6">Billing</h2>
          <div className="text-center py-12 text-gray-400">
            <p>View your invoices and subscription details</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
