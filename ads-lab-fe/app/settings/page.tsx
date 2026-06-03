'use client';
import { Settings, Lock, Save, Check, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { BRANDS } from '@/lib/mockData';
import { upsertKpiTarget } from '@/lib/queries';
import { isSupabaseAvailable } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import type { BrandId } from '@/lib/types';

// ─── Storage keys ─────────────────────────────────────────────────────────────
const WEIGHTS_KEY  = 'adslab_scoring_weights';
const THRESH_KEY   = 'adslab_alert_thresholds';
const KPI_TARGETS_KEY = (brand: BrandId) => `adslab_kpi_targets_${brand}`;

// ─── Default values ────────────────────────────────────────────────────────────
const DEFAULT_WEIGHTS: Record<BrandId, { metric: string; weight: number }[]> = {
  ngajigaes: [
    { metric: 'ROAS',              weight: 40 },
    { metric: 'Cost per Purchase', weight: 30 },
    { metric: 'CTR',               weight: 30 },
  ],
  labbaika: [
    { metric: 'CPL',              weight: 40 },
    { metric: 'CTR',              weight: 30 },
    { metric: 'Reach Efficiency', weight: 30 },
  ],
  alaika: [
    { metric: 'CPL',              weight: 40 },
    { metric: 'CTR',              weight: 30 },
    { metric: 'Reach Efficiency', weight: 30 },
  ],
};

const DEFAULT_THRESHOLDS = [
  { key: 'cpl_anomaly',   label: 'CPL Anomaly threshold', value: 20,  unit: '%'      },
  { key: 'no_delivery',   label: 'No Delivery X jam',     value: 4,   unit: 'jam'    },
  { key: 'failed_test',   label: 'Failed Test threshold', value: 50,  unit: 'rb Rp'  },
  { key: 'roas_drop',     label: 'ROAS Drop threshold',   value: 20,  unit: '%'      },
  { key: 'ad_fatigue',    label: 'Ad Fatigue frequency',  value: 3,   unit: 'x / 7d' },
  { key: 'budget_warn',   label: 'Budget Warning sisa',   value: 20,  unit: '%'      },
];

const DEFAULT_KPI_TARGETS: Record<BrandId, { metric: string; target: number; unit: string }[]> = {
  ngajigaes: [
    { metric: 'ROAS Target',         target: 3.0,    unit: 'x'  },
    { metric: 'Max Cost/Purchase',   target: 45000,  unit: 'Rp' },
  ],
  labbaika: [
    { metric: 'Max CPL',    target: 80000, unit: 'Rp' },
  ],
  alaika: [
    { metric: 'Max CPL',    target: 80000, unit: 'Rp' },
  ],
};

// ─── Load / save helpers ──────────────────────────────────────────────────────
function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

export default function SettingsPage() {
  const { role, activeBrand } = useApp();
  const [saved, setSaved]   = useState(false);
  const [weights, setWeights]     = useState(DEFAULT_WEIGHTS);
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);
  const [kpiTargets, setKpiTargets] = useState(DEFAULT_KPI_TARGETS);

  // Load from localStorage on mount
  useEffect(() => {
    setWeights(loadJson(WEIGHTS_KEY, DEFAULT_WEIGHTS));
    setThresholds(loadJson(THRESH_KEY, DEFAULT_THRESHOLDS));
    const merged = { ...DEFAULT_KPI_TARGETS } as typeof DEFAULT_KPI_TARGETS;
    for (const b of ['ngajigaes', 'labbaika', 'alaika'] as BrandId[]) {
      merged[b] = loadJson(KPI_TARGETS_KEY(b), DEFAULT_KPI_TARGETS[b]);
    }
    setKpiTargets(merged);
  }, []);

  const handleSave = async () => {
    // Persist to localStorage
    localStorage.setItem(WEIGHTS_KEY, JSON.stringify(weights));
    localStorage.setItem(THRESH_KEY, JSON.stringify(thresholds));
    for (const b of ['ngajigaes', 'labbaika', 'alaika'] as BrandId[]) {
      localStorage.setItem(KPI_TARGETS_KEY(b), JSON.stringify(kpiTargets[b]));
    }

    // Also upsert KPI targets to Supabase if available
    if (isSupabaseAvailable) {
      for (const b of ['ngajigaes', 'labbaika', 'alaika'] as BrandId[]) {
        for (const t of kpiTargets[b]) {
          const kpiType = t.metric.toLowerCase().replace(/\s+/g, '_').replace('max_', '');
          await upsertKpiTarget(b, `brand_default_${b}`, kpiType, t.target);
        }
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setWeights(DEFAULT_WEIGHTS);
    setThresholds(DEFAULT_THRESHOLDS);
    setKpiTargets(DEFAULT_KPI_TARGETS);
  };

  const updateWeight = (brand: BrandId, idx: number, val: number) => {
    setWeights(prev => ({
      ...prev,
      [brand]: prev[brand].map((w, i) => i === idx ? { ...w, weight: val } : w),
    }));
  };

  const updateThreshold = (idx: number, val: number) => {
    setThresholds(prev => prev.map((t, i) => i === idx ? { ...t, value: val } : t));
  };

  const updateKpiTarget = (brand: BrandId, idx: number, val: number) => {
    setKpiTargets(prev => ({
      ...prev,
      [brand]: prev[brand].map((t, i) => i === idx ? { ...t, target: val } : t),
    }));
  };

  const isReadOnly = role !== 'admin';

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings size={20} className="text-text-muted" />
          <h1 className="text-lg font-bold text-text-primary font-display">Settings</h1>
          {isReadOnly && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-border text-text-muted text-xs">
              <Lock size={11} /> Read-only
            </div>
          )}
        </div>
        {!isReadOnly && (
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary hover:text-text-primary border border-border hover:border-border-light transition-colors">
              <RotateCcw size={12} /> Reset
            </button>
            <button onClick={handleSave} className={cn(
              'flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
              saved ? 'bg-success text-white' : 'bg-primary hover:bg-primary/90 text-white',
            )}>
              {saved ? <><Check size={14} /> Tersimpan!</> : <><Save size={14} /> Simpan</>}
            </button>
          </div>
        )}
      </div>

      {/* KPI Targets per brand */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">KPI Targets per Brand</h2>
          <p className="text-xs text-text-muted mt-0.5">Target ini dipakai untuk status indicator hijau/kuning/merah di dashboard</p>
        </div>
        <div className="p-4 space-y-5">
          {BRANDS.map(brand => (
            <div key={brand.id}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brand.color }} />
                <span className="text-xs font-semibold text-text-primary">{brand.name}</span>
              </div>
              <div className="space-y-2">
                {(kpiTargets[brand.id as BrandId] ?? []).map((t, idx) => (
                  <div key={t.metric} className="flex items-center gap-3">
                    <span className="text-xs text-text-secondary flex-1">{t.metric}</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={t.target}
                        disabled={isReadOnly}
                        onChange={e => updateKpiTarget(brand.id as BrandId, idx, Number(e.target.value))}
                        className={cn(
                          'w-24 px-2 py-1 text-xs border rounded text-text-primary text-right focus:outline-none focus:border-primary',
                          isReadOnly ? 'bg-card border-border/50 opacity-60 cursor-not-allowed' : 'bg-surface border-border',
                        )}
                      />
                      <span className="text-xs text-text-muted w-8">{t.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Winning Ad Scoring Weights */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">Winning Ad Scoring — Bobot Metrik</h2>
          <p className="text-xs text-text-muted mt-0.5">Total bobot per brand harus = 100%</p>
        </div>
        <div className="p-4 space-y-6">
          {BRANDS.map(brand => {
            const bWeights = weights[brand.id as BrandId] ?? [];
            const total = bWeights.reduce((s, w) => s + w.weight, 0);
            return (
              <div key={brand.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brand.color }} />
                    <span className="text-xs font-semibold text-text-primary">{brand.name}</span>
                  </div>
                  <span className={cn('text-xs font-mono', total === 100 ? 'text-success' : 'text-danger')}>
                    {total}%
                  </span>
                </div>
                <div className="space-y-2">
                  {bWeights.map((w, idx) => (
                    <div key={w.metric} className="flex items-center gap-4">
                      <span className="text-xs text-text-secondary w-36">{w.metric}</span>
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${w.weight}%`, backgroundColor: brand.color }} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number" min={0} max={100}
                          value={w.weight}
                          disabled={isReadOnly}
                          onChange={e => updateWeight(brand.id as BrandId, idx, Number(e.target.value))}
                          className={cn(
                            'w-16 px-2 py-1 text-xs border rounded text-text-primary text-right focus:outline-none focus:border-primary',
                            isReadOnly ? 'bg-card border-border/50 opacity-60 cursor-not-allowed' : 'bg-surface border-border',
                          )}
                        />
                        <span className="text-xs text-text-muted">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Alert Thresholds */}
      <section className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">Alert Thresholds</h2>
          <p className="text-xs text-text-muted mt-0.5">Nilai ambang batas yang memicu rule-based alerts</p>
        </div>
        <div className="p-4 space-y-3">
          {thresholds.map((item, idx) => (
            <div key={item.key} className="flex items-center gap-4">
              <span className="text-xs text-text-secondary flex-1">{item.label}</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={item.value}
                  disabled={isReadOnly}
                  onChange={e => updateThreshold(idx, Number(e.target.value))}
                  className={cn(
                    'w-20 px-2 py-1 text-xs border rounded text-text-primary text-right focus:outline-none focus:border-primary',
                    isReadOnly ? 'bg-card border-border/50 opacity-60 cursor-not-allowed' : 'bg-surface border-border',
                  )}
                />
                <span className="text-xs text-text-muted w-12">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Storage info */}
      <p className="text-[10px] text-text-muted text-center">
        {isSupabaseAvailable
          ? 'Settings disimpan ke localStorage + Supabase'
          : 'Settings disimpan ke localStorage. Sambungkan Supabase untuk sync lintas device.'}
      </p>
    </div>
  );
}
