'use client';
import { useRouter } from 'next/navigation';
import { Button } from '../../../../components/marketing';
import { getProfileSlug } from '../../../../data/marketing/signupData';
import { formatPriceWithCurrency } from '../../../../utils/subscriptionPricing';

export const Prices = ({
  basicPlanList,
  premiumPlanList,
  profile,
  planType,
  isSticky,
}) => {
  const router = useRouter();

  const handleChoosePlan = (subscriptionType) => {
    const profileSlug = getProfileSlug(profile.value);
    router.push(`/signup?profile=${encodeURIComponent(profileSlug)}`);
  };

  const basicPlanPrices = basicPlanList?.find((plan) => plan.Name === planType);
  const premiumPlanPrices = premiumPlanList?.find(
    (plan) => plan.Name === planType
  );

  const getBillingPeriodText = () => {
    if (planType === 'Monthly') return '/Month';
    if (planType === 'Quarterly') return '/Quarter';
    return '/Year';
  };

  const calculateSavings = (price, originalMonthlyPrice) => {
    let monthlyEquivalent;
    if (planType === 'Quarterly') {
      monthlyEquivalent = price / 3;
    } else if (planType === 'Annually') {
      monthlyEquivalent = price / 12;
    } else if (planType === 'Monthly') {
      // For monthly, always show 20% savings
      return { amount: 0, percentage: 20 }
    }

    const savedAmount = monthlyEquivalent.toFixed(2);

    const savedPercentage = 100 - (savedAmount / originalMonthlyPrice) * 100;

    return {
      amount: savedAmount,
      percentage: savedPercentage.toFixed(0),
    };
  };

  const renderSavings = (price, planList) => {
    const originalMonthlyPlan = planList?.find(
      (plan) => plan.Name === 'Monthly'
    );
    const savings = calculateSavings(price, originalMonthlyPlan?.Price);
    if (!savings) return null;
    return formatPriceWithCurrency(
      savings.amount,
      originalMonthlyPlan?.Currency || DEFAULT_CURRENCY
    );
  };

  const renderSavingsPercentage = (price, planList) => {
    const originalMonthlyPlan = planList?.find(
      (plan) => plan.Name === 'Monthly'
    );

    const savings = calculateSavings(price, originalMonthlyPlan?.Price);
    if (!savings) return null;
    return savings.percentage; // Return the savings percentage
  };

  const DEFAULT_CURRENCY = 'USD';
  const basicPlanPriceLabel = formatPriceWithCurrency(
    basicPlanPrices?.Price,
    basicPlanPrices?.Currency || DEFAULT_CURRENCY
  );
  const premiumPlanPriceLabel = formatPriceWithCurrency(
    premiumPlanPrices?.Price,
    premiumPlanPrices?.Currency || DEFAULT_CURRENCY
  );

  return (
    <>
      <section className="flex flex-col justify-center sm:flex-row lg:gap-[40px] gap-5 ">
        {/* card 1 */}
        <div className="shadow-price4 bg-pricebox1 w-full xl:w-[312px] rounded-[20px] p-4">
          <div className={`flex gap-1 items-center ${isSticky ? 'justify-between w-full' : 'flex-col items-center'}`}>
            <div className={`flex flex-col space-y-2 h-full ${isSticky ? ' items-start' : 'items-center'}`}>
              <p className={` ${isSticky ? 'text-base text-left mb-2' : 'text-[18px] sm:text-[20px] mb-5'}  text-blue-strong  font-semibold`}>
                Standard
              </p>
              {profile?.value === 'Partners' ? (
                <h4 className="sm:text-[48px] text-4xl font-semibold text-blue-strong leading-[110%]">
                  Contact Us
                </h4>
              ) : (
                  <h4 className={` ${isSticky ? 'text-[28px] ' : 'text-4xl sm:text-[48px]'} font-semibold text-blue-strong leading-[110%]`}>
                    {basicPlanPriceLabel}
                  <span className={`  ${isSticky ? 'text-[12px]' : 'sm:text-base text-4xl'} sm:font-medium font-semibold`}>
                    {getBillingPeriodText()}
                  </span>
                </h4>
              )}
            </div>
            <div className={`${isSticky ? 'flex-shrink-0 flex flex-col items-end' : ''}`}>
              {/* Render savings for all plans */}
              <div className={`flex  gap-3 items-center mt-3 `}>
                {planType !== 'Monthly' ? (
                  <>
                    <p className={`text-[#177B4C] ${isSticky ? 'text-[12px]' : ''} font-medium py-[2px] px-3 border border-[#B8DACA] bg-[#F2FCF8] rounded-[30px]`}>
                      Save{' '}
                      {renderSavingsPercentage(
                        basicPlanPrices?.Price,
                        basicPlanList
                      )}
                      %
                    </p>
                    <p className={`text-blue-strong  ${isSticky ? 'text-[12px]' : ''} font-medium`}>
                      {renderSavings(basicPlanPrices?.Price, basicPlanList)}/Month
                    </p>
                  </>
                ) : (
                  // Display savings for Monthly plans with 0% savings
                  <div className='flex gap-4 items-center'>

                    </div>


                )}
              </div>
              <Button
                className={`w-full bg-premium text-white text-base d  ${isSticky ? 'text-[11px] mt-4 font-semibold' : 'font-bold mt-8'}`}
                onClick={() => handleChoosePlan('Standard')}
              >
                Start 2-Week FREE Trial
              </Button>
            </div>
          </div>
        </div>

        {/* card 2 */}
        {profile?.value !== 'Advocates' && profile?.value !== 'Partners' && (
          <div
            className={`${premiumPlanPrices?.Price
              ? 'opacity-100'
              : 'sm:opacity-0 hidden sm:block'
              } shadow-price4 bg-standard w-full xl:w-[312px] rounded-[20px] p-4`}
          >
            <div className={`flex gap-1 items-center ${isSticky ? 'justify-between w-full' : 'flex-col items-center'}`}>
              <div className={`flex space-y-2 flex-col ${isSticky ? 'flex-1 items-start' : 'items-center'}`}>
                <p className={` ${isSticky ? 'text-base text-left mb-2' : 'text-[18px] sm:text-[20px] mb-5'}  text-white  font-semibold`}>
                  Premium
                </p>
                <h4 className={` ${isSticky ? 'text-[28px]' : 'text-4xl sm:text-[48px]'} font-semibold text-white leading-[110%]`}>
                  {premiumPlanPriceLabel}
                  <span className={`  ${isSticky ? 'text-[12px]' : 'sm:text-base text-4xl'} sm:font-medium font-semibold`}>
                    {getBillingPeriodText()}
                  </span>
                </h4>
              </div>
              <div className={`${isSticky ? 'flex-shrink-0 flex flex-col items-end' : ''}`}>
                <div className={`flex gap-3 items-center mt-3`}>
                  {planType !== 'Monthly' ? (
                    <>
                      <p className={`text-[#177B4C] ${isSticky ? 'text-[12px]' : ''} font-medium py-[2px] px-3 border border-[#B8DACA] bg-[#F2FCF8] rounded-[30px]`}>
                        Save{' '}
                        {renderSavingsPercentage(
                          premiumPlanPrices?.Price,
                          premiumPlanList
                        )}
                        %
                      </p>
                      <p className={`text-white font-medium ${isSticky ? 'text-[12px]' : ''}`}>
                        {renderSavings(premiumPlanPrices?.Price, premiumPlanList)}
                        /Month
                      </p>
                    </>
                  ) : (
                    // Display savings for Monthly plans with 0% savings
                    <div className='flex gap-4 items-center'>

                    </div>
                  )}
                </div>
                <Button
                  className={` ${isSticky ? 'px-4 py-2 bg-[#68A9DC] text-white text-xs font-semibold rounded-[24px] mt-4' : 'w-full bg-[#68A9DC] text-white text-base font-bold mt-8'}`}
                  onClick={() => handleChoosePlan('Premium')}
                >
                  Start 2-Week FREE Trial
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
};
