'use client'
import { useState } from "react"
import OnboardingScreen from './Steps/OnboardingStandard1';
import OnboardingScreen2 from './Steps/OnboardingStandard2';
import OnboardingScreen3 from './Steps/OnboardingStandard3';
import OnboardingScreen4 from './Steps/OnboardingStandard4';

export default function BobStandard({setSelectedAnswers, handleSubmitOnBoarding}) {
    const [step, setStep] = useState(1)
    const currentUser =
        typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));
    return (
        <>
            {step == 1 && (
                <OnboardingScreen userName={currentUser?.UserName} setStep={setStep} setSelectedAnswers={setSelectedAnswers}/>
            )}
            {step == 2 && (
                <OnboardingScreen2 userName={currentUser?.UserName} setStep={setStep} />
            )}
            {step == 3 && (
                <OnboardingScreen3 userName={currentUser?.UserName} setStep={setStep} />
            )}
            {step == 4 && (
                <OnboardingScreen4 userName={currentUser?.UserName} setStep={setStep} handleSubmitOnBoarding={handleSubmitOnBoarding}/>
            )}
        </>
    )
}