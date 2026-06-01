import { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Star,
  EyeOff,
  Eye,
  Quote,
  Filter,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import type { Database } from '../../lib/supabase';

type Testimonial = Database['public']['Tables']['testimonials']['Row'];
type TestimonialInsert = Database['public']['Tables']['testimonials']['Insert'];

const PAGE_OPTIONS = [
  { value: 'home', label: 'Home Page' },
  { value: 'impact', label: 'Impact Page' },
];

const TYPE_OPTIONS = [
  { value: 'testimonial', label: 'Testimonial' },
  { value: 'success_story', label: 'Success Story' },
];

const emptyForm: TestimonialInsert = {
  name: '',
  military_branch: '',
  role: null,
  quote: '',
  rating: 5,
  photo_url: null,
  outcome: null,
  story: null,
  video_placeholder_url: null,
  impact: null,
  page: 'home',
  type: 'testimonial',
  is_active: true,
  sort_order: 0,
};

export function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TestimonialInsert>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [pageFilter, setPageFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const loadItems = useCallback(async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('page', { ascending: true })
      .order('type', { ascending: true })
      .order('sort_order', { ascending: true });

    if (!error && data) setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filtered = items.filter((item) => {
    if (pageFilter !== 'all' && item.page !== pageFilter) return false;
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    return true;
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sort_order: items.length + 1 });
    setShowModal(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      military_branch: item.military_branch,
      role: item.role,
      quote: item.quote,
      rating: item.rating,
      photo_url: item.photo_url,
      outcome: item.outcome,
      story: item.story,
      video_placeholder_url: item.video_placeholder_url,
      impact: item.impact,
      page: item.page,
      type: item.type,
      is_active: item.is_active,
      sort_order: item.sort_order,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);

    if (editingId) {
      const { error } = await supabase
        .from('testimonials')
        .update(form)
        .eq('id', editingId);
      if (!error) {
        setItems((prev) =>
          prev.map((t) => (t.id === editingId ? { ...t, ...form } : t))
        );
      }
    } else {
      const { data, error } = await supabase
        .from('testimonials')
        .insert(form)
        .select()
        .maybeSingle();
      if (!error && data) {
        setItems((prev) => [...prev, data]);
      }
    }

    setSaving(false);
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (!error) {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }
    setDeleteConfirm(null);
  };

  const toggleActive = async (item: Testimonial) => {
    const newValue = !item.is_active;
    const { error } = await supabase
      .from('testimonials')
      .update({ is_active: newValue })
      .eq('id', item.id);
    if (!error) {
      setItems((prev) =>
        prev.map((t) => (t.id === item.id ? { ...t, is_active: newValue } : t))
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
          <p className="text-slate-500 mt-1">{items.length} total testimonial{items.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Button>
      </div>

      <Card>
        <div className="flex flex-wrap gap-3 items-center">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={pageFilter}
            onChange={(e) => setPageFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Pages</option>
            {PAGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <p className="text-slate-400 text-center py-12">No testimonials match your filters</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <div key={item.id} className="flex items-start gap-4 py-4 px-2">
                {item.photo_url ? (
                  <img
                    src={item.photo_url}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Quote className="w-5 h-5 text-blue-500" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900">{item.name}</p>
                    {!item.is_active && (
                      <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-500 rounded-full">Hidden</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.page === 'home' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {item.page === 'home' ? 'Home' : 'Impact'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.type === 'testimonial' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
                    }`}>
                      {item.type === 'testimonial' ? 'Testimonial' : 'Success Story'}
                    </span>
                    {item.military_branch && (
                      <span className="text-xs text-slate-500">{item.military_branch}</span>
                    )}
                    <div className="flex gap-0.5">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                    {item.quote || item.story}
                  </p>
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
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Testimonial</h3>
            <p className="text-slate-600 text-sm mb-6">
              Are you sure? This will permanently remove this testimonial.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(deleteConfirm)}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <TestimonialFormModal
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
  form: TestimonialInsert;
  setForm: React.Dispatch<React.SetStateAction<TestimonialInsert>>;
  editing: boolean;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}

function TestimonialFormModal({ form, setForm, editing, saving, onSave, onClose }: FormModalProps) {
  const isSuccessStory = form.type === 'success_story';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-slate-900">
            {editing ? 'Edit Testimonial' : 'New Testimonial'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Page</label>
              <select
                value={form.page}
                onChange={(e) => setForm((prev) => ({ ...prev, page: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {PAGE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
            <Input
              label="Service Background"
              value={form.military_branch}
              onChange={(e) => setForm((prev) => ({ ...prev, military_branch: e.target.value }))}
            />
          </div>

          <Input
            label="Role / Title"
            value={form.role || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value || null }))}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {isSuccessStory ? 'Description' : 'Quote'}
            </label>
            <textarea
              value={form.quote}
              onChange={(e) => setForm((prev) => ({ ...prev, quote: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {isSuccessStory && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Story</label>
              <textarea
                value={form.story || ''}
                onChange={(e) => setForm((prev) => ({ ...prev, story: e.target.value || null }))}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
              <select
                value={form.rating}
                onChange={(e) => setForm((prev) => ({ ...prev, rating: parseInt(e.target.value) }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <Input
              label="Sort Order"
              type="number"
              value={String(form.sort_order)}
              onChange={(e) => setForm((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <Input
            label="Photo URL"
            value={form.photo_url || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, photo_url: e.target.value || null }))}
          />

          {isSuccessStory && (
            <>
              <Input
                label="Video Thumbnail URL"
                value={form.video_placeholder_url || ''}
                onChange={(e) => setForm((prev) => ({ ...prev, video_placeholder_url: e.target.value || null }))}
              />
              <Input
                label="Impact Summary"
                value={form.impact || ''}
                onChange={(e) => setForm((prev) => ({ ...prev, impact: e.target.value || null }))}
              />
            </>
          )}

          <Input
            label="Outcome"
            value={form.outcome || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, outcome: e.target.value || null }))}
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
              {editing ? 'Save Changes' : 'Create Testimonial'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
