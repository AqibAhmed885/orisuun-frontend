"use client";

import { AccordianSkeletonList } from "@/components/feed-card-skeleton/accordianSkeleton";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  getWeeklyEntryRules,
  type WeeklyEntryRule,
} from "../../../../../api/dashboard/dashboard";

interface ActivityGoal {
  key: string;
  title: string;
  shortTitle: string;
  description: string;
  entriesAwarded: number;
  earnedCount: number;
  route?: string;
  aliases: string[];
  maxPerDay?: number | null;
  maxPerWeek?: number | null;
  requiresContext?: boolean;
  ruleId?: number;
}

interface WeeklyMeta {
  previousCycleAverage: number | null;
  rank: number | null;
  startOfWeek: string | null;
  endOfWeek: string | null;
}

interface WeeklyEntryRuleProgress {
  RuleId: number;
  RuleName?: string;
  RuleType?: string;
  EntriesEarned: number;
  TransactionsCount: number;
}

type ActivityUiConfig = {
  shortTitle: string;
  route?: string;
  aliases?: string[];
};

const ACTION_TYPE_UI_CONFIG: Record<string, ActivityUiConfig> = {
  BUSINESS_OPPORTUNITY_MATCHED: {
    shortTitle: "Matched",
    route: "/business-development",
    aliases: ["BusinessOpportunityMatched", "OpportunityMatched"],
  },
  CAMPAIGN_CONTRIBUTION: {
    shortTitle: "Campaign",
    route: "/fundraising",
    aliases: ["FundraisingCampaignContribution", "FundraisingContribution"],
  },
  COMMUNITY_PARTICIPATION: {
    shortTitle: "Com Chat",
    aliases: ["CommunityChat", "CommunityChats", "CommunityParticipation"],
  },
  CREATE_COMMUNITY: {
    shortTitle: "Community",
    route: "/communities",
    aliases: ["StartCommunity", "CommunityStarted"],
  },
  DISCOUNT_REDEEMED_BY_OTHER: {
    shortTitle: "Redeemed",
    aliases: ["DiscountRedeemedByAnotherMember", "DiscountRedeemed"],
  },
  GROUP_CHAT: {
    shortTitle: "Group Chat",
    aliases: ["GroupChat"],
  },
  JOIN_COMMUNITY: {
    shortTitle: "Join",
    route: "/communities",
    aliases: ["JoinCommunity"],
  },
  LAUNCH_CAMPAIGN: {
    shortTitle: "Launch",
    route: "/fundraising",
    aliases: ["LaunchCampaign", "CampaignLaunched"],
  },
  OFFER_DISCOUNT: {
    shortTitle: "Offer",
    route: "/discount-portal",
    aliases: ["OfferDiscount", "DiscountOffered"],
  },
  ONE_ON_ONE_CHAT: {
    shortTitle: "Chat",
    route: "/chats",
    aliases: ["ChatsCount", "OneOnOneChat", "OneOnOneChats"],
  },
  POST_BUSINESS_OPPORTUNITY: {
    shortTitle: "Opp Post",
    route: "/business-development",
    aliases: ["PostOpportunity", "OpportunityPosted"],
  },
  REDEEM_DISCOUNT: {
    shortTitle: "Redeem",
    route: "/discount-portal",
    aliases: ["DiscountsAvailed", "RedeemDiscount"],
  },
  SAVE_FAVOURITE: {
    shortTitle: "Save",
    aliases: ["SaveSomething", "SavedItem", "SaveCount"],
  },
  UNIVERSAL_CHAT: {
    shortTitle: "Universal",
    aliases: ["UniversalChat", "UniversalChats"],
  },
  WRITE_REVIEW: {
    shortTitle: "Review",
    route: "/profile-search/search-results?searchQuery=&city=&profileType=1",
    aliases: ["ReviewsGiven", "WriteReview", "ReviewWritten"],
  },
};

