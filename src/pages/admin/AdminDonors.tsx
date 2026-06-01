import { useState } from 'react';
import { Users, Heart } from 'lucide-react';
import { AdminDonorsList } from './AdminDonorsList';
import { AdminDonorRecognition } from './AdminDonorRecognition';

type Tab = 'donors' | 'recognition';

export function AdminDonors() {
  const [tab, setTab] = useState<Tab>('donors');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Donors</h1>
        <p className="text-slate-500 mt-1">
          Manage registered donors and sponsor recognition
        </p>
      </div>

      <div className="border-b border-slate-200">
        <nav className="flex gap-1" aria-label="Donor tabs">
          <TabButton
            active={tab === 'donors'}
            onClick={() => setTab('donors')}
            icon={Users}
            label="Active Donors"
          />
          <TabButton
            active={tab === 'recognition'}
            onClick={() => setTab('recognition')}
            icon={Heart}
            label="Recognition"
          />
        </nav>
      </div>

      {tab === 'donors' ? <AdminDonorsList /> : <AdminDonorRecognition />}
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

function TabButton({ active, onClick, icon: Icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
        active
          ? 'border-blue-600 text-blue-600 bg-blue-50/50'
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
