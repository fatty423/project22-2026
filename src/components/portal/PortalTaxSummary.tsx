import { useMemo } from 'react';
import { FileText, Download } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Database } from '../../lib/supabase';

type Donation = Database['public']['Tables']['donations']['Row'];

interface PortalTaxSummaryProps {
  donations: Donation[];
  donorName: string;
}

interface YearSummary {
  year: number;
  total: number;
  count: number;
}

export function PortalTaxSummary({ donations, donorName }: PortalTaxSummaryProps) {
  const yearSummaries = useMemo(() => {
    const succeeded = donations.filter((d) => d.status === 'succeeded');
    const grouped: Record<number, { total: number; count: number }> = {};

    for (const d of succeeded) {
      const year = new Date(d.created_at).getFullYear();
      if (!grouped[year]) grouped[year] = { total: 0, count: 0 };
      grouped[year].total += d.amount;
      grouped[year].count += 1;
    }

    return Object.entries(grouped)
      .map(([year, data]) => ({ year: parseInt(year), ...data }))
      .sort((a, b) => b.year - a.year) as YearSummary[];
  }, [donations]);

  const handlePrint = (year: number) => {
    const summary = yearSummaries.find((s) => s.year === year);
    if (!summary) return;

    const yearDonations = donations
      .filter((d) => d.status === 'succeeded' && new Date(d.created_at).getFullYear() === year)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Project 22 - ${year} Donation Statement</title>
          <style>
            body { font-family: system-ui, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #1e293b; }
            h1 { font-size: 24px; margin-bottom: 4px; }
            .subtitle { color: #64748b; margin-bottom: 32px; }
            .org-info { background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 14px; }
            .org-info p { margin: 4px 0; }
            table { width: 100%; border-collapse: collapse; font-size: 14px; }
            th { text-align: left; padding: 10px 12px; background: #f1f5f9; border-bottom: 2px solid #e2e8f0; font-weight: 600; }
            td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
            .total-row { font-weight: 700; background: #f0f9ff; }
            .footer { margin-top: 32px; font-size: 12px; color: #94a3b8; }
            @media print { body { margin: 20px; } }
          </style>
        </head>
        <body>
          <h1>Annual Donation Statement</h1>
          <p class="subtitle">${year} Tax Year - ${donorName}</p>
          <div class="org-info">
            <p><strong>Project 22</strong></p>
            <p>501(c)(3) Nonprofit Organization</p>
            <p>All donations are tax-deductible to the extent allowed by law. This statement serves as your annual giving record for tax purposes.</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th style="text-align:right">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${yearDonations.map((d) => `
                <tr>
                  <td>${new Date(d.created_at).toLocaleDateString()}</td>
                  <td>${d.is_recurring ? 'Monthly' : 'One-time'}</td>
                  <td style="text-align:right">$${d.amount.toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="2">Total for ${year}</td>
                <td style="text-align:right">$${summary.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <p class="footer">
            This annual giving statement was generated on ${new Date().toLocaleDateString()}.
            Please retain for your tax records. No goods or services were provided in exchange for these contributions.
            Contributions to Project 22, a 501(c)(3) nonprofit, are tax-deductible to the extent allowed by law.
          </p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (yearSummaries.length === 0) return null;

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
          <FileText className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Tax Statements</h3>
          <p className="text-sm text-slate-500">Annual giving summaries for your tax records</p>
        </div>
      </div>

      <div className="space-y-3">
        {yearSummaries.map((summary) => (
          <div
            key={summary.year}
            className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
          >
            <div>
              <p className="font-semibold text-slate-900">{summary.year}</p>
              <p className="text-sm text-slate-500">
                {summary.count} donation{summary.count !== 1 ? 's' : ''} totaling{' '}
                <span className="font-medium text-slate-700">${summary.total.toFixed(2)}</span>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePrint(summary.year)}
              className="flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Print
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
