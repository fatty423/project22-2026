import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  LogOut,
  ArrowLeft,
  Menu,
  ShieldCheck,
  GraduationCap,
  Quote,
  Users,
  Shield,
  Heart,
  MessageSquareHeart,
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useAppNavigate } from '../hooks/useAppNavigate';
import { getPath } from '../lib/routes';
import { supabase } from '../lib/supabase';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
}

interface NavGroup {
  label: string | null;
  items: NavItem[];
}

const overviewGroup: NavGroup = {
  label: null,
  items: [{ id: 'admin', label: 'Dashboard', icon: LayoutDashboard }],
};

const peopleGroup: NavGroup = {
  label: 'People',
  items: [
    { id: 'admin-heroes', label: 'Heroes', icon: Shield },
    { id: 'admin-donors', label: 'Donors', icon: Heart },
    { id: 'admin-applications', label: 'Applicants', icon: FileText },
  ],
};

const contentGroup: NavGroup = {
  label: 'Content',
  items: [
    { id: 'admin-hero-updates', label: 'Hero Updates', icon: MessageSquareHeart },
    { id: 'admin-testimonials', label: 'Testimonials', icon: Quote },
    { id: 'admin-programs', label: 'Programs', icon: GraduationCap },
  ],
};

const communicationGroup: NavGroup = {
  label: 'Communication',
  items: [{ id: 'admin-messages', label: 'Messages', icon: MessageSquare }],
};

const teamGroup: NavGroup = {
  label: 'Operations',
  items: [{ id: 'admin-users', label: 'Team', icon: Users }],
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useAppNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!user) return;
    supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.role === 'super_admin') setIsSuperAdmin(true);
      });
  }, [user]);

  const navGroups: NavGroup[] = [
    overviewGroup,
    peopleGroup,
    contentGroup,
    communicationGroup,
    ...(isSuperAdmin ? [teamGroup] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('home');
  };

  const handleNav = (page: string) => {
    navigate(page);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">Project 22</p>
                <p className="text-xs text-slate-400">Admin Portal</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-5 overflow-y-auto">
            {navGroups.map((group, idx) => (
              <div key={group.label ?? `group-${idx}`} className="space-y-1">
                {group.label && (
                  <p className="px-4 pt-1 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {group.label}
                  </p>
                )}
                {group.items.map((item) => {
                  const isActive = pathname === getPath(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-700 space-y-3">
            <button
              onClick={() => handleNav('home')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Main Site
            </button>

            <div className="px-4 py-2">
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center gap-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-slate-900">Admin</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
