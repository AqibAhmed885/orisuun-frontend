'use client'
import { useState } from "react"
import OnboardingScreen from './Steps/OnboardingExpertStandard1';
import OnboardingScreen2 from './Steps/OnboardingExpertStandard2';
import OnboardingScreen3 from './Steps/OnboardingExpertStandard3';
import OnboardingScreen4 from './Steps/OnboardingExpertStandard4';
import OnboardingScreen5 from './Steps/OnboardingExpertStandard5';
import OnboardingScreen6 from './Steps/OnboardingExpertStandard6';

export default function StandardExpertMentorProfessional({ accountType,setSelectedAnswers, handleSubmitOnBoarding }) {
    const [step, setStep] = useState(1)
    const currentUser =
        typeof window !== 'undefined' &&
        JSON.parse(localStorage.getItem('userData'));
    return (
        <>
            {step == 1 && (
                <OnboardingScreen userName={currentUser?.UserName} setStep={setStep} accountType={accountType} setSelectedAnswers={setSelectedAnswers}/>
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
                <OnboardingScreen6 userName={currentUser?.UserName} setStep={setStep} handleSubmitOnBoarding={handleSubmitOnBoarding}/>
            )}
        </>
    )
}