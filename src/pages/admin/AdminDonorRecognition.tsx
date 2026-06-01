import { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  EyeOff,
  Eye,
  Heart,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

interface DonorSponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface DonorSponsorInsert {
  name: string;
  logo_url: string | null;
  website_url: string | null;
  tier: string;
  is_active: boolean;
  sort_order: number;
}

const TIER_OPTIONS = [
  { value: 'gold', label: 'Gold' },
  { value: 'silver', label: 'Silver' },
  { value: 'bronze', label: 'Bronze' },
  { value: 'supporter', label: 'Supporter' },
];

const TIER_COLORS: Record<string, string> = {
  gold: 'bg-amber-100 text-amber-700',
  silver: 'bg-slate-200 text-slate-600',
  bronze: 'bg-orange-100 text-orange-700',
  supporter: 'bg-blue-100 text-blue-700',
};

const emptyForm: DonorSponsorInsert = {
  name: '',
  logo_url: null,
  website_url: null,
  tier: 'supporter',
  is_active: true,
  sort_order: 0,
};

export function AdminDonorRecognition() {
  const [items, setItems] = useState<DonorSponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DonorSponsorInsert>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [tierFilter, setTierFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('donor_sponsors')
      .select('*')
      .order('sort_order', { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setItems((data || []) as DonorSponsor[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filtered = items.filter((item) => {
    if (tierFilter !== 'all' && item.tier !== tierFilter) return false;
    return true;
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sort_order: items.length + 1 });
    setShowModal(true);
  };

  const openEdit = (item: DonorSponsor) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      logo_url: item.logo_url,
      website_url: item.website_url,
      tier: item.tier,
      is_active: item.is_active,
      sort_order: item.sort_order,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    setError(null);

    if (editingId) {
      const { error: updateError } = await supabase
        .from('donor_sponsors')
        .update(form)
        .eq('id', editingId);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from('donor_sponsors')
        .insert(form);
      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setShowModal(false);
    await loadItems();
  };

  const handleDelete = async (id: string) => {
    setError(null);
    const { error: deleteError } = await supabase.from('donor_sponsors').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
    } else {
      setItems((prev) => prev.filter((d) => d.id !== id));
    }
    setDeleteConfirm(null);
  };

  const toggleActive = async (item: DonorSponsor) => {
    setError(null);
    const newValue = !item.is_active;
    const { error: toggleError } = await supabase
      .from('donor_sponsors')
      .update({ is_active: newValue })
      .eq('id', item.id);
    if (toggleError) {
      setError(toggleError.message);
    } else {
      setItems((prev) =>
        prev.map((d) => (d.id === item.id ? { ...d, is_active: newValue } : d))
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Something went wrong</p>
            <p className="text-sm text-red-600 mt-0.5">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="p-1 rounded hover:bg-red-100 transition-colors">
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Donor Recognition</h2>
          <p className="text-slate-500 mt-1 text-sm">
            {items.length} organization{items.length !== 1 ? 's' : ''} featured on site
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadItems}
            className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4 text-slate-500" />
          </button>
          <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Sponsor
          </Button>
        </div>
      </div>

      {items.length > 0 && (
        <Card>
          <div className="flex flex-wrap gap-3 items-center">
            <Heart className="w-4 h-4 text-slate-400" />
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Tiers</option>
              {TIER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </Card>
      )}

      <Card>
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">
              {items.length === 0 ? 'No sponsors added yet' : 'No sponsors match your filter'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-4 px-2">
                <div className="w-14 h-14 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.logo_url ? (
                    <img
                      src={item.logo_url}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain p-1"
                    />
                  ) : (
                    <Heart className="w-5 h-5 text-slate-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    {!item.is_active && (
                      <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-500 rounded-full">Hidden</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TIER_COLORS[item.tier] || TIER_COLORS.supporter}`}>
                      {TIER_OPTIONS.find((t) => t.value === item.tier)?.label || item.tier}
                    </span>
                    {item.website_url && (
                      <a
                        href={item.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Website
                      </a>
                    )}
                    <span className="text-xs text-slate-400">Order: {item.sort_order}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(item)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    title={item.is_active ? 'Hide' : 'Show'}
                  >
                    {item.is_active ? (
                      <Eye className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-slate-500" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(item.id)}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Remove Sponsor</h3>
            <p className="text-slate-600 text-sm mb-6">
              Are you sure? This will permanently remove this sponsor from the recognition section.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(deleteConfirm)}>Remove</Button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <DonorFormModal
          form={form}
          setForm={setForm}
          editing={!!editingId}
          saving={saving}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

interface FormModalProps {
  form: DonorSponsorInsert;
  setForm: React.Dispatch<React.SetStateAction<DonorSponsorInsert>>;
  editing: boolean;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}

function DonorFormModal({ form, setForm, editing, saving, onSave, onClose }: FormModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-slate-900">
            {editing ? 'Edit Sponsor' : 'Add Sponsor'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <Input
            label="Organization / Sponsor Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Recognition Tier</label>
            <select
              value={form.tier}
              onChange={(e) => setForm((prev) => ({ ...prev, tier: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {TIER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <Input
            label="Logo URL"
            value={form.logo_url || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, logo_url: e.target.value || null }))}
            placeholder="https://example.com/logo.png"
          />

          {form.logo_url && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-center">
              <img
                src={form.logo_url}
                alt="Logo preview"
                className="max-h-16 w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          )}

          <Input
            label="Website URL"
            value={form.website_url || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, website_url: e.target.value || null }))}
            placeholder="https://example.com"
          />

          <Input
            label="Sort Order"
            type="number"
            value={String(form.sort_order)}
            onChange={(e) => setForm((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Active (visible on site)</span>
          </label>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              onClick={onSave}
              disabled={saving || !form.name.trim()}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? 'Save Changes' : 'Add Sponsor'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
