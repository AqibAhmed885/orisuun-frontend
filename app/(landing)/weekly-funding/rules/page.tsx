import type { Metadata } from 'next';
import Footer from '../components/footer';
import Header from '../components/header';

export const metadata: Metadata = {
    title: 'Orisuun Weekly Business Funding Program Official Rules',
    description:
        'Official rules for the Orisuun Weekly Business Funding Program. Learn eligibility, entry mechanics, weekly cycle timing, winner selection, payment, and conduct requirements.',
    alternates: {
        canonical: 'https://orisuun.com/weekly-funding/rules',
    },
};

const introCopy = `The Orisuun Weekly Business Funding Program gives active members the opportunity to receive $1,000 each week to support their business. This is not a loan and does not require giving up equity (there are no repayment obligations or ownership requirements).

Once your membership is active and your profile is complete, you are automatically included.

Your activity on the platform can increase your likelihood of being selected, and one member is chosen at random each week.`;

const sharedTextSizeClass = 'text-[20px] sm:text-[36px] md:text-[50px]';

export default function WeeklyFundingRulesPage() {
    return (
        <div className='w-full bg-white font-sf-pro-display font-light text-[#0F1116]'>
            <Header signInLink='/signin' joinLink='/signup?weekly-funding' />

            <main>
                <section
                    className='relative overflow-hidden rounded-b-[56px] px-4 pb-10 pt-28 sm:px-6 md:px-14 md:pb-16 md:pt-32'
                    style={{
                        background:
                            'radial-gradient(circle at 50% 100%, rgba(255,255,255,0.5) 24%, rgba(255,255,255,0.16) 100%), linear-gradient(180deg, #EFEFFF 0%, #DCF2FF 54%, #FBFBFD 100%)',
                    }}
                >
                    <span className='absolute left-[45%] top-[72%] h-1 w-1 rounded-sm bg-[#1E2C8C29]' aria-hidden='true' />
                    <span className='absolute right-[14%] top-[80%] h-1 w-1 rounded-sm bg-[#1E2C8C29]' aria-hidden='true' />
                    <span className='absolute left-[88%] top-[88%] h-1 w-1 rounded-sm bg-[#BB137229]' aria-hidden='true' />

                    <div className='mx-auto w-full max-w-[1440px]'>
                        <h1 className={`max-w-[1200px] font-sf-pro-display font-normal leading-[1.2] text-[#0F1116] text-[70px] $`}>
                            Orisuun Weekly Business Funding Program - Official Rules
                        </h1>

                        <div className={`mt-8 max-w-[1350px] space-y-5 font-sf-pro-display font-light leading-[1.5] text-[#0F1116] ${sharedTextSizeClass}`}>
                            {introCopy.split('\n\n').map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                </section>

                <section className='px-4 pb-16 pt-8 sm:px-6 md:px-[81px] md:pb-24 md:pt-10'>
                    <article
                        className={`mx-auto w-full max-w-[1440px] leading-[1.5] text-[#0F1116] ${sharedTextSizeClass} [&_p]:text-inherit [&_ul]:text-inherit [&_li]:text-inherit`}
                    >
                        <h2 className='sr-only'>Official rules details</h2>

                        <ol className='space-y-10'>
                            <li>
                                <h3 className={`font-sf-pro-display font-semibold ${sharedTextSizeClass}`}>1. Overview</h3>
                                <p className='mt-4'>
                                    The Orisuun Weekly Business Funding Program (the &quot;Program&quot;) provides eligible members with the opportunity to receive $1,000 in weekly funding.
                                </p>
                                <p className='mt-4 py-4'>This funding:</p>
                                <ul className='mt-3 list-disc space-y-2 ml-14'>
                                    <li>is not a loan</li>
                                    <li>does not require repayment</li>
                                    <li>does not involve equity or ownership in your business</li>
                                </ul>
                                <p className='mt-4 py-4'>
                                    Funds are awarded weekly to one eligible member based on a randomized selection process, as described below.
                                </p>
                                <p className='mt-4'>
                                    Members may win more than once, provided they meet eligibility requirements for each weekly cycle.
                                </p>
                            </li>

                            <li>
                                <h3 className={`font-sf-pro-display font-semibold ${sharedTextSizeClass}`}>2. Eligibility Requirements</h3>
                                <p className='mt-4'>To be eligible for the Program, you must:</p>
                                <ul className='mt-3 list-disc space-y-2 ml-14'>
                                    <li>Maintain an active, paid Orisuun membership</li>
                                    <li>Have a completed business profile</li>
                                    <li>Be in good standing on the platform</li>
                                </ul>
                                <p className='mt-4'>
                                    Once your profile is completed and your membership is active, you are automatically included in the weekly selection pool.
                                </p>
                            </li>

                            <li>
                                <h3 className={`font-sf-pro-display font-semibold ${sharedTextSizeClass}`}>3. Weekly Entry System</h3>

                                <h4 className={`mt-6 font-sf-pro-display font-semibold ${sharedTextSizeClass}`}>3.1 What &quot;Entries&quot; Mean</h4>
                                <p className='mt-3'>Each participant accumulates entries, which function similarly to tickets in a raffle.</p>
                                <ul className='mt-3 list-disc space-y-2 ml-14'>
                                    <li>Each entry represents one chance of being selected</li>
                                    <li>The more entries you have, the higher your likelihood of being selected</li>
                                </ul>
                                <p className='mt-4'>Entries are:</p>
                                <ul className='mt-3 list-disc space-y-2 ml-14'>
                                    <li>non-transferable</li>
                                    <li>reset at the start of each weekly cycle (subject to Section 7)</li>
                                </ul>

                                <h4 className={`mt-6 font-sf-pro-display font-semibold ${sharedTextSizeClass}`}>3.2 Base Entry</h4>
                                <p className='mt-3'>Each eligible member begins each week with one (1) entry.</p>

                                <h4 className={`mt-6 font-sf-pro-display font-semibold ${sharedTextSizeClass}`}>3.3 Earning Additional Entries Through Activity</h4>
                                <p className='mt-3'>
                                    Members can earn additional entries through meaningful activity on the platform, including one-on-one chat activity, launching campaigns, posting opportunities, and offering discounts.
                                </p>

                                <div className='mt-5 overflow-x-auto  border border-[#DCE3F1]'>
                                    <table className='min-w-full border-collapse text-left text-sm sm:text-[50px] leading-[1.3] text-[#0F1116]'>
                                        <caption className='sr-only'>Entry values by activity type</caption>
                                        <thead className=''>
                                            <tr>
                                                <th scope='col' className='px-4 py-3 font-sf-pro-display font-semibold text-[#0F1116] sm:px-5'>
                                                    Activity
                                                </th>
                                                <th scope='col' className='px-4 py-3 font-sf-pro-display font-semibold text-[#0F1116] sm:px-5'>
                                                    Entries Earned
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className='border-t border-[#E7ECF6]'>
                                                <td className='px-4 py-3 sm:px-5'>Contribute to Fundraising Campaign</td>
                                                <td className='px-4 py-3 sm:px-5'>25 entries</td>
                                            </tr>
                                            <tr className='border-t border-[#E7ECF6]'>
                                                <td className='px-4 py-3 sm:px-5'>Discount Redeemed</td>
                                                <td className='px-4 py-3 sm:px-5'>25 entries</td>
                                            </tr>
                                            <tr className='border-t border-[#E7ECF6]'>
                                                <td className='px-4 py-3 sm:px-5'>Matched Opportunity</td>
                                                <td className='px-4 py-3 sm:px-5'>10 entries</td>
                                            </tr>
                                            <tr className='border-t border-[#E7ECF6]'>
                                                <td className='px-4 py-3 sm:px-5'>Post an Opportunity</td>
                                                <td className='px-4 py-3 sm:px-5'>8 entries</td>
                                            </tr>
                                            <tr className='border-t border-[#E7ECF6]'>
                                                <td className='px-4 py-3 sm:px-5'>Offer Discount</td>
                                                <td className='px-4 py-3 sm:px-5'>8 entries</td>
                                            </tr>
                                            <tr className='border-t border-[#E7ECF6]'>
                                                <td className='px-4 py-3 sm:px-5'>Launch Campaign</td>
                                                <td className='px-4 py-3 sm:px-5'>8 entries</td>
                                            </tr>
                                            <tr className='border-t border-[#E7ECF6]'>
                                                <td className='px-4 py-3 sm:px-5'>Chat (one-on-one)</td>
                                                <td className='px-4 py-3 sm:px-5'>5 entries</td>
                                            </tr>
                                            <tr className='border-t border-[#E7ECF6]'>
                                                <td className='px-4 py-3 sm:px-5'>Start Chat</td>
                                                <td className='px-4 py-3 sm:px-5'>5 entries</td>
                                            </tr>
                                            <tr className='border-t border-[#E7ECF6]'>
                                                <td className='px-4 py-3 sm:px-5'>Redeem Discount</td>
                                                <td className='px-4 py-3 sm:px-5'>5 entries</td>
                                            </tr>
                                            <tr className='border-t border-[#E7ECF6]'>
                                                <td className='px-4 py-3 sm:px-5'>Community Chat</td>
                                                <td className='px-4 py-3 sm:px-5'>3 entries</td>
                                            </tr>
                                            <tr className='border-t border-[#E7ECF6]'>
                                                <td className='px-4 py-3 sm:px-5'>Review</td>
                                                <td className='px-4 py-3 sm:px-5'>3 entries</td>
                                            </tr>
                                            <tr className='border-t border-[#E7ECF6]'>
                                                <td className='px-4 py-3 sm:px-5'>Universal Chat</td>
                                                <td className='px-4 py-3 sm:px-5'>3 entries</td>
                                            </tr>
                                            <tr className='border-t border-[#E7ECF6]'>
                                                <td className='px-4 py-3 sm:px-5'>Follow</td>
                                                <td className='px-4 py-3 sm:px-5'>2 entries</td>
                                            </tr>
                                            <tr className='border-t border-[#E7ECF6]'>
                                                <td className='px-4 py-3 sm:px-5'>Save</td>
                                                <td className='px-4 py-3 sm:px-5'>1 entry</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <p className='mt-4'>All other activities do not earn entries.</p>
                            </li>

                            <li>
                                <h3 className={`font-sf-pro-display font-semibold ${sharedTextSizeClass}`}>4. How Activity Affects Selection</h3>
                                <p className='mt-4'>
                                    The Program uses a random selection process, but your number of entries determines your probability of being selected.
                                </p>
                                <p className='mt-4'>Example:</p>
                                <ul className='mt-3 list-disc space-y-2 ml-14'>
                                    <li>Member A has 1 entry</li>
                                    <li>Member B has 10 entries</li>
                                </ul>
                                <p className='mt-4'>
                                    Member B is 10 times more likely to be selected than Member A, but selection remains random.
                                </p>
                            </li>

                            <li>
                                <h3 className={`font-sf-pro-display font-semibold ${sharedTextSizeClass}`}>5. Weekly Cycle</h3>
                                <ul className='mt-4 list-disc space-y-2 ml-14'>
                                    <li>Entries are calculated within a weekly cycle</li>
                                    <li>Each weekly cycle begins at 12:00 AM on Mondays (West Africa Time)</li>
                                    <li>At the end of each cycle, a winner is selected</li>
                                    <li>Entries reset at the start of the next cycle, subject to Section 7</li>
                                </ul>
                            </li>

                            <li>
                                <h3 className={`font-sf-pro-display font-semibold ${sharedTextSizeClass}`}>6. Activity Limitations</h3>
                                <p className='mt-4'>To maintain fairness and prevent abuse:</p>

                                <ul className='mt-4 list-disc space-y-2 ml-14'>
                                    <li >
                                        One-on-one chats <br />
                                        Only one (1) set of entries per activity type counts each day
                                    </li>
                                    <li>
                                        Community chats <br />
                                        Only one (1) set of entries per community chat counts each day
                                    </li>
                                </ul>


                            </li>

                            <li>
                                <h3 className={`font-sf-pro-display font-semibold ${sharedTextSizeClass}`}>7. Entry Carryover for Non-Winners</h3>
                                <p className='mt-4'>To reward continued participation:</p>
                                <p className='mt-4'>
                                    For each consecutive week you do not win, you receive one (1) additional starting entry in the following week.
                                </p>
                                <p className='mt-4'>Example:</p>
                                <ul className='mt-3 list-disc space-y-2 ml-14'>
                                    <li>Week 1: 1 entry</li>
                                    <li>Week 2: 2 starting entries</li>
                                    <li>Week 3: 3 starting entries</li>
                                    <li>Week 6: 6 starting entries</li>
                                </ul>
                                <p className='mt-4'>If you win:</p>
                                <p className='mt-2'>Your starting entries reset to one (1) the following week.</p>
                            </li>

                            <li>
                                <h3 className={`font-sf-pro-display font-semibold ${sharedTextSizeClass}`}>8. Winner Selection and Notification</h3>
                                <ul className='mt-4 list-disc space-y-2 ml-14'>
                                    <li>One winner is selected each week</li>
                                    <li>Selection is conducted randomly from the pool of eligible entries</li>
                                </ul>
                                <p className='mt-4'>Winners are notified via:</p>
                                <ul className='mt-3 list-disc space-y-2 ml-14'>
                                    <li>email</li>
                                    <li>platform messaging</li>
                                </ul>
                            </li>

                            <li>
                                <h3 className={`font-sf-pro-display font-semibold ${sharedTextSizeClass}`}>9. Payment of Funds</h3>
                                <ul className='mt-4 list-disc space-y-2 ml-14'>
                                    <li>Funds are delivered securely to the winner</li>
                                </ul>
                                <p className='mt-4'>Payment options may include:</p>
                                <ul className='mt-3 list-disc space-y-2 ml-14'>
                                    <li>bank transfer</li>
                                    <li>online wallet</li>
                                    <li>other available payment methods</li>
                                </ul>
                                <p className='mt-4'>Providing bank details is optional and only required if choosing direct transfer.</p>
                            </li>

                            <li>
                                <h3 className={`font-sf-pro-display font-semibold ${sharedTextSizeClass}`}>10. Transparency</h3>
                                <ul className='mt-4 list-disc space-y-2 ml-14'>
                                    <li>The selection process is documented and available</li>
                                    <li>Weekly winners are publicly announced</li>
                                </ul>
                            </li>

                            <li>
                                <h3 className={`font-sf-pro-display font-semibold ${sharedTextSizeClass}`}>11. Prohibited Conduct and Disqualification</h3>
                                <p className='mt-4'>The Program is designed to reward genuine business-building activity.</p>
                                <p className='mt-4'>The following behaviors are prohibited:</p>
                                <ul className='mt-3 list-disc space-y-2 ml-14'>
                                    <li>Artificial or meaningless activity intended solely to generate entries</li>
                                    <li>Spam behavior or manipulation of platform features</li>
                                    <li>Coordinated or fraudulent actions to increase entries</li>
                                </ul>

                                <h4 className={`mt-6 font-sf-pro-display font-semibold ${sharedTextSizeClass}`}>Consequences</h4>
                                <p className='mt-3'>First violation: Disqualification from that week&apos;s selection</p>
                                <p className='mt-2'>Repeated violations: Suspension or permanent removal from the Program and/or platform</p>
                                <p className='mt-4'>Orisuun reserves the right to determine what constitutes abuse or manipulation.</p>
                            </li>

                            <li>
                                <h3 className={`font-sf-pro-display font-semibold ${sharedTextSizeClass}`}>12. Additional Terms</h3>
                                <ul className='mt-4 list-disc space-y-2 ml-14'>
                                    <li>Entries have no cash value outside of the Program</li>
                                    <li>Entries cannot be transferred, sold, or assigned</li>
                                    <li>Orisuun reserves the right to modify or discontinue the Program at any time</li>
                                    <li>Participation constitutes acceptance of these rules</li>
                                </ul>
                            </li>
                        </ol>
                    </article>
                </section>
            </main>

            <Footer />
        </div>
    );
}
