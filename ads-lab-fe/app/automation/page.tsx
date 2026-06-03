'use client';
import { useState } from 'react';
import { Zap, FileText, CheckCircle2, Clock, XCircle, Activity, RefreshCw, Sparkles, Copy, Check } from 'lucide-react';
import { AUTOMATION_LOGS, CREATIVE_ASSETS, COPY_ROWS, QUEUE_STATUS, BRANDS } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { TimeAgo } from '@/components/TimeAgo';
import type { AutomationLog, CreativeAsset, CopyRow, BrandId } from '@/lib/types';

const ACTION_LABELS: Record<string, string> = {
  pause: 'Pause', activate: 'Activate', scale_budget: 'Scale Budget',
  upload_creative: 'Upload Creative', create_ad_draft: 'Create Draft', generate_copy: 'Generate Copy',
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  done:       <CheckCircle2 size={13} className="text-success" />,
  queued:     <Clock size={13} className="text-warning" />,
  processing: <RefreshCw size={13} className="text-primary animate-spin" />,
  failed:     <XCircle size={13} className="text-danger" />,
  dry_run:    <Activity size={13} className="text-text-muted" />,
};

// 'AI Copy Generator' di-hold — provider API belum final
const TABS = ['Activity Feed', 'Creative Pool', 'Copy Management', 'Queue Status'] as const;
type Tab = typeof TABS[number];

// ─── AI Copy Generator types ──────────────────────────────────────────────────
interface CopyVariation {
  primary_text: string;
  headline: string;
  cta: string;
  angle: string;
}