const buildGoalsFromRules = (rules: WeeklyEntryRule[]): ActivityGoal[] =>
  rules
    .filter((rule) => rule.ActionType !== "ONE_COMPULSORY")
    .map((rule) => {
      const config = ACTION_TYPE_UI_CONFIG[rule.ActionType] || {
        shortTitle: rule.ActionName,
        aliases: [],
      };

      return {
        key: rule.ActionType,
        title: rule.ActionName,
        shortTitle: config.shortTitle,
        description: rule.Description,
        entriesAwarded: rule.EntriesAwarded,
        earnedCount: 0,
        route: config.route,
        aliases: [rule.ActionType, ...(config.aliases || [])],
        maxPerDay: rule.MaxPerDay,
        maxPerWeek: rule.MaxPerWeek,
        requiresContext: rule.RequiresContext,
        ruleId: (rule as any).Id,
      };
    });

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const formatWeekRange = (start?: string | null, end?: string | null) => {
  if (start && end) {
    const weekEnd = moment.utc(end);
    const weekStart = weekEnd.clone().subtract(6, "days");

    return `${weekStart.format("MMM DD")} - ${weekEnd.format("MMM DD")}`;
  }

  return "Current week";
};

const getNumericValue = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const sortGoals = (goals: ActivityGoal[]) =>
  [...goals].sort((left, right) => {
    const leftEarned = left.earnedCount > 0;
    const rightEarned = right.earnedCount > 0;

    if (leftEarned !== rightEarned) {
      return leftEarned ? -1 : 1;
    }

    if (right.earnedCount !== left.earnedCount) {
      return right.earnedCount - left.earnedCount;
    }

    if (right.entriesAwarded !== left.entriesAwarded) {
      return right.entriesAwarded - left.entriesAwarded;
    }

    return left.title.localeCompare(right.title);
  });

const TRACK_ARC_PATH =
  "M10.6008 63.9528C6.19305 58.3336 3.45807 51.586 2.70938 44.4837C1.9607 37.3813 3.22862 30.2118 6.36777 23.797C9.50693 17.3822 14.3902 11.9819 20.4578 8.21515C26.5254 4.44844 33.5317 2.46783 40.6733 2.50039C47.8149 2.53296 54.8028 4.57739 60.8358 8.39928C66.8688 12.2212 71.7026 17.6658 74.7831 24.109C77.8637 30.5521 79.0661 37.7329 78.2527 44.8281C77.4393 51.9234 74.6429 58.6457 70.1841 64.2245";

const getGoalDetailText = (goal: ActivityGoal) => {
  const descriptionMap: Record<string, string> = {
    FundraisingCampaignContribution:
      "Make a contribution to a fundraising campaign.",
    DiscountRedeemedByAnotherMember:
      "Get your offered discount redeemed by another member.",
    BusinessOpportunityMatched:
      "Have your posted opportunity matched by another member.",
    PostOpportunity: "Create and post a new business opportunity.",
    OfferDiscount: "Create and publish a discount for other members.",
    LaunchCampaign: "Launch a new fundraising campaign.",
    ChatsCount: "Start or continue one-on-one conversations.",
    StartCommunity: "Create a new community for members.",
    DiscountsAvailed: "Redeem an available member discount.",
    CommunityChat: "Participate in your community conversations.",
    ReviewsGiven: "Write a review for a member interaction.",
    UniversalChat: "Participate in the universal chat room.",
    FollowMember: "Follow another member profile.",
    SaveSomething: "Save relevant content, profiles, or opportunities.",
  };

  const limits: string[] = [];
  if (goal.maxPerDay) {
    limits.push(`max ${goal.maxPerDay}/day`);
  }
  if (goal.maxPerWeek) {
    limits.push(`max ${goal.maxPerWeek}/week`);
  }

  return {
    description:
      goal.description ||
      descriptionMap[goal.key] ||
      "Complete this activity to earn giveaway entries.",
    notes: `Each completion earns an additional ${goal.entriesAwarded} ${goal.entriesAwarded === 1 ? "entry" : "entries"}${limits.length ? ` (${limits.join(", ")})` : ""}.`,
  };
};

