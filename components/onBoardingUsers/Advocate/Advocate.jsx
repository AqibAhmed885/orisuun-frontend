'use client'
import { useState } from "react"
import OnboardingScreen from './Steps/OnboardingAdvocates1';
import OnboardingScreen2 from './Steps/OnboardingAdvocates2';
import OnboardingScreen3 from './Steps/OnboardingAdvocates3';
import OnboardingScreen4 from './Steps/OnboardingAdvocates4';
import OnboardingScreen5 from './Steps/OnboardingAdvocates5';

export default function Advocate({ setSelectedAnswers, handleSubmitOnBoarding }) { // Fixed: Destructure props correctly
    const [step, setStep] = useState(1)
    const currentUser =
        typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));

    return (
        <>
            {step == 1 && (
                <OnboardingScreen userName={currentUser?.UserName} setStep={setStep} setSelectedAnswers={setSelectedAnswers} />
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
                <OnboardingScreen5 userName={currentUser?.UserName} setStep={setStep} handleSubmitOnBoarding={handleSubmitOnBoarding} />
            )}
        </>
    )
}