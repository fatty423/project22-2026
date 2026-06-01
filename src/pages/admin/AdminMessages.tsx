import { useEffect, useState, useCallback } from 'react';
import {
  Search,
  Loader2,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import type { Database } from '../../lib/supabase';

type Message = Database['public']['Tables']['contact_messages']['Row'];

export function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const filtered = messages.filter((msg) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      msg.subject.toLowerCase().includes(q)
    );
  });

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const formatDateTime = (dateStr: string) =>
    new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
        <p className="text-slate-500 mt-1">{messages.length} total message{messages.length !== 1 ? 's' : ''}</p>
      </div>

      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or subject..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </Card>

      <Card>
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No messages match your search</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((msg) => {
              const isExpanded = expandedId === msg.id;
              return (
                <div key={msg.id}>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                    className="w-full flex items-center justify-between py-4 px-2 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium text-slate-900 text-sm truncate">{msg.subject}</p>
                      </div>
                      <p className="text-xs text-slate-500">
                        {msg.name} &middot; {msg.email} &middot; {formatDate(msg.created_at)}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-5 space-y-4">
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-sm">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">{msg.email}</a>
                        </div>
                        {msg.phone && (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-sm">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <a href={`tel:${msg.phone}`} className="text-blue-600 hover:underline">{msg.phone}</a>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-xs text-slate-500 mb-1">Sent {formatDateTime(msg.created_at)}</p>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                        </div>
                      </div>

                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Reply via Email
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
