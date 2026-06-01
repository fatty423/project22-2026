import { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Lock, AlertTriangle, UserPlus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { useAppNavigate } from '../hooks/useAppNavigate';

export function AdminLogin() {
  const navigate = useAppNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsSetup, setNeedsSetup] = useState(false);
  const [checkingSetup, setCheckingSetup] = useState(true);
  const { signIn, signOut, user } = useAuth();

  useEffect(() => {
    checkAdminExists();
  }, []);

  useEffect(() => {
    if (user) {
      verifyAdminAndRedirect();
    }
  }, [user]);

  const verifyAdminAndRedirect = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();
    if (data) {
      navigate('admin');
    }
  };

  const checkAdminExists = async () => {
    try {
      const { data, error } = await supabase.rpc('admin_setup_needed');
      if (error) throw error;
      setNeedsSetup(data === true);
    } catch {
      setNeedsSetup(false);
    } finally {
      setCheckingSetup(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;
      if (!signUpData.user) throw new Error('Failed to create account');

      const { error: adminError } = await supabase
        .from('admin_users')
        .insert({ id: signUpData.user.id, email, role: 'super_admin' });
      if (adminError) throw adminError;

      navigate('admin');
    } catch (err: any) {
      setError(err.message || 'Failed to create admin account.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) throw signInError;

      const { data: adminRecord, error: adminError } = await supabase
        .from('admin_users')
        .select('id, role')
        .eq('email', email)
        .maybeSingle();

      if (adminError) throw adminError;

      if (!adminRecord) {
        await signOut();
        setError('Access denied. This account does not have admin privileges.');
        return;
      }

      navigate('admin');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isSetup = needsSetup;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-full mb-4 border border-slate-600">
            {isSetup ? (
              <UserPlus className="w-8 h-8 text-blue-400" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-blue-400" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isSetup ? 'Admin Setup' : 'Admin Portal'}
          </h2>
          <p className="text-slate-400">
            {isSetup
              ? 'Create your first admin account to get started'
              : 'Project 22 Administration'}
          </p>
        </div>

        <Card>
          <form onSubmit={isSetup ? handleSetup : handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="admin@project22.org"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={isSetup ? 'Choose a strong password' : 'Enter your password'}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={loading}
              className="flex items-center justify-center gap-2"
            >
              {loading ? (
                isSetup ? 'Creating Account...' : 'Verifying...'
              ) : isSetup ? (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Admin Account
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('home')}
            className="text-slate-400 hover:text-white transition-colors duration-200"
          >
            Back to Main Site
          </button>
        </div>
      </div>
    </div>
  );
}
