import { useEffect, useState, useCallback } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  ShieldCheck,
  Shield,
  KeyRound,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

type ModalMode = 'create' | 'edit' | null;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function callManageAdmin(
  action: string,
  payload: Record<string, unknown>,
  token: string
) {
  const res = await fetch(
    `${SUPABASE_URL}/functions/v1/manage-admin-user`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ action, ...payload }),
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export function AdminUsers() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('admin');

  const isSuperAdmin = currentRole === 'super_admin';

  const loadAdmins = useCallback(async () => {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: true });

    if (!error && data) {
      setAdmins(data);
      const me = data.find((a) => a.id === user?.id);
      if (me) setCurrentRole(me.role);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const getToken = async () => {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || '';
  };

  const openCreate = () => {
    setFormEmail('');
    setFormPassword('');
    setFormRole('admin');
    setEditingUser(null);
    setError('');
    setModalMode('create');
  };

  const openEdit = (admin: AdminUser) => {
    setEditingUser(admin);
    setFormRole(admin.role);
    setFormPassword('');
    setError('');
    setModalMode('edit');
  };

  const handleCreate = async () => {
    if (!formEmail.trim() || !formPassword.trim()) return;
    setActionLoading(true);
    setError('');

    try {
      const token = await getToken();
      const result = await callManageAdmin(
        'create',
        { email: formEmail, password: formPassword, role: formRole },
        token
      );
      if (result.user) {
        setAdmins((prev) => [...prev, result.user]);
      }
      setModalMode(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create admin');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    setActionLoading(true);
    setError('');

    try {
      const token = await getToken();
      const payload: Record<string, unknown> = { userId: editingUser.id };

      if (formRole !== editingUser.role) payload.role = formRole;
      if (formPassword.trim()) payload.password = formPassword;

      if (!payload.role && !payload.password) {
        setModalMode(null);
        return;
      }

      await callManageAdmin('update', payload, token);

      setAdmins((prev) =>
        prev.map((a) =>
          a.id === editingUser.id
            ? { ...a, role: formRole }
            : a
        )
      );
      setModalMode(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update admin');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    try {
      const token = await getToken();
      await callManageAdmin('delete', { userId: id }, token);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete admin');
    } finally {
      setActionLoading(false);
      setDeleteConfirm(null);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Shield className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-lg font-bold text-slate-900 mb-1">Access Restricted</h2>
        <p className="text-slate-500 text-sm max-w-md">
          Only super admins can manage admin users. Contact a super admin if you need access.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team</h1>
          <p className="text-slate-500 mt-1">
            {admins.length} admin user{admins.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Admin
        </Button>
      </div>

      {error && !modalMode && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <Card>
        {admins.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400">No admin users yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center gap-4 py-4 px-2"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                  {admin.role === 'super_admin' ? (
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Shield className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 truncate">
                      {admin.email}
                    </p>
                    {admin.id === user?.id && (
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">
                    Added {formatDate(admin.created_at)}
                  </p>
                </div>

                <span
                  className={`hidden sm:inline-block text-xs px-2.5 py-1 rounded-full font-medium ${
                    admin.role === 'super_admin'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(admin)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4 text-slate-500" />
                  </button>
                  {admin.id !== user?.id && (
                    <button
                      onClick={() => setDeleteConfirm(admin.id)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Remove Admin
            </h3>
            <p className="text-slate-600 text-sm mb-6">
              This will permanently remove this admin user and revoke their
              access. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={actionLoading}
                onClick={() => handleDelete(deleteConfirm)}
                className="flex items-center gap-2"
              >
                {actionLoading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {modalMode && (
        <AdminUserModal
          mode={modalMode}
          email={formEmail}
          password={formPassword}
          role={formRole}
          saving={actionLoading}
          error={error}
          isEditingSelf={editingUser?.id === user?.id}
          onEmailChange={setFormEmail}
          onPasswordChange={setFormPassword}
          onRoleChange={setFormRole}
          onSave={modalMode === 'create' ? handleCreate : handleUpdate}
          onClose={() => setModalMode(null)}
        />
      )}
    </div>
  );
}

interface ModalProps {
  mode: 'create' | 'edit';
  email: string;
  password: string;
  role: string;
  saving: boolean;
  error: string;
  isEditingSelf: boolean;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onRoleChange: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}

function AdminUserModal({
  mode,
  email,
  password,
  role,
  saving,
  error,
  isEditingSelf,
  onEmailChange,
  onPasswordChange,
  onRoleChange,
  onSave,
  onClose,
}: ModalProps) {
  const isCreate = mode === 'create';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 sm:pt-20 px-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-slate-900">
            {isCreate ? 'Add Admin User' : 'Edit Admin User'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {isCreate && (
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="admin@project22.org"
            />
          )}

          <div>
            <Input
              label={isCreate ? 'Password' : 'New Password'}
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder={
                isCreate ? 'Choose a strong password' : 'Leave blank to keep current'
              }
            />
            {!isCreate && (
              <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1">
                <KeyRound className="w-3 h-3" />
                Only fill this to reset the password
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => onRoleChange(e.target.value)}
              disabled={isEditingSelf}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            {isEditingSelf && (
              <p className="mt-1.5 text-xs text-slate-400">
                You cannot change your own role
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={
                saving ||
                (isCreate && (!email.trim() || !password.trim()))
              }
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isCreate ? 'Create Admin' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
