'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

export default function StatsSection({ businessCounter, advocatesCounter }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Counter States
    const [displayBusinesses, setDisplayBusinesses] = useState(0);
    const [displayAdvocates, setDisplayAdvocates] = useState(0);
    const [displayAdvocatesToday, setDisplayAdvocatesToday] = useState(0);

    const { ref, hasIntersected } = useIntersectionObserver({ threshold: 0.2 });
    const animatedRef = useRef(false);

    useEffect(() => {
        async function loadStats() {
            try {
                const res = await fetch('/api/marketing/stats'); 
                const data = await res.json();
                setStats(data?.Result ?? null);
            } catch (err) {
                setStats(null);
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    useEffect(() => {
        if (!hasIntersected || loading || animatedRef.current) return;
        animatedRef.current = true;

        const targets = {
            biz: (stats?.totalBlackOwnedBusinesses ?? 1482) + (businessCounter || 0),
            adv: (stats?.totalAdvocates ?? 100) + (advocatesCounter || 0),
            today: (stats?.totalTodayAdvocates ?? 17) + 7
        };

        let start: number;
        const duration = 2000; 

        const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);

            // Easing function: outExpo for premium feel
            const easeOut = 1 - Math.pow(2, -10 * progress);

            setDisplayBusinesses(Math.floor(easeOut * targets.biz));
            setDisplayAdvocates(Math.floor(easeOut * targets.adv));
            setDisplayAdvocatesToday(Math.floor(easeOut * targets.today));

            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [hasIntersected, loading, stats, businessCounter, advocatesCounter]);

    return (
        <section ref={ref} className="max-w-6xl mx-auto px-6 py-10 md:py-16" aria-label="Orisuun community statistics">
            <h2 className="sr-only">Community Statistics</h2>
            <div className="bg-[#F1F4FB] rounded-3xl  shadow-sm">

                <svg width="124" height="31" viewBox="0 0 124 31" className="w-full mx-auto" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M65.149 29.1876C62.8854 30.3277 60.2155 30.3277 57.9519 29.1876L-0.000656128 0L123.102 0L65.149 29.1876Z" fill="white" />
                </svg>

                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#C2C4C8] pb-6">
                    {/* Stat Item Wrapper for consistent spacing */}
                    <div className="stat-card">
                        <h3 className="stat-number">
                            {loading ? '...' : `${displayBusinesses.toLocaleString()}+`}
                        </h3>
                        <p className="stat-label">Black-Owned Businesses Registered</p>
                    </div>

                    <div className="stat-card">
                        <h3 className="stat-number">
                            {loading ? '...' : `${displayAdvocates.toLocaleString()} (+${(displayAdvocatesToday + 7).toLocaleString()} Today)`}
                        </h3>
                        <p className="stat-label">Supporters (Like You)</p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .stat-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 3rem 1.5rem;
                    text-align: center;
                }
                .stat-number {
                    font-size: clamp(2rem, 5vw, 3.5rem);
                    font-weight: 700;
                    color: #2357C6;
                    font-variant-numeric: tabular-nums; /* CLS Fix */
                }
                .stat-label {
                    font-size: 1.25rem;
                    color: #001E5F;
                    margin-top: 0.5rem;
                }
            `}</style>
        </section>
    );
}