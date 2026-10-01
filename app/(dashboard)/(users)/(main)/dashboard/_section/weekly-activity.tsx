import { AccordianSkeletonList } from '@/components/feed-card-skeleton/accordianSkeleton';
import ArrowRight from '@/icons/arrow-right';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { getWeeklyGoals } from '../../../../../api/dashboard/dashboard';
interface Goal {
    key: string;
    title: string;
    description: string;
    completed: boolean;
    count: number;
}

const GoalTypes = {
    ChatsCount: 'ChatsCount',
    ReviewsGiven: 'ReviewsGiven',
    DiscountsAvailed: 'DiscountsAvailed',
};



const WeeklyActivity: React.FC = () => {
    const router = useRouter();

    const [goals, setGoals] = useState<Goal[]>([
        {
            key: GoalTypes.ChatsCount,
            title: 'Chats',
            description: 'Start a Chat',
            completed: false,
            count: 0,
        },
        {
            key: GoalTypes.ReviewsGiven,
            title: 'Reviews Given',
            description: 'Search Profiles',
            completed: false,
            count: 0,
        },
        {
            key: GoalTypes.DiscountsAvailed,
            title: 'Discounts Received',
            description: 'Check out your Discounts',
            completed: false,
            count: 0,
        },
    ]);

    const [completedGoals, setCompletedGoals] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalGoals, setTotalGoals] = useState<number>(goals.length);
    const [startAndEndOfWeek, setStartAndEndOfWeek] = useState<Date[]>([
        new Date(),
        new Date(),
    ]);

    const currentUser =
        typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));

    useEffect(() => {
        setCompletedGoals(goals.filter((goal) => goal.completed).length);
    }, [goals]);

    const calculateProgressPath = (percentage: number) => {
        const radius = 38;
        const center = 42;

        if (percentage === 100) {
            return `M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center - 0.01
                } ${center - radius}`;
        }

        const angle = (percentage / 100) * 360;
        const radians = (angle - 90) * (Math.PI / 180);

        const x = center + radius * Math.cos(radians);
        const y = center + radius * Math.sin(radians);

        const largeArcFlag = percentage > 50 ? 1 : 0;

        return `M ${center},${center - radius
            } A ${radius},${radius} 0 ${largeArcFlag},1 ${x},${y}`;
    };

    const HandleClickOnGoal = (goalType: string) => {
        if (goalType == GoalTypes.ChatsCount) {
            router.push('/chats');
        } else if (goalType == GoalTypes.ReviewsGiven) {
            router.push(
                '/profile-search/search-results?searchQuery=&city=&profileType=1'
            );
        } else if (goalType == GoalTypes.DiscountsAvailed) {
            router.push('/discount-portal');
        }
    };

    useEffect(() => {
        const fetchGoals = async () => {
            setLoading(true);
            let result = await getWeeklyGoals(currentUser?.Id);
            setLoading(false);
            if (result?.success) {
                setGoals((prevGoals) => {
                    const updatedGoals = prevGoals.map((goal) => ({
                        ...goal,
                        count: result.data[goal.key] || 0,
                        completed: !!result?.data[goal.key],
                    }));

                    if (
                        currentUser?.UserProfileTypeId == 5 ||
                        currentUser?.UserProfileTypeId == 10
                    ) {
                        const newGoals = updatedGoals.filter(
                            (goal) => goal.key !== GoalTypes.DiscountsAvailed
                        );
                        setTotalGoals(newGoals.length);
                        return newGoals;
                    }

                    setTotalGoals(updatedGoals.length);
                    return updatedGoals;
                });
                if (result.data?.StartOfWeek && result.data?.EndOfWeek)
                    setStartAndEndOfWeek([
                        result.data.StartOfWeek,
                        result.data.EndOfWeek,
                    ]);
            }
        };
        fetchGoals();
    }, []);

    return (
        <div className="bg-white shadow-blur rounded-2xl p-4 w-full max-w-full lg:!max-w-md 3xl:!max-w-full mx-auto">
            <h2 className="text-lg leading-6 font-semibold text-blue-500">
                Weekly activity goals:
            </h2>
            <p className="text-xs text-blue-300">
                Increase your visibility by reviewing, chatting, and visiting!
            </p>
            <hr className="my-4" />
            {loading ? (
                <AccordianSkeletonList />
            ) : (
                <>
                    <div className="flex gap-3 items-center mb-4">
                        <div className="relative w-[76px] h-[76px] 3xl:w-20 3xl:h-20">
                            <svg
                                width="76"
                                height="76"
                                viewBox="0 0 84 84"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className='3xl:w-20 3xl:h-20'
                            >
                                <circle
                                    cx="42"
                                    cy="42"
                                    r="38"
                                    stroke="#E9E9E9"
                                    strokeWidth="7"
                                />
                                <path
                                    d={calculateProgressPath((completedGoals / totalGoals) * 100)}
                                    stroke="#2357C6"
                                    strokeWidth="7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span
                                    className="text-sm font-semibold text-black-900"
                                    style={{ opacity: 0.6 }}
                                >
                                    {completedGoals} of {totalGoals}
                                </span>
                                <span className="text-xs leading-none text-black-900">
                                    {' '}
                                    Actions
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium leading-4 text-black-900">
                                {completedGoals !== totalGoals
                                    ? `Take ${totalGoals - completedGoals} more ${totalGoals - completedGoals === 1 ? 'action' : 'actions'
                                    } to achieve weekly activity goals`
                                    : 'Congrats, Superstar! You have completed your weekly goals'}
                            </p>
                            {/* <p className="text-sm font-medium leading-[18px] mt-1 text-black-900 opacity-60">
                {moment(startAndEndOfWeek[0]).format('MMM DD')} -{' '}
                {moment(startAndEndOfWeek[1]).format('MMM DD')}
              </p> */}
                            <p className="text-sm font-medium leading-[18px] mt-1 3xl:mt-2 text-black-900 opacity-60">
                                {moment().startOf('isoWeek').format('MMM DD')} -{' '}
                                {moment().startOf('isoWeek').add(6, 'days').format('MMM DD')}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {goals.map((goal, index) => (
                            <div
                                key={index}
                                className="flex justify-between items-center border px-4 py-2.5 border-grey-600 rounded-[10px]"
                                onClick={() => HandleClickOnGoal(goal.key)}
                            >
                                <div>
                                    <p
                                        className={`text-base font-semibold leading-6 text-black-900`}
                                    >
                                        {goal.count} {goal.title}
                                    </p>
                                    <p className="text-sm text-black-900 leading-6 !opacity-6">
                                        {goal.description}
                                    </p>
                                </div>
                                <button className="text-blue-500 hover:underline text-sm">
                                    <ArrowRight />
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default WeeklyActivity;