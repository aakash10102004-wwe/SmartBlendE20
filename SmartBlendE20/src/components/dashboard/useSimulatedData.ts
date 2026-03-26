import { useState, useEffect, useRef, useCallback } from 'react';

/* ── Types ── */
export interface SimulatedData {
  ethanol: number;       // 70–100 %
  water: number;         // 0–5 %
  temperature: number;   // 25–40 °C
  efficiency: number;    // calculated 0–100
  mileage: number;       // km/l (derived)
  engineHealth: number;  // 0–100
  fuelSaved: number;     // ₹ this month
  waterRemoval: number;  // % filtered
  impurities: number;    // % filtered
  contaminants: number;  // % blocked
}

/* ── Helpers ── */

/** Clamp a value between min and max */
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/** random float in [min, max] */
const rand = (min: number, max: number) =>
  min + Math.random() * (max - min);

/** Smoothly drift a current value toward a random target within bounds.
 *  maxStep controls how much it can move each tick (small = smoother). */
const drift = (
  current: number,
  min: number,
  max: number,
  maxStep: number,
) => {
  const target = rand(min, max);
  const delta = target - current;
  const step = clamp(delta, -maxStep, maxStep);
  return clamp(current, min, max) + step;
};

/** Derive efficiency from ethanol, water, and temperature.
 *  Higher ethanol → better; lower water → better; moderate temp → best. */
const calcEfficiency = (eth: number, water: number, temp: number) => {
  const ethScore = ((eth - 70) / 30) * 40;              // 0–40 pts
  const waterScore = ((5 - water) / 5) * 30;            // 0–30 pts
  const tempOptimal = 32;
  const tempScore = (1 - Math.abs(temp - tempOptimal) / 15) * 30; // 0–30 pts
  return Math.round(clamp(ethScore + waterScore + tempScore, 0, 100));
};

/* ── Initial seed ── */
const INITIAL: SimulatedData = {
  ethanol: 85,
  water: 2.1,
  temperature: 32,
  efficiency: 87,
  mileage: 18.4,
  engineHealth: 94,
  fuelSaved: 2400,
  waterRemoval: 96,
  impurities: 89,
  contaminants: 94,
};

/* ── Hook ── */
export function useSimulatedData(intervalMs = 2000): SimulatedData {
  const [data, setData] = useState<SimulatedData>(INITIAL);
  const prev = useRef<SimulatedData>(INITIAL);

  const tick = useCallback(() => {
    const p = prev.current;

    const ethanol    = +drift(p.ethanol,     70, 100, 2.5).toFixed(1);
    const water      = +drift(p.water,       0,  5,   0.4).toFixed(2);
    const temperature = +drift(p.temperature, 25, 40,  1.2).toFixed(1);
    const efficiency = calcEfficiency(ethanol, water, temperature);

    // Derived metrics with slight random jitter
    const mileage      = +clamp(14 + (efficiency / 100) * 8 + rand(-0.3, 0.3), 14, 22).toFixed(1);
    const engineHealth  = Math.round(clamp(p.engineHealth + rand(-1.5, 1.5), 80, 100));
    const fuelSaved     = Math.round(clamp(p.fuelSaved + rand(-60, 80), 1800, 3200));
    const waterRemoval  = Math.round(clamp(p.waterRemoval + rand(-1, 1), 90, 99));
    const impurities    = Math.round(clamp(p.impurities + rand(-1.2, 1.2), 82, 96));
    const contaminants  = Math.round(clamp(p.contaminants + rand(-1, 1), 88, 99));

    const next: SimulatedData = {
      ethanol,
      water,
      temperature,
      efficiency,
      mileage,
      engineHealth,
      fuelSaved,
      waterRemoval,
      impurities,
      contaminants,
    };

    prev.current = next;
    setData(next);
  }, []);

  useEffect(() => {
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [tick, intervalMs]);

  return data;
}