interface GenerateResult {
  brand: string;
  generated_at: string;
  n_variations: number;
  variations: CopyVariation[];
}

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Activity Feed');
  const [dryRunMode, setDryRunMode] = useState(false);
  const [filterBrand, setFilterBrand] = useState<BrandId | 'ALL'>('ALL');

  const filteredLogs = AUTOMATION_LOGS.filter(l =>
    filterBrand === 'ALL' || l.brand === filterBrand,
  );

  return (
    <div className="space-y-5 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap size={20} className="text-primary" />
          <div>
            <h1 className="text-lg font-bold text-text-primary">Creative Automation — Phase 6</h1>
            <p className="text-xs text-text-muted">Otomasi creative rotation, copy management, dan ads ops</p>
          </div>
        </div>
        <button
          onClick={() => setDryRunMode(!dryRunMode)}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
            dryRunMode
              ? 'bg-warning-dim border-warning/30 text-warning'
              : 'bg-card border-border text-text-secondary hover:text-text-primary',
          )}
        >
          <Activity size={13} />
          {dryRunMode ? '🧪 Dry Run Mode ON' : 'Dry Run Mode'}
        </button>
      </div>

      {/* Queue Status Strip */}
      <div className="grid grid-cols-3 gap-3">
        {QUEUE_STATUS.map(q => {
          const brand = BRANDS.find(b => b.id === q.brand)!;
          return (
            <div key={q.brand} className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-4">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: brand.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary">{brand.name}</p>
                {q.isProcessing ? (
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: `${(q.processed / q.total) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-primary">{q.processed}/{q.total}</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {q.total === 0 ? 'Idle' : `${q.processed}/${q.total} selesai`}
                  </p>
                )}
              </div>
              {q.isProcessing && <RefreshCw size={12} className="text-primary animate-spin flex-shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 py-2 rounded-lg text-xs font-medium transition-all',
              activeTab === tab
                ? 'bg-border text-text-primary'
                : 'text-text-secondary hover:text-text-primary',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Brand Filter */}
      <div className="flex items-center gap-2">
        {(['ALL', 'ngajigaes', 'labbaika', 'alaika'] as const).map(b => {
          const brand = b !== 'ALL' ? BRANDS.find(br => br.id === b) : null;
          return (
            <button
              key={b}
              onClick={() => setFilterBrand(b)}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                filterBrand === b
                  ? 'text-white'
                  : 'text-text-secondary hover:text-text-primary bg-card border border-border',
              )}
              style={filterBrand === b ? { backgroundColor: brand?.color ?? '#6366F1' } : {}}
            >
              {b === 'ALL' ? 'Semua' : brand?.name}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'Activity Feed' && (
        <ActivityFeed logs={filteredLogs} />
      )}
      {activeTab === 'Creative Pool' && (
        <CreativePool assets={CREATIVE_ASSETS.filter(a => filterBrand === 'ALL' || a.brand === filterBrand)} />
      )}
      {activeTab === 'Copy Management' && (
        <CopyManagement rows={COPY_ROWS.filter(r => filterBrand === 'ALL' || r.brand === filterBrand)} />
      )}
      {/* AI Copy Generator di-hold — uncomment saat provider API sudah final */}
      {/* {activeTab === 'AI Copy Generator' && <AiCopyGenerator filterBrand={filterBrand} />} */}
      {activeTab === 'Queue Status' && (
        <div className="bg-card border border-border rounded-xl p-6 text-center text-text-muted text-sm">
          Queue detail — akan tersedia saat BE Phase 6 selesai
        </div>
      )}
    </div>
  );
}

// ─── Activity Feed ─────────────────────────────────────────────────────────────
function ActivityFeed({ logs }: { logs: AutomationLog[] }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="divide-y divide-border">
        {logs.map(log => (
          <div key={log.id} className="flex items-start gap-4 px-4 py-3 hover:bg-surface/30 transition-colors">
            <div className="mt-0.5">{STATUS_ICON[log.status]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-border text-text-muted font-mono uppercase">
                  {ACTION_LABELS[log.actionType]}
                </span>
                <span className="text-xs font-medium text-text-primary truncate">{log.targetName}</span>
              </div>
              <p className="text-[11px] text-text-secondary mt-0.5">{log.description}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <span className={cn(
                'text-[10px] font-medium px-1.5 py-0.5 rounded',
                log.status === 'done'       && 'text-success bg-success-dim',
                log.status === 'queued'     && 'text-warning bg-warning-dim',
                log.status === 'processing' && 'text-primary bg-primary-dim',
                log.status === 'failed'     && 'text-danger bg-danger-dim',
              )}>
                {log.status}
              </span>
              <TimeAgo timestamp={log.timestamp} className="text-[10px] text-text-muted mt-1 block" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Creative Pool ─────────────────────────────────────────────────────────────
function CreativePool({ assets }: { assets: CreativeAsset[] }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <p className="text-xs text-text-muted">
          File dari Google Drive. Pending = belum upload · Uploaded = sudah di Meta · Archived = tidak dipakai
        </p>
      </div>
      <div className="divide-y divide-border">
        {assets.map(a => (
          <div key={a.id} className="flex items-center gap-4 px-4 py-3 hover:bg-surface/30 transition-colors">
            <div className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-lg',
              a.fileType === 'video' ? 'bg-primary-dim' : 'bg-success-dim',
            )}>
              {a.fileType === 'video' ? '🎬' : '🖼️'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">{a.fileName}</p>
              {a.adId && <p className="text-[10px] text-text-muted mt-0.5">Meta Ad ID: {a.adId}</p>}
            </div>
            <span className={cn(
              'text-[10px] px-2 py-0.5 rounded font-medium',
              a.status === 'pending'  && 'bg-warning-dim text-warning',
              a.status === 'uploaded' && 'bg-success-dim text-success',
              a.status === 'archived' && 'bg-border text-text-muted',
            )}>
              {a.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Copy Management ──────────────────────────────────────────────────────────
function CopyManagement({ rows }: { rows: CopyRow[] }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <p className="text-xs text-text-muted">Copy dari Google Sheets. Baris status 'pending' akan diproses oleh sistem.</p>
      </div>
      <div className="divide-y divide-border">
        {rows.map(r => (
          <div key={r.id} className="px-4 py-3 hover:bg-surface/30 transition-colors">
            <div className="flex items-center gap-3 mb-1">
              <span className={cn(
                'text-[10px] px-2 py-0.5 rounded font-semibold uppercase',
                r.funnelStage === 'TOFU' && 'bg-primary-dim text-primary',
                r.funnelStage === 'MOFU' && 'bg-warning-dim text-warning',
                r.funnelStage === 'BOFU' && 'bg-success-dim text-success',
              )}>
                {r.funnelStage}
              </span>
              <span className="text-xs font-semibold text-text-primary truncate">{r.headline}</span>
              <span className={cn(
                'ml-auto text-[10px] px-2 py-0.5 rounded font-medium flex-shrink-0',
                r.status === 'pending'   && 'bg-warning-dim text-warning',
                r.status === 'published' && 'bg-success-dim text-success',
                r.status === 'rejected'  && 'bg-danger-dim text-danger',
              )}>
                {r.status}
              </span>
            </div>
            <p className="text-[11px] text-text-secondary line-clamp-2">{r.primaryText}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[10px] text-text-muted">CTA: {r.cta}</span>
              {r.adId && <span className="text-[10px] text-success">Ad: {r.adId}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI Copy Generator ────────────────────────────────────────────────────────
function AiCopyGenerator({ filterBrand }: { filterBrand: BrandId | 'ALL' }) {
  const [brand, setBrand]             = useState<BrandId>(filterBrand !== 'ALL' ? filterBrand : 'ngajigaes');
  const [nVariations, setNVariations] = useState(3);
  const [isLoading, setIsLoading]     = useState(false);
  const [result, setResult]           = useState<GenerateResult | null>(null);
  const [error, setError]             = useState<string | null>(null);
  const [copied, setCopied]           = useState<string | null>(null);

  const netlifyUrl = process.env.NEXT_PUBLIC_NETLIFY_URL ?? '';
  const canGenerate = !!netlifyUrl;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setIsLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch(`${netlifyUrl}/.netlify/functions/generate-copy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand, n_variations: nVariations, top_ads: [] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Terjadi kesalahan');
      setResult(data as GenerateResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal generate copy');
    } finally {
      setIsLoading(false);
    }
  };

  const copyText = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id); setTimeout(() => setCopied(null), 1500);
  };
  const formatVar = (v: CopyVariation) =>
    `Primary Text:\n${v.primary_text}\n\nHeadline:\n${v.headline}\n\nCTA:\n${v.cta}`;

  return (
    <div className="space-y-5">
      {/* Config panel */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-primary" />
          <h2 className="text-sm font-semibold text-text-primary font-display">AI Copy Generator</h2>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary-dim text-primary border border-primary/20">Claude Haiku</span>
        </div>
        <p className="text-xs text-text-muted">Generate variasi copy iklan Meta Ads per brand. Setiap variasi punya angle berbeda untuk A/B test.</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[11px] text-text-muted uppercase tracking-wider font-medium">Brand</label>
            <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
              {BRANDS.map(b => (
                <button key={b.id} onClick={() => setBrand(b.id as BrandId)}
                  className={cn('flex-1 py-1.5 rounded-md text-xs font-medium transition-all',
                    brand === b.id ? 'text-white' : 'text-text-secondary hover:text-text-primary')}
                  style={brand === b.id ? { backgroundColor: b.color } : {}}>
                  {b.name}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] text-text-muted uppercase tracking-wider font-medium">Jumlah Variasi</label>
            <div className="flex items-center gap-2">
              {[2, 3, 4, 5].map(n => (
                <button key={n} onClick={() => setNVariations(n)}
                  className={cn('w-9 h-9 rounded-lg text-sm font-semibold transition-all border',
                    nVariations === n ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-text-secondary hover:text-text-primary')}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!canGenerate && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning-dim border border-warning/20 text-warning text-xs">
            ⚠️ Set <code className="font-mono mx-1">NEXT_PUBLIC_NETLIFY_URL</code> di .env.local dan <code className="font-mono mx-1">ANTHROPIC_API_KEY</code> di Netlify env vars.
          </div>
        )}

        <button onClick={handleGenerate} disabled={isLoading || !canGenerate}
          className={cn('flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
            isLoading ? 'bg-primary/60 text-white cursor-wait' : 'bg-primary hover:bg-primary/90 text-white',
            !canGenerate && 'opacity-40 cursor-not-allowed')}>
          {isLoading
            ? <><RefreshCw size={14} className="animate-spin" /> Generating...</>
            : <><Sparkles size={14} /> Generate {nVariations} Variasi Copy</>}
        </button>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-danger-dim border border-danger/20 text-danger text-sm">{error}</div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs text-text-muted">
              {result.n_variations} variasi · <span className="text-text-primary font-medium">{result.brand}</span>
              {' · '}{new Date(result.generated_at).toLocaleTimeString('id-ID')}
            </p>
            <button onClick={() => copyText(result.variations.map((v, i) => `--- Variasi ${i+1} (${v.angle}) ---\n${formatVar(v)}`).join('\n\n'), 'all')}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors">
              {copied === 'all' ? <Check size={12} className="text-success" /> : <Copy size={12} />} Copy semua
            </button>
          </div>

          {result.variations.map((v, i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden hover:border-border-light transition-colors">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface/40">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center">{i+1}</span>
                  <span className="text-xs font-semibold text-text-primary capitalize">{v.angle}</span>
                </div>
                <button onClick={() => copyText(formatVar(v), `v-${i}`)}
                  className="flex items-center gap-1 text-[11px] text-text-muted hover:text-text-primary px-2 py-1 rounded hover:bg-border transition-colors">
                  {copied === `v-${i}` ? <><Check size={11} className="text-success" /> Copied!</> : <><Copy size={11} /> Copy</>}
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Primary Text</p>
                  <p className="text-sm text-text-primary leading-relaxed">{v.primary_text}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Headline</p>
                    <p className="text-sm font-semibold text-text-primary">{v.headline}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">CTA</p>
                    <span className="inline-flex px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20">{v.cta}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <p className="text-[11px] text-text-muted text-center pt-1">
            Default status: PAUSED — review dulu sebelum publish ke Meta Ads Manager
          </p>
        </div>
      )}
    </div>
  );
}
