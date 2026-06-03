'use client';
import { useApp } from '@/context/AppContext';
import { useDashboardData } from '@/hooks/useSupabaseData';
import { MetricCard } from '@/components/ui/MetricCard';
import { calcKpiStatus, formatRupiah, formatROAS, formatNumber } from '@/lib/utils';
import type { NgajigaesMetrics, CPLMetrics } from '@/lib/types';

export function HeroCards() {
  const { activeBrand, dateRange } = useApp();
  const { metrics, trends, isLoading } = useDashboardData(activeBrand, dateRange);

  if (isLoading) return <HeroSkeleton />;

  if (activeBrand === 'ngajigaes') {
    return <NgajigaesHero m={metrics as NgajigaesMetrics} trends={trends} />;
  }
  return <CPLHero brandId={activeBrand} m={metrics as CPLMetrics} trends={trends} />;
}

// ─── Skeletons ─────────────────────────────────────────────────────────────────
function HeroSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-4 h-32 animate-pulse" />
      ))}
    </div>
  );
}

// ─── Ngajigaes (ROAS brand) ───────────────────────────────────────────────────
function NgajigaesHero({
  m, trends,
}: { m: NgajigaesMetrics; trends: { primary: number[]; spend: number[]; reach: number[] } | null }) {
  const roasStatus = calcKpiStatus(m.roas, m.roasTarget);
  const cppStatus  = calcKpiStatus(m.costPerPurchase, m.costPerPurchaseTarget, true);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        label="ROAS"
        value={formatROAS(m.roas)}
        target={formatROAS(m.roasTarget)}
        targetRaw={m.roasTarget}
        actualRaw={m.roas}
        status={roasStatus}
        isLarge
        trend={m.roas >= m.roasTarget ? 2.1 : -6.7}
        sparklineData={trends?.primary}
        sparklineColor="#6366F1"
      />
      <MetricCard
        label="Cost per Purchase"
        value={formatRupiah(m.costPerPurchase)}
        target={formatRupiah(m.costPerPurchaseTarget)}
        targetRaw={m.costPerPurchaseTarget}
        actualRaw={m.costPerPurchase}
        status={cppStatus}
        isLarge
        trend={m.costPerPurchase <= m.costPerPurchaseTarget ? -8.9 : 5.2}
        sparklineColor="#6366F1"
        inverse
      />
      <MetricCard
        label="Profit Rate"
        value={`${m.profitRate.toFixed(1)}%`}
        subValue={`Conv. Value ${formatRupiah(m.convValue)}`}
        isLarge
        sparklineData={trends?.primary.map(v => v * 6.5)}
        sparklineColor="#A78BFA"
      />
      <MetricCard
        label="Total Spend"
        value={formatRupiah(m.totalSpend)}
        subValue={`${formatNumber(m.totalPurchases)} purchases`}
        isLarge
        sparklineData={trends?.spend}
        sparklineColor="#8B8FA8"
      />
    </div>
  );
}

// ─── CPL brands (Labbaika / Alaika) ───────────────────────────────────────────
function CPLHero({
  brandId, m, trends,
}: {
  brandId: 'labbaika' | 'alaika';
  m: CPLMetrics;
  trends: { primary: number[]; spend: number[]; reach: number[]; result: number[] } | null;
}) {
  const cplStatus  = calcKpiStatus(m.cpl, m.cplTarget, true);
  const brandColor = brandId === 'labbaika' ? '#10B981' : '#F59E0B';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        label="CPL"
        value={formatRupiah(m.cpl)}
        target={formatRupiah(m.cplTarget)}
        targetRaw={m.cplTarget}
        actualRaw={m.cpl}
        status={cplStatus}
        isLarge
        trend={m.cpl > m.cplTarget ? 5.2 : -5.2}
        sparklineData={trends?.primary}
        sparklineColor={brandColor}
        inverse
      />
      <MetricCard
        label="Total Leads"
        value={formatNumber(m.totalLeads)}
        subValue="leads terkumpul"
        isLarge
        sparklineData={trends?.result}
        sparklineColor={brandColor}
      />
      <MetricCard
        label="Reach"
        value={formatNumber(m.reach)}
        subValue="akun terjangkau"
        isLarge
        sparklineData={trends?.reach}
        sparklineColor={brandColor}
      />
      <MetricCard
        label="Total Spend"
        value={formatRupiah(m.totalSpend)}
        subValue={`CPM ${formatRupiah(m.cpm)}`}
        isLarge
        sparklineData={trends?.spend}
        sparklineColor="#8B8FA8"
      />
    </div>
  );
}
