import { create } from 'zustand';
import type { SimulationState } from '../types';

interface SimulationStore extends SimulationState {
    setCapacity: (v: number) => void;
    setBudget: (v: number) => void;
    toggleWeather: () => void;
    toggleTransport: () => void;
    reset: () => void;
}

const recalculate = (state: Pick<SimulationState, 'capacityModifier' | 'budgetModifier' | 'weatherDisruption' | 'transportDisruption'>): Partial<SimulationState> => {
    let riskDelta = 0;
    riskDelta -= state.capacityModifier * 0.5;
    riskDelta -= state.budgetModifier * 0.4;
    if (state.weatherDisruption) riskDelta += 18;
    if (state.transportDisruption) riskDelta += 12;

    const stress = Math.abs(riskDelta);
    const systemStress: SimulationState['systemStress'] =
        stress > 25 ? 'critical' : stress > 15 ? 'high' : stress > 8 ? 'moderate' : 'low';

    return {
        resultRiskChange: Math.round(riskDelta * 10) / 10,
        stabilityIndex: Math.max(0, Math.min(100, Math.round(85 - stress * 1.5))),
        systemStress,
        affectedSchools: Math.min(50, Math.floor(stress * 1.8)),
        projectedShortages: Math.max(0, Math.floor(riskDelta * 2.5)),
    };
};

const initial: SimulationState = {
    capacityModifier: 0,
    budgetModifier: 0,
    weatherDisruption: false,
    transportDisruption: false,
    resultRiskChange: 0,
    stabilityIndex: 85,
    systemStress: 'low',
    affectedSchools: 0,
    projectedShortages: 0,
};

export const useSimulationStore = create<SimulationStore>((set) => ({
    ...initial,
    setCapacity: (v) =>
        set((s) => {
            const next = { ...s, capacityModifier: v };
            return { ...next, ...recalculate(next) };
        }),
    setBudget: (v) =>
        set((s) => {
            const next = { ...s, budgetModifier: v };
            return { ...next, ...recalculate(next) };
        }),
    toggleWeather: () =>
        set((s) => {
            const next = { ...s, weatherDisruption: !s.weatherDisruption };
            return { ...next, ...recalculate(next) };
        }),
    toggleTransport: () =>
        set((s) => {
            const next = { ...s, transportDisruption: !s.transportDisruption };
            return { ...next, ...recalculate(next) };
        }),
    reset: () => set(initial),
}));
