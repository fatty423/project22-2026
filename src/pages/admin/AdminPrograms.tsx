import { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  GripVertical,
  Star,
  EyeOff,
  Eye,
  BookOpen,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import type { Database } from '../../lib/supabase';

type Program = Database['public']['Tables']['programs']['Row'];
type ProgramInsert = Database['public']['Tables']['programs']['Insert'];
type ProgramCourse = Database['public']['Tables']['program_courses']['Row'];
type ProgramCourseInsert = Database['public']['Tables']['program_courses']['Insert'];

const ICON_OPTIONS = [
  'Shield', 'Award', 'Search', 'BadgeCheck', 'GraduationCap',
  'Briefcase', 'Heart', 'Users',
];

const TIER_OPTIONS = [
  { value: 'entry', label: 'Entry' },
  { value: 'mid', label: 'Mid' },
  { value: 'premium', label: 'Premium' },
  { value: 'coming-soon', label: 'Coming Soon' },
];

const emptyForm: ProgramInsert = {
  slug: '',
  name: '',
  subtitle: '',
  duration: '',
  price: '',
  salary_range: '',
  description: '',
  tier: 'entry',
  icon_name: 'Shield',
  is_featured: false,
  is_coming_soon: false,
  is_active: true,
  sort_order: 0,
};

export function AdminPrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [coursesByProgram, setCoursesByProgram] = useState<Record<string, ProgramCourse[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProgramInsert>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<string | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState<ProgramCourseInsert>({
    program_id: '',
    name: '',
    description: '',
    duration: '',
    price: '',
    format: 'In Person',
    sort_order: 0,
    is_active: true,
  });
  const [savingCourse, setSavingCourse] = useState(false);
  const [deleteCourseConfirm, setDeleteCourseConfirm] = useState<string | null>(null);

  const loadPrograms = useCallback(async () => {
    const [programsResult, coursesResult] = await Promise.all([
      supabase.from('programs').select('*').order('sort_order', { ascending: true }),
      supabase.from('program_courses').select('*').order('sort_order', { ascending: true }),
    ]);

    if (!programsResult.error && programsResult.data) setPrograms(programsResult.data);
    if (!coursesResult.error && coursesResult.data) {
      const grouped: Record<string, ProgramCourse[]> = {};
      for (const c of coursesResult.data) {
        if (!grouped[c.program_id]) grouped[c.program_id] = [];
        grouped[c.program_id].push(c);
      }
      setCoursesByProgram(grouped);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sort_order: programs.length + 1 });
    setShowModal(true);
  };

  const openEdit = (program: Program) => {
    setEditingId(program.id);
    setForm({
      slug: program.slug,
      name: program.name,
      subtitle: program.subtitle,
      duration: program.duration,
      price: program.price,
      salary_range: program.salary_range,
      description: program.description,
      tier: program.tier,
      icon_name: program.icon_name,
      is_featured: program.is_featured,
      is_coming_soon: program.is_coming_soon,
      is_active: program.is_active,
      sort_order: program.sort_order,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) return;
    setSaving(true);

    if (editingId) {
      const { error } = await supabase
        .from('programs')
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq('id', editingId);
      if (!error) {
        setPrograms((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...form, updated_at: new Date().toISOString() } : p))
        );
      }
    } else {
      const { data, error } = await supabase
        .from('programs')
        .insert(form)
        .select()
        .maybeSingle();
      if (!error && data) {
        setPrograms((prev) => [...prev, data]);
      }
    }

    setSaving(false);
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('programs').delete().eq('id', id);
    if (!error) {
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    }
    setDeleteConfirm(null);
  };

  const toggleActive = async (program: Program) => {
    const newValue = !program.is_active;
    const { error } = await supabase
      .from('programs')
      .update({ is_active: newValue, updated_at: new Date().toISOString() })
      .eq('id', program.id);
    if (!error) {
      setPrograms((prev) =>
        prev.map((p) => (p.id === program.id ? { ...p, is_active: newValue } : p))
      );
    }
  };

  const moveProgram = async (index: number, direction: 'up' | 'down') => {
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= programs.length) return;

    const updated = [...programs];
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];

    const a = updated[index];
    const b = updated[swapIndex];

    setPrograms(updated);

    await Promise.all([
      supabase.from('programs').update({ sort_order: index + 1 }).eq('id', a.id),
      supabase.from('programs').update({ sort_order: swapIndex + 1 }).eq('id', b.id),
    ]);
  };

  const openCreateCourse = (programId: string) => {
    setEditingCourseId(null);
    const existing = coursesByProgram[programId] || [];
    setCourseForm({
      program_id: programId,
      name: '',
      description: '',
      duration: '',
      price: '',
      format: 'In Person',
      sort_order: existing.length + 1,
      is_active: true,
    });
    setShowCourseModal(true);
  };

  const openEditCourse = (course: ProgramCourse) => {
    setEditingCourseId(course.id);
    setCourseForm({
      program_id: course.program_id,
      name: course.name,
      description: course.description,
      duration: course.duration,
      price: course.price,
      format: course.format,
      sort_order: course.sort_order,
      is_active: course.is_active,
    });
    setShowCourseModal(true);
  };

  const handleSaveCourse = async () => {
    if (!courseForm.name.trim()) return;
    setSavingCourse(true);

    if (editingCourseId) {
      const { error } = await supabase
        .from('program_courses')
        .update({ ...courseForm, updated_at: new Date().toISOString() })
        .eq('id', editingCourseId);
      if (!error) {
        setCoursesByProgram((prev) => {
          const updated = { ...prev };
          const list = (updated[courseForm.program_id] || []).map((c) =>
            c.id === editingCourseId ? { ...c, ...courseForm, updated_at: new Date().toISOString() } : c
          );
          updated[courseForm.program_id] = list;
          return updated;
        });
      }
    } else {
      const { data, error } = await supabase
        .from('program_courses')
        .insert(courseForm)
        .select()
        .maybeSingle();
      if (!error && data) {
        setCoursesByProgram((prev) => {
          const updated = { ...prev };
          updated[courseForm.program_id] = [...(updated[courseForm.program_id] || []), data];
          return updated;
        });
      }
    }

    setSavingCourse(false);
    setShowCourseModal(false);
  };

  const handleDeleteCourse = async (courseId: string, programId: string) => {
    const { error } = await supabase.from('program_courses').delete().eq('id', courseId);
    if (!error) {
      setCoursesByProgram((prev) => {
        const updated = { ...prev };
        updated[programId] = (updated[programId] || []).filter((c) => c.id !== courseId);
        return updated;
      });
    }
    setDeleteCourseConfirm(null);
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
          <h1 className="text-2xl font-bold text-slate-900">Programs</h1>
          <p className="text-slate-500 mt-1">{programs.length} total program{programs.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Program
        </Button>
      </div>

      <Card>
        {programs.length === 0 ? (
          <p className="text-slate-400 text-center py-12">No programs yet</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {programs.map((program, index) => {
              const courses = coursesByProgram[program.id] || [];
              const hasCourses = courses.length > 0;
              const isExpanded = expandedCourses === program.id;

              return (
                <div key={program.id}>
                  <div className="flex items-center gap-4 py-4 px-2">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveProgram(index, 'up')}
                        disabled={index === 0}
                        className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveProgram(index, 'down')}
                        disabled={index === programs.length - 1}
                        className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
                      >
                        <GripVertical className="w-4 h-4 rotate-180" />
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900 truncate">{program.name}</p>
                        {program.is_featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        )}
                        {!program.is_active && (
                          <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-500 rounded-full">Hidden</span>
                        )}
                        {program.is_coming_soon && (
                          <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">Coming Soon</span>
                        )}
                        {hasCourses && (
                          <span className="text-xs px-2 py-0.5 bg-sky-100 text-sky-700 rounded-full">{courses.length} courses</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 truncate">{program.subtitle}</p>
                    </div>

                    <div className="hidden md:block text-sm text-slate-600 w-24 text-center">
                      {program.price}
                    </div>

                    <div className="hidden lg:block text-sm text-slate-500 w-24 text-center">
                      {program.duration}
                    </div>

                    <span className={`hidden sm:inline-block text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                      program.tier === 'premium' ? 'bg-blue-100 text-blue-700' :
                      program.tier === 'mid' ? 'bg-sky-100 text-sky-700' :
                      program.tier === 'coming-soon' ? 'bg-slate-100 text-slate-600' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {program.tier}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setExpandedCourses(isExpanded ? null : program.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Manage courses"
                      >
                        <BookOpen className={`w-4 h-4 ${hasCourses ? 'text-sky-600' : 'text-slate-400'}`} />
                      </button>
                      <button
                        onClick={() => toggleActive(program)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        title={program.is_active ? 'Hide program' : 'Show program'}
                      >
                        {program.is_active ? (
                          <Eye className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <button
                        onClick={() => openEdit(program)}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-slate-500" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(program.id)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-slate-50 border-t border-slate-100 px-4 py-4 ml-8">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-slate-700">Sub-Courses</h4>
                        <Button
                          size="sm"
                          onClick={() => openCreateCourse(program.id)}
                          className="bg-sky-600 hover:bg-sky-700 text-xs flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add Course
                        </Button>
                      </div>
                      {courses.length === 0 ? (
                        <p className="text-sm text-slate-400 text-center py-4">No sub-courses yet</p>
                      ) : (
                        <div className="space-y-2">
                          {courses.map((course) => (
                            <div key={course.id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-slate-200">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-slate-900 truncate">{course.name}</p>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    course.format === 'Online' ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'
                                  }`}>
                                    {course.format}
                                  </span>
                                  {!course.is_active && (
                                    <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-500 rounded-full">Hidden</span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">{course.duration} &middot; {course.price}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <button onClick={() => openEditCourse(course)} className="p-1.5 rounded hover:bg-slate-100">
                                  <Pencil className="w-3.5 h-3.5 text-slate-500" />
                                </button>
                                <button onClick={() => setDeleteCourseConfirm(course.id)} className="p-1.5 rounded hover:bg-red-50">
                                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Program</h3>
            <p className="text-slate-600 text-sm mb-6">
              Are you sure? This will permanently remove this program. Applications referencing it will still show the slug.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={() => handleDelete(deleteConfirm)}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <ProgramFormModal
          form={form}
          setForm={setForm}
          editing={!!editingId}
          saving={saving}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

      {deleteCourseConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteCourseConfirm(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Course</h3>
            <p className="text-slate-600 text-sm mb-6">Are you sure you want to permanently remove this course?</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" size="sm" onClick={() => setDeleteCourseConfirm(null)}>Cancel</Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  const course = Object.values(coursesByProgram).flat().find((c) => c.id === deleteCourseConfirm);
                  if (course) handleDeleteCourse(deleteCourseConfirm, course.program_id);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {showCourseModal && (
        <CourseFormModal
          form={courseForm}
          setForm={setCourseForm}
          editing={!!editingCourseId}
          saving={savingCourse}
          onSave={handleSaveCourse}
          onClose={() => setShowCourseModal(false)}
        />
      )}
    </div>
  );
}

interface FormModalProps {
  form: ProgramInsert;
  setForm: React.Dispatch<React.SetStateAction<ProgramInsert>>;
  editing: boolean;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}

function ProgramFormModal({ form, setForm, editing, saving, onSave, onClose }: FormModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-slate-900">
            {editing ? 'Edit Program' : 'New Program'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Program Name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            />
            <Input
              label="Slug (URL key)"
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            />
          </div>

          <Input
            label="Subtitle"
            value={form.subtitle}
            onChange={(e) => setForm((prev) => ({ ...prev, subtitle: e.target.value }))}
          />

          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Duration"
              value={form.duration}
              onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
            />
            <Input
              label="Price"
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
            />
            <Input
              label="Salary Range"
              value={form.salary_range}
              onChange={(e) => setForm((prev) => ({ ...prev, salary_range: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tier</label>
              <select
                value={form.tier}
                onChange={(e) => setForm((prev) => ({ ...prev, tier: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {TIER_OPTIONS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
              <select
                value={form.icon_name}
                onChange={(e) => setForm((prev) => ({ ...prev, icon_name: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>{icon}</option>
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

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm((prev) => ({ ...prev, is_featured: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_coming_soon}
                onChange={(e) => setForm((prev) => ({ ...prev, is_coming_soon: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Coming Soon</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Active (visible on site)</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              onClick={onSave}
              disabled={saving || !form.name.trim() || !form.slug.trim()}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editing ? 'Save Changes' : 'Create Program'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CourseFormModalProps {
  form: ProgramCourseInsert;
  setForm: React.Dispatch<React.SetStateAction<ProgramCourseInsert>>;
  editing: boolean;
  saving: boolean;
  onSave: () => void;
  onClose: () => void;
}

function CourseFormModal({ form, setForm, editing, saving, onSave, onClose }: CourseFormModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-16 px-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-slate-900">
            {editing ? 'Edit Course' : 'New Course'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <Input
            label="Course Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Duration"
              value={form.duration}
              onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
              placeholder="e.g. 8 hrs"
            />
            <Input
              label="Price"
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              placeholder="e.g. $200"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Format</label>
              <select
                value={form.format}
                onChange={(e) => setForm((prev) => ({ ...prev, format: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="In Person">In Person</option>
                <option value="Online">Online</option>
              </select>
            </div>
            <Input
              label="Sort Order"
              type="number"
              value={String(form.sort_order)}
              onChange={(e) => setForm((prev) => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
            />
          </div>

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
              {editing ? 'Save Changes' : 'Create Course'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
