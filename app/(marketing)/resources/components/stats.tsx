"use client";

import React, { useEffect, useMemo, useState, memo, useCallback } from "react";
import { getResourcesStats } from "../../../api/marketing/resources";

type StatItem = {
  id?: string;
  value: number | string; // numeric values will animate, strings render as-is
  label: string;
  prefix?: string; // e.g. "$"
  suffix?: string; // e.g. "M"
};

const defaultStats: StatItem[] = [
  { id: "s1", value: 3214, label: "Accelerators" },
  { id: "s2", value: 34, label: "Countries" },
  { id: "s3", value: 1000000, label: "Total Grants", prefix: "$" },
  { id: "s4", value: 500000, label: "Prize Money", prefix: "$" },
];

function formatNumber(n: number) {
  return Number.isFinite(n) ? n.toLocaleString() : String(n);
}

// Scale a large number down to a compact representation
// return the scaled numeric value and the suffix (K, M, B)
function scaleNumber(value: number) {
  if (!Number.isFinite(value)) return { scaled: value, suffix: "" };
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return { scaled: +(value / 1_000_000_000).toFixed(1), suffix: "B" };
  }
  if (abs >= 1_000_000) {
    return { scaled: +(value / 1_000_000).toFixed(1), suffix: "M" };
  }
  if (abs >= 1_000) {
    return { scaled: +(value / 1_000).toFixed(1), suffix: "K" };
  }
  return { scaled: value, suffix: "" };
}

const CountUp: React.FC<{ end: number; duration?: number; format?: (v: number) => string }> = ({
  end,
  duration = 1000,
  format = formatNumber,
}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const diff = end - start;
    if (diff === 0) {
      setValue(end);
      return;
    }
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const current = start + diff * progress;
      setValue(current);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [end, duration]);

  return <span>{format(value)}</span>;
};

// Memoize CountUp component
const MemoizedCountUp = memo(CountUp);

const Stats: React.FC<{ stats?: StatItem[] }> = ({ stats = defaultStats }) => {
  const [apiStats, setApiStats] = useState<StatItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalResources, setTotalResources] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getResourcesStats();


        // Map API response to StatItem format
        // NOTE: If your backend returns amounts in millions (e.g., '100' meaning 100M),
        // multiply by 1_000_000 here: e.g. data.TotalGrantsAmount * 1_000_000.
        const mappedStats: StatItem[] = [
          { id: "s1", value: data.TotalAccelerators, label: "Accelerators" },
          { id: "s2", value: data.TotalCountries, label: "Countries" },
          { id: "s3", value: data.TotalGrantsAmount , label: "Total Grants", prefix: "$" },
          { id: "s4", value: data.TotalPrizeAmount, label: "Prize Money", prefix: "$" },
     
        ];

        setTotalResources(data.TotalResources);

        setApiStats(mappedStats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fall back to default stats on error
        setApiStats(defaultStats);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);


  const prepared = useMemo(() => {
    const currentStats = apiStats || stats;
    return currentStats.map((s, i) => ({ ...s, id: s.id ?? `stat-${i}` }));
  }, [apiStats, stats]);

  if (loading) {
    return (
      <section className="py-8 md:py-12 md:mt-12 mt-8">
        <div className="max-w-2xl mx-auto mr-0 md:mr-40 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl text-gray-200 flex flex-col items-center tracking-wider font-[450] ">
            {/* add the shimer */}
              <span className="shimmer"></span>
            Resources to Discover</h1>
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4">
            {prepared.map(({ id, label }) => (
              <div
                key={id}
                className="flex flex-col items-center justify-center bg-[#101828] md:bg-[#F5F8FF1A] border border-[#ced9f1] rounded-lg p-2 px-6 backdrop-blur-[2px]"
                style={{
                  boxShadow: `
                    0px 3px 8px 3px #3535350D,
                    0px 2px 10px 5px #3535350D inset,
                    0px 0px 14px 0px #FFFFFF0D inset,
                    1px 3px 5px 0px #FFFFFF59 inset,
                    0px -3px 3px 0px #FFFFFF0D inset
                    `
                }}
                role="region"
                aria-labelledby={`${id}-label`}
              >
                <div className="text-2xl md:text-3xl font-medium text-white md:text-gray-900">
                  <span className="shimmer"></span>
                </div>
                <div id={`${id}-label`} className="mt-2 text-sm text-white md:text-gray-600">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12   md:mt-4 mt-8">
      <div className="max-w-3xl  mx-auto mr-0  px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl text-gray-950/50 tracking-wider text-center font-[450] ">{totalResources} Resources to Discover</h1>
        <div className="grid grid-cols-2 md:w-full  md:flex md:flex-wrap md:gap-4">
          {prepared.map(({ id, value, label, prefix, suffix }) => {
            const isNumber = typeof value === "number";
            return (
              <div
                key={id}
                className="flex flex-col items-center justify-center bg-[#101828] md:bg-[#F5F8FF1A] border border-[#ced9f1] rounded-lg p-2 px-6 backdrop-blur-[2px]"
                style={{
                  boxShadow: `
                    0px 3px 8px 3px #3535350D,
                    0px 2px 10px 5px #3535350D inset,
                    0px 0px 14px 0px #FFFFFF0D inset,
                    1px 3px 5px 0px #FFFFFF59 inset,
                    0px -3px 3px 0px #FFFFFF0D inset
                    `
                }}
                role="region"
                aria-labelledby={`${id}-label`}
              >
                <div className="text-2xl md:text-[32px] font-medium text-white md:text-gray-900">
                  {isNumber ? (
                    <>
                      {prefix && <span className="mr-1">{prefix}</span>}
                      <span aria-live="polite" aria-atomic="true" className="inline-block">
                        {/* If currency, scale to K/M/B and show suffix */}
                        {prefix ? (
                          (() => {
                            const val = Number(value as number);
                            const { scaled, suffix: scaleSuffix } = scaleNumber(val);
                            return (
                              <>
                                <MemoizedCountUp
                                  end={scaled}
                                  duration={1200}
                                  format={(v) => (Number.isFinite(v) ? (Number(v).toLocaleString(undefined, { maximumFractionDigits: 1 })) : String(v))}
                                />
                                {scaleSuffix && <span className="ml-1">{scaleSuffix}</span>}
                              </>
                            );
                          })()
                        ) : (
                            <MemoizedCountUp end={value as number} duration={1200} />
                        )}
                      </span>
                    </>
                  ) : (
                    <span>
                      {prefix}
                      {value}
                      {suffix}
                    </span>
                  )}
                </div>
                <div id={`${id}-label`} className="mt-2 text-sm text-white md:text-gray-600">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(Stats);
