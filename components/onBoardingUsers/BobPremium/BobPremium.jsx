'use client'
import { useState } from "react"
import OnboardingScreen from './Steps/OnboardingScreen1';
import OnboardingScreen2 from './Steps/OnboardingScreen2';
import OnboardingScreen3 from './Steps/OnboardingScreen3';
import OnboardingScreen4 from './Steps/OnboardingScreen4';
import OnboardingScreen5 from './Steps/OnboardingScreen5';
import OnboardingScreen6 from './Steps/OnboardingScreen6';
import OnboardingScreen7 from './Steps/OnboardingScreen7';

export default function BobPremium({setSelectedAnswers, handleSubmitOnBoarding}) {
    const currentUser =
        typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));

    const [step, setStep] = useState(1)
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