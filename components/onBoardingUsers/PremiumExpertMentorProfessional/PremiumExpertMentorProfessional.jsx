'use client'
import { useState } from "react"
import OnboardingScreen from './Steps/OnboardingExpertPremium1';
import OnboardingScreen2 from './Steps/OnboardingExpertPremium2';
import OnboardingScreen3 from './Steps/OnboardingExpertPremium3';
import OnboardingScreen4 from './Steps/OnboardingExpertPremium4';
import OnboardingScreen5 from './Steps/OnboardingExpertPremium5';
import OnboardingScreen6 from './Steps/OnboardingExpertPremium6';
import OnboardingScreen7 from './Steps/OnboardingExpertPremium7';

export default function PremiumExpertMentorProfessional({ accountType, setSelectedAnswers, handleSubmitOnBoarding}) {
    const [step, setStep] = useState(1)
    const currentUser =
        typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));
    return (
        <>
            {step == 1 && (
                <OnboardingScreen userName={currentUser?.UserName} setStep={setStep} setSelectedAnswers={setSelectedAnswers} accountType={accountType} />
            )}
            {step == 2 && (
                <OnboardingScreen2 userName={currentUser?.UserName} setStep={setStep} />
            )}
            {step == 3 && (
                <OnboardingScreen3 userName={currentUser?.UserName} setStep={setStep} />
            )}
            {step == 4 && (
                <OnboardingScreen4 userName={currentUser?.UserName} setStep={setStep} />
            )}
            {step == 5 && (
                <OnboardingScreen5 userName={currentUser?.UserName} setStep={setStep} />
            )}
            {step == 6 && (
                <OnboardingScreen6 userName={currentUser?.UserName} setStep={setStep} />
            )}
            {step == 7 && (
                <OnboardingScreen7 userName={currentUser?.UserName} setStep={setStep} handleSubmitOnBoarding={handleSubmitOnBoarding}/>
            )}
        </>
    )
}