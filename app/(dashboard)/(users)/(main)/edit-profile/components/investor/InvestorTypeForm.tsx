import React, { useState } from 'react';
import InvestorRegistrationForm from '../../InvestorProfileForm';

const CreateInvestorAccountPage = () => {
    const [selectedType, setSelectedType] = useState<'individual' | 'firm'>('individual');
    const [showForm, setShowForm] = useState(false);

    if (showForm) {
        return <InvestorRegistrationForm investorType={selectedType} />;
    }

    return (
        <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center">
            <div className="relative w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg border border-[#e5e7eb]">
                {/* Close Button (optional) */}
                <button className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 text-sm">
                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6.45312L6 18.4531M6 6.45312L18 18.4531" stroke="#667085" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>

                {/* Heading */}
                <h2 className="text-[18px] font-semibold text-gray-900 mb-1">Account Type</h2>
                <p className="text-[14px] text-gray-700 mb-5">
                    Please select the type of account you'd like to create
                </p>

                {/* Individual Option */}
                <div
                    onClick={() => setSelectedType('individual')}
                    className={`flex items-center gap-4 p-3 rounded-lg border mb-3 cursor-pointer transition-all shadow-md ${selectedType === 'individual'
                        ? 'border-[#5A8BF5] bg-[#F5F8FF]'
                        : 'border-[#F2F4F7] hover:border-gray-400'
                        }`}
                >
                    <div className="pt-0.5">
                        {/* User Icon */}
                        <svg width="34" height="35" viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M36.6673 38.9531C36.6673 36.3946 36.6673 35.1153 36.3515 34.0744C35.6406 31.7306 33.8065 29.8965 31.4627 29.1856C30.4218 28.8698 29.1425 28.8698 26.584 28.8698H17.4173C14.8588 28.8698 13.5795 28.8698 12.5386 29.1856C10.1948 29.8965 8.36072 31.7306 7.64976 34.0744C7.33398 35.1153 7.33398 36.3946 7.33398 38.9531M30.2507 14.2031C30.2507 18.7595 26.557 22.4531 22.0007 22.4531C17.4443 22.4531 13.7507 18.7595 13.7507 14.2031C13.7507 9.64678 17.4443 5.95312 22.0007 5.95312C26.557 5.95312 30.2507 9.64678 30.2507 14.2031Z" stroke="#101828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[16px] font-semibold text-gray-900">Individual Account</p>
                        <p className="text-[12px] text-gray-700">
                            Perfect for personal use. Create an account for yourself with basic profile information and preferences.
                        </p>
                    </div>
                </div>

                {/* Firm Option */}
                <div
                    onClick={() => setSelectedType('firm')}
                    className={`flex items-start gap-4 p-3 rounded-lg border cursor-pointer transition-all shadow-md ${selectedType === 'firm'
                        ? 'border-[#5A8BF5] bg-[#F5F8FF]'
                        : 'border-[#F2F4F7] hover:border-gray-400'
                        }`}
                >
                    <div className="pt-0.5">
                        {/* Building Icon */}
                        <svg width="37" height="38" viewBox="0 0 44 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.7493 20.6198H8.43268C7.40592 20.6198 6.89254 20.6198 6.50037 20.8196C6.1554 20.9954 5.87494 21.2758 5.69917 21.6208C5.49935 22.013 5.49935 22.5264 5.49935 23.5531V38.9531M30.2493 20.6198H35.566C36.5928 20.6198 37.1062 20.6198 37.4983 20.8196C37.8433 20.9954 38.1238 21.2758 38.2995 21.6208C38.4993 22.013 38.4993 22.5264 38.4993 23.5531V38.9531M30.2493 38.9531V11.8198C30.2493 9.76627 30.2493 8.7395 29.8497 7.95516C29.4982 7.26523 28.9372 6.7043 28.2473 6.35277C27.463 5.95312 26.4362 5.95312 24.3827 5.95312H19.616C17.5625 5.95312 16.5357 5.95312 15.7514 6.35277C15.0615 6.7043 14.5005 7.26523 14.149 7.95516C13.7493 8.7395 13.7493 9.76627 13.7493 11.8198V38.9531M40.3327 38.9531H3.66602M20.166 13.2865H23.8327M20.166 20.6198H23.8327M20.166 27.9531H23.8327" stroke="#101828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-[16px] font-semibold text-gray-900">Firm/Organization Account</p>
                        <p className="text-[12px] text-gray-700">
                            Ideal for businesses, organizations, or teams. Manage multiple people and locations under one account.
                        </p>
                    </div>
                </div>

                {/* Continue Button */}
                <button
                    className="mt-6 w-full bg-[#2357C6] text-white text-[16px] font-medium py-2.5 rounded-md hover:bg-[#1e4fc2] transition-colors"
                    onClick={() => setShowForm(true)}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default CreateInvestorAccountPage;
