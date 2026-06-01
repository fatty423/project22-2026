import { useState } from 'react';
import { User, Mail, Phone, Save, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PatchBadge } from '../patches/PatchBadge';
import { supabase, Database } from '../../lib/supabase';

type Donor = Database['public']['Tables']['donors']['Row'];

interface DonorRankResult {
  series: 'watchman' | 'covenant' | 'vanguard';
  rank: string;
  label: string;
  earned: boolean;
}

interface PortalProfileProps {
  donor: Donor;
  onUpdate: (updated: Donor) => void;
  donorRank: DonorRankResult | null;
}

export function PortalProfile({ donor, onUpdate, donorRank }: PortalProfileProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState(donor.full_name);
  const [phone, setPhone] = useState(donor.phone || '');

  const handleSave = async () => {
    setSaving(true);
    const { data, error } = await supabase
      .from('donors')
      .update({ full_name: fullName, phone: phone || null })
      .eq('id', donor.id)
      .select()
      .maybeSingle();

    setSaving(false);
    if (!error && data) {
      onUpdate(data as Donor);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleCancel = () => {
    setFullName(donor.full_name);
    setPhone(donor.phone || '');
    setEditing(false);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {donorRank ? (
            <PatchBadge series={donorRank.series} rank={donorRank.rank} size={48} />
          ) : (
            <div className="w-12 h-12 rounded-full bg-brand-marine/10 flex items-center justify-center">
              <User className="w-6 h-6 text-brand-marine" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-slate-900">Account Details</h3>
            <p className="text-sm text-slate-500">
              {donorRank ? `${donorRank.label} - Watchman Series` : 'Manage your personal information'}
            </p>
          </div>
        </div>
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
            <Check className="w-4 h-4" />
            Saved
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Full Name</label>
          {editing ? (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-marine focus:border-transparent"
              />
            </div>
          ) : (
            <p className="text-sm font-medium text-slate-900 py-2.5">{donor.full_name}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Email</label>
          <div className="flex items-center gap-2 py-2.5">
            <Mail className="w-4 h-4 text-slate-400" />
            <p className="text-sm text-slate-900">{donor.email}</p>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Cannot be changed</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Phone</label>
          {editing ? (
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-marine focus:border-transparent"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 py-2.5">
              <Phone className="w-4 h-4 text-slate-400" />
              <p className="text-sm text-slate-900">{donor.phone || 'Not provided'}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wide">Member Since</label>
          <p className="text-sm text-slate-900 py-2.5">
            {new Date(donor.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {editing && (
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} loading={saving} size="sm" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
