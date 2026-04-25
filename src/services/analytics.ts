import { API_ROUTES } from "@/lib/api-routes";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const get = (path: string) => fetch(`${BASE}${path}`).then((r) => { if (!r.ok) throw new Error(r.statusText); return r.json(); });

// ── Types ────────────────────────────────────────────────────────────────────

interface MetricStats {
  mean: number;
  median: number;
  std: number;
}

export interface StrategyStats {
  strategy: string;
  experiment_count: number;
  result_count: number;
  faithfulness: MetricStats;
  answer_relevancy: MetricStats;
  context_precision: MetricStats;
  context_recall: MetricStats;
  answer_correctness: MetricStats;
  mrr: MetricStats;
}

export interface StrategiesResponse {
  strategies: StrategyStats[];
}

interface BoxStats {
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers: number[];
  n: number;
}

export interface DistributionsResponse {
  metrics: Record<string, Record<string, BoxStats>>;
}

export interface StatTestComparison {
  strategy_a: string;
  strategy_b: string;
  metric: string;
  n_pairs: number;
  median_a: number;
  median_b: number;
  statistic: number;
  p_value: number;
  p_corrected: number;
  effect_size_r: number;
  significant: boolean;
  winner: string | null;
}

export interface StatTestsResponse {
  comparisons: StatTestComparison[];
}

export interface RankingEntry {
  strategy: string;
  wins: number;
  metrics_won: string[];
  score: number;
}

export interface RankingsResponse {
  rankings: RankingEntry[];
  metric_leaders: Record<string, string>;
}

export interface TemporalExperiment {
  id: string;
  name: string;
  strategy: string;
  created_at: string;
  completed_at: string;
  result_count: number;
  avg_faithfulness: number;
  avg_answer_relevancy: number;
  avg_context_precision: number;
  avg_context_recall: number;
  avg_answer_correctness: number;
  avg_mrr: number;
}

export interface TemporalResponse {
  experiments: TemporalExperiment[];
}

// ── Fetchers ─────────────────────────────────────────────────────────────────

export const fetchStrategies   = (): Promise<StrategiesResponse>   => get(API_ROUTES.analytics.strategies);
export const fetchDistributions = (): Promise<DistributionsResponse> => get(API_ROUTES.analytics.distributions);
export const fetchStatTests    = (): Promise<StatTestsResponse>    => get(API_ROUTES.analytics.statisticalTests);
export const fetchRankings     = (): Promise<RankingsResponse>     => get(API_ROUTES.analytics.rankings);
export const fetchTemporal     = (): Promise<TemporalResponse>     => get(API_ROUTES.analytics.temporal);