const WeeklyActivityGoals: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showAllGoals, setShowAllGoals] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [goals, setGoals] = useState<ActivityGoal[]>([]);
  // Displayed in the center exactly as returned by TotalEntriesInCycle.
  const [totalEntries, setTotalEntries] = useState<number>(0);

  // Calculated from EntriesByRule and retained for activity-entry bookkeeping.
  // The arc comparison itself uses backend TotalEntriesInCycle.
  const [currentWeekCalculatedEntries, setCurrentWeekCalculatedEntries] =
    useState<number>(0);

  const [weeklyMeta, setWeeklyMeta] = useState<WeeklyMeta>({
    previousCycleAverage: null,
    rank: null,
    startOfWeek: null,
    endOfWeek: null,
  });
  const [averageMarkerPoint, setAverageMarkerPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [arcLength, setArcLength] = useState<number>(0);
  const markerPathRef = useRef<SVGPathElement | null>(null);
  const gradientId = useId();
  const progressGradientId = useMemo(
    () =>
      `weekly-progress-gradient-${gradientId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [gradientId],
  );
  const markerGradientId = useMemo(
    () => `weekly-marker-gradient-${gradientId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [gradientId],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const storedUser = localStorage.getItem("userData");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    } catch {
      setUser(null);
    }
  }, []);

  const currentGoals = useMemo(() => sortGoals(goals), [goals]);

  const previousCycleAverage = Math.max(
    weeklyMeta.previousCycleAverage ?? 0,
    0,
  );

  // Compare the current user's backend TotalEntriesInCycle with the
  // previous cycle's average entries per participant.
  const comparisonTarget = previousCycleAverage;

  // Keep the displayed percentage unclamped.
  // Example: current 8 / previous average 4 = 200%.
  const currentWeekComparisonPercentage =
    comparisonTarget > 0
      ? Math.round((totalEntries / comparisonTarget) * 100)
      : 0;

  // Left side stays permanently filled at 50%.
  // On the right side:
  // 100% performance = +10% of the total arc
  // 200% performance = +20%
  // ...
  // 500% performance = +50% (full right side)
  const rightSideProgress = clamp(
    currentWeekComparisonPercentage / 10,
    0,
    50,
  );

  const combinedArcPercentage = 50 + rightSideProgress;

  const weekRangeLabel = formatWeekRange(
    weeklyMeta.startOfWeek,
    weeklyMeta.endOfWeek,
  );
  const visibleGoals = showAllGoals ? currentGoals : currentGoals.slice(0, 6);

  const handleGoalClick = (goal: ActivityGoal) => {
    if (goal.route) {
      router.push(goal.route);
    }
  };

  useEffect(() => {
    const markerPath = markerPathRef.current;
    if (!markerPath) {
      return;
    }

    const totalLength = markerPath.getTotalLength();
    setArcLength(totalLength);
    // The arc midpoint separates last week's full left half from the current week.
    const pointAtAverage = markerPath.getPointAtLength(totalLength * 0.5);
    setAverageMarkerPoint({
      x: pointAtAverage.x,
      y: pointAtAverage.y,
    });
  }, []);

  useEffect(() => {
    if (!user?.Id) {
      return;
    }

    const fetchGoals = async () => {
      setLoading(true);
      const currentDate = moment().format("MM/DD/YYYY");
      const entryRulesResult = await getWeeklyEntryRules(user.Id, currentDate);

      if (!entryRulesResult?.success || !entryRulesResult?.data) {
        setGoals([]);
        setTotalEntries(0);
        setCurrentWeekCalculatedEntries(0);
        setWeeklyMeta({
          previousCycleAverage: null,
          rank: null,
          startOfWeek: null,
          endOfWeek: null,
        });
        setLoading(false);
        return;
      }

      const responseData = entryRulesResult.data;
      const rules = responseData?.EntryRules || [];
      const baseGoals = buildGoalsFromRules(rules);

      const entriesLookup: Record<number, number> = {};
      const entriesByRule =
        ((responseData as any)?.entriesByRule as WeeklyEntryRuleProgress[]) ||
        (responseData?.EntriesByRule as WeeklyEntryRuleProgress[]) ||
        [];

      let calculatedCurrentWeekEntries = 0;

      if (Array.isArray(entriesByRule)) {
        entriesByRule.forEach((entry) => {
          if (entry?.RuleId) {
            entriesLookup[entry.RuleId] = getNumericValue(
              entry.TransactionsCount,
            );
          }

          // EntriesEarned is the actual number of giveaway entries earned by
          // the user. Include ONE_COMPULSORY in this sum.
          calculatedCurrentWeekEntries += getNumericValue(entry?.EntriesEarned);
        });
      }

      const nextGoals = baseGoals.map((goal) => ({
        ...goal,
        earnedCount:
          goal.ruleId !== undefined ? (entriesLookup[goal.ruleId] ?? 0) : 0,
      }));

      setGoals(nextGoals);

      // Center value comes directly from the backend total.
      setTotalEntries(getNumericValue(responseData?.TotalEntriesInCycle));

      // Retain the calculated rule total for any activity-related bookkeeping.
      // The gauge comparison uses TotalEntriesInCycle directly.
      setCurrentWeekCalculatedEntries(calculatedCurrentWeekEntries);

      const previousCycle =
        (responseData as any)?.PreviousCycle ||
        (responseData as any)?.previousCycle ||
        null;
      const previousOverallEntries = getNumericValue(
        previousCycle?.OverallTotalEntriesInCycle,
      );
      const previousTotalParticipants = getNumericValue(
        previousCycle?.TotalParticipants,
      );

      const previousCycleAverage =
        previousTotalParticipants > 0
          ? previousOverallEntries / previousTotalParticipants
          : 0;

      setWeeklyMeta({
        previousCycleAverage,
        rank: getNumericValue((responseData as any)?.UserRank) || null,
        startOfWeek: responseData?.Cycle?.StartDate ?? null,
        endOfWeek: responseData?.Cycle?.EndDate ?? null,
      });
      setLoading(false);
    };

    fetchGoals();
  }, [user?.Id]);

  return (
    <section className="mx-auto w-full  rounded-xl  bg-white p-3 shadow-blur">
      <header className="border-b border-[#E3E3E2] pb-3">
        <h2 className="text-[20px] font-semibold leading-[1.1] tracking-[-0.01em] text-[#0A193A]">
          Earn entries toward $1000 weekly giveaway
        </h2>
        <div className="flex justify-between">
          <p className="mt-2 text-sm leading-5 text-[#5B657B]">
            Track every activity that earns entries
          </p>
          <p className="text-xs font-medium w-36 flex items-end justify-end leading-4 text-[#5B657B]">
            Rank:{" "}
            <span className="text-omblue-500 ml-1">
              #{weeklyMeta.rank ?? "-"}
            </span>
          </p>
        </div>
      </header>

      {loading ? (
        <div className="py-4">
          <AccordianSkeletonList />
        </div>
      ) : (
        <div className="pt-4">
          <div className="flex items-center gap-[18px] mt-3">
            <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center">
              <div className="absolute -top-[20px]   flex flex-col items-center gap-1">
                <span className="text-[8px] text-center text-nowrap text-[#5B657B]">
                  Last week’s average
                </span>
              </div>
              <svg
                width="81"
                height="84"
                viewBox="0 0 81 79"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background */}
                <path
                  d={TRACK_ARC_PATH}
                  stroke="#E8EFFF"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/*
                  Left half: always fully blue for last week's average.
                  Right half: current week's calculated EntriesEarned compared
                  with last week's average entries per participant.
                */}
                <path
                  d={TRACK_ARC_PATH}
                  fill="none"
                  stroke={`url(#${progressGradientId})`}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={
                    arcLength > 0
                      ? `${(combinedArcPercentage / 100) * arcLength} ${arcLength}`
                      : "0 1"
                  }
                />

                <path
                  ref={markerPathRef}
                  d={TRACK_ARC_PATH}
                  stroke="transparent"
                  fill="none"
                />

                {averageMarkerPoint ? (
                  <g
                    transform={`translate(${averageMarkerPoint.x} ${averageMarkerPoint.y})`}
                  >
                    <line
                      x1="0"
                      y1="-6"
                      x2="0"
                      y2="8"
                      stroke={`url(#${markerGradientId})`}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </g>
                ) : null}

                <defs>
                  <linearGradient
                    id={progressGradientId}
                    gradientUnits="userSpaceOnUse"
                    x1="10"
                    y1="64"
                    x2="70"
                    y2="8"
                  >
                    <stop offset="0%" stopColor="#2357C6" />
                    <stop offset="100%" stopColor="#5F8EF2" />
                  </linearGradient>
                  <linearGradient
                    id={markerGradientId}
                    gradientUnits="userSpaceOnUse"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="12"
                  >
                    <stop offset="0%" stopColor="#2357C6" />
                    <stop offset="100%" stopColor="#B9D9EB" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[18px] font-semibold leading-none text-[#0A193A]">
                  {totalEntries}
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#5B657B]">
                  {totalEntries === 1 ? "Entry" : "Entries"}
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-medium leading-5 text-[#0A193A]">

                    {`You are at ${currentWeekComparisonPercentage}% of last week’s average`}
                  </p>
                  <div className=" flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium leading-none tracking-[-0.02em] text-[#777777] sm:text-xs lg:text-sm">
                      {weekRangeLabel}
                    </p>
                    <div className="inline-flex w-fit items-center rounded-full border-2 border-[#B7CCF3] bg-[#EEF4FF] px-2 py-1 text-[11px] font-semibold leading-none  text-nowrap tracking-[-0.02em] text-[#2E63D6] shadow-[0_1px_0_rgba(46,99,214,0.08)]">
                      $1000 prize
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[18px] font-semibold leading-none tracking-[-0.01em] text-[#0A193A]">
                Ways you earned entries
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {visibleGoals.map((goal) => {
                const detail = getGoalDetailText(goal);

                return (
                  <div key={goal.key} className="group relative">
                    <button
                      type="button"
                      onClick={() => handleGoalClick(goal)}
                      className="flex min-h-16 w-full flex-col justify-between rounded-[10px] border border-[#E3E3E3] bg-white p-2 text-left transition-colors hover:border-[#CFCFCF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2A57BC] overflow-hidden"
                    >
                      <div className="flex items-start justify-between ">
                        <span className="text-sm font-semibold leading-[1.05] tracking-[-0.03em] text-[#1D2128]">
                          {goal.shortTitle}
                        </span>
                        <span className="whitespace-nowrap text-xs font-medium leading-none tracking-[-0.03em] text-[#22262C]">
                          +{goal.entriesAwarded} pts
                        </span>
                      </div>

                      <div className="text-xs font-normal leading-none tracking-[-0.03em] text-[#22262C]">
                        {goal.earnedCount} completed
                      </div>
                    </button>

                    <div className="pointer-events-none absolute bottom-[calc(100%+18px)] left-1/2 z-30 w-[192px] max-w-[calc(100vw-2rem)] -translate-x-1/2 opacity-0 transition-opacity  duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                      <div
                        className="absolute w-full h-full rounded-[15px] -z-10"
                        style={{
                          background:
                            " linear-gradient(180deg, #688CD9 4.33%, #7FAAE3 18.75%)",
                        }}
                      />
                      <div className="rounded-[14px] bg-white p-2 m-0.5 shadow-[0_20px_50px_rgba(10,20,40,0.38)]">
                        <h4 className="text-xs font-semibold leading-tight text-[#000000]">
                          {goal.title}
                        </h4>
                        <p className="mt-2 text-[8px]  text-[#262B32]">
                          {detail.description}
                        </p>
                        <p className="mt-2 text-[8px]  text-[#262B32]">
                          <span className="font-semibold">Earns:</span>{" "}
                          {goal.entriesAwarded}{" "}
                          {goal.entriesAwarded === 1 ? "entry" : "entries"}
                        </p>
                        <p className="mt-2 text-[8px]  text-[#262B32]">
                          <span className="font-semibold">Notes:</span>{" "}
                          {detail.notes}
                        </p>
                      </div>
                      <div className="absolute -bottom-3 -ml-2 left-1/2 h-6 w-6 -translate-x-1/2  ">
                        <svg
                          width="39"
                          height="41"
                          viewBox="0 0 39 41"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21.9655 34.1942L35.6277 10.3362C35.9095 9.82593 36.06 9.24647 36.0643 8.65552C36.0686 8.06458 35.9265 7.48274 35.6522 6.9679C35.3778 6.45306 34.9808 6.02317 34.5007 5.72099C34.0205 5.41881 33.4738 5.25487 32.9152 5.24549L5.81148 5.10559C5.25274 5.10921 4.70463 5.26749 4.22168 5.5647C3.73873 5.86191 3.33778 6.28769 3.05871 6.79967C2.77965 7.31165 2.6322 7.892 2.63104 8.48296C2.62988 9.07392 2.77504 9.6549 3.05209 10.1681L16.4935 34.1659C16.7765 34.6647 17.1762 35.078 17.6541 35.3658C18.132 35.6537 18.672 35.8064 19.222 35.8092C19.7719 35.8121 20.3133 35.6649 20.7939 35.382C21.2744 35.0992 21.6779 34.69 21.9655 34.1942Z"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {!showAllGoals && currentGoals.length > 6 ? (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllGoals(true)}
                  className="text-sm font-semibold leading-none text-[#2A57BC] underline underline-offset-8"
                >
                  See More
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
};

export default WeeklyActivityGoals;