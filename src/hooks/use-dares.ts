import { useState, useEffect } from 'react';
import type { Challenge } from '@/app/actions/generate-dare';

// Extend Challenge with an ID and status if needed, or just store arrays
// We'll wrap the Challenge type to include a unique ID (timestamp could work for simple local apps)
export interface StoredDare extends Challenge {
    id: number;
    completedAt?: string;
    acceptedAt: string;
}

export function useDares() {
    const [ongoingDares, setOngoingDares] = useState<StoredDare[]>([]);
    const [completedDares, setCompletedDares] = useState<StoredDare[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const savedOngoing = localStorage.getItem('ongoingDares');
        const savedCompleted = localStorage.getItem('completedDares');

        if (savedOngoing) setOngoingDares(JSON.parse(savedOngoing));
        if (savedCompleted) setCompletedDares(JSON.parse(savedCompleted));
        setIsLoaded(true);
    }, []);

    // Save to local storage whenever state changes
    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('ongoingDares', JSON.stringify(ongoingDares));
    }, [ongoingDares, isLoaded]);

    useEffect(() => {
        if (!isLoaded) return;
        localStorage.setItem('completedDares', JSON.stringify(completedDares));
    }, [completedDares, isLoaded]);

    const addDare = (challenge: Challenge) => {
        const newDare: StoredDare = {
            ...challenge,
            id: Date.now(),
            acceptedAt: new Date().toISOString(),
        };
        setOngoingDares((prev) => [newDare, ...prev]);
    };

    const completeDare = (dareId: number) => {
        const dare = ongoingDares.find((d) => d.id === dareId);
        if (!dare) return;

        const completedDare: StoredDare = { ...dare, completedAt: new Date().toISOString() };

        setOngoingDares((prev) => prev.filter((d) => d.id !== dareId));
        setCompletedDares((prev) => [completedDare, ...prev]);
    };

    const deleteDare = (dareId: number, isCompleted: boolean) => {
        if (isCompleted) {
            setCompletedDares(prev => prev.filter(d => d.id !== dareId));
        } else {
            setOngoingDares(prev => prev.filter(d => d.id !== dareId));
        }
    }

    return {
        ongoingDares,
        completedDares,
        addDare,
        completeDare,
        deleteDare,
        isLoaded
    };
}
