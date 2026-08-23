'use client';

import { useState } from 'react';

interface Ticket {
  id: string;
  brand: string;
  user: string;
  subject: string;
  category: string;
  status: 'open' | 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: 'T-104', brand: 'Delhi Express Cafe', user: 'Sunil Sharma', subject: 'Receipt printing fails on POS reconnect', category: 'Hardware Printer', status: 'open', priority: 'high', createdAt: '2026-08-23 10:12' },
    { id: 'T-103', brand: 'Demo Cafe', user: 'Mukul Thakur', subject: 'Coupon rules validation doesn\'t apply discounts', category: 'Billing/Promos', status: 'pending', priority: 'medium', createdAt: '2026-08-22 14:45' },
    { id: 'T-102', brand: 'Bangalore Roast', user: 'Kiran Rao', subject: 'Requesting Growth plan invoice copies', category: 'Billing Support', status: 'resolved', priority: 'low', createdAt: '2026-08-21 16:30' },
    { id: 'T-101', brand: 'Chai Point Main', user: 'Neha Gupta', subject: 'KDS display screen freezes under peak hours', category: 'KDS Operational', status: 'resolved', priority: 'critical', createdAt: '2026-08-21 09:12' },
  ]);

  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleResolveTicket = (id: string) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, status: 'resolved' };
        }
        return t;
      })
    );
    if (activeTicket?.id === id) {
      setActiveTicket((prev) => (prev ? { ...prev, status: 'resolved' } : null));
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !activeTicket) return;

    alert(`Reply sent to ${activeTicket.user}: "${replyText}"`);
    setReplyText('');
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === activeTicket.id) {
          return { ...t, status: 'pending' };
        }
        return t;
      })
    );
    setActiveTicket((prev) => (prev ? { ...prev, status: 'pending' } : null));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Support Center</h1>
        <p className="text-slate-400 mt-2">Manage merchant queries, report tickets, and billing issues.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tickets List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-slate-200 text-sm mb-1">Open Operations Tickets</h3>
            <span className="text-xs text-slate-500">List of unresolved requests from cafe owners</span>
          </div>

          <div className="space-y-3">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setActiveTicket(t)}
                className={`p-5 rounded-xl border transition cursor-pointer text-left ${
                  activeTicket?.id === t.id
                    ? 'bg-slate-900 border-indigo-500'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400">{t.id}</span>
                    <span className="text-xs text-slate-400">&bull;</span>
                    <span className="text-xs font-semibold text-slate-300">{t.brand}</span>
                  </div>
                  <span
                    className={`inline-flex items-center text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${
                      t.priority === 'critical'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : t.priority === 'high'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
                <h4 className="font-bold text-slate-100 text-base">{t.subject}</h4>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-slate-500">By {t.user} on {t.createdAt}</span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${
                      t.status === 'open'
                        ? 'bg-amber-500/10 text-amber-400'
                        : t.status === 'pending'
                        ? 'bg-indigo-500/10 text-indigo-400'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reply/Details Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm h-fit">
          {activeTicket ? (
            <div className="space-y-6">
              <div>
                <span className="font-mono text-xs text-indigo-400 block font-bold mb-1">{activeTicket.id}</span>
                <h3 className="font-bold text-slate-100 text-lg">{activeTicket.subject}</h3>
                <div className="text-xs text-slate-400 mt-2 space-y-1">
                  <div><strong>From:</strong> {activeTicket.user}</div>
                  <div><strong>Cafe:</strong> {activeTicket.brand}</div>
                  <div><strong>Category:</strong> {activeTicket.category}</div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-4">
                {activeTicket.status !== 'resolved' && (
                  <form onSubmit={handleSendReply} className="space-y-3">
                    <label className="block text-xs font-semibold text-slate-300">Reply Response</label>
                    <textarea
                      required
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write response message..."
                      className="w-full px-3 py-2 text-sm rounded bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    ></textarea>
                    <button
                      type="submit"
                      className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
                    >
                      Send Message
                    </button>
                  </form>
                )}

                {activeTicket.status !== 'resolved' ? (
                  <button
                    onClick={() => handleResolveTicket(activeTicket.id)}
                    className="w-full py-2 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 text-xs font-bold rounded transition"
                  >
                    Mark Ticket as Resolved
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 rounded text-center text-xs font-semibold">
                    Ticket Resolved
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12">
              Select a support ticket to view details and draft replies.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
