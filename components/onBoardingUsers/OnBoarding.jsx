'use client'
import BobPremium from './BobPremium/BobPremium'
import BobStandard from './BobStandard/BobStandard'
import PremiumExpertMentorProfessional from './PremiumExpertMentorProfessional/PremiumExpertMentorProfessional'
import StandardExpertMentorProfessional from './StandardExpertMentorProfessional/StandardExpertMentorProfessional'
import Partner from './Partner/Partner'
import Advocate from './Advocate/Advocate'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { apiEndpoint } from '@/utils/utils'


export default function onBoarding({ userId, accountType, isPremium, setFilledOnboarding }) {
    const [selectedAnswers, setSelectedAnswers] = useState([])

    useEffect(() => {
        // Prevent body scroll when onboarding modal is visible
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    async function handleSubmitOnBoarding() {
        if (selectedAnswers != null && selectedAnswers.length > 0) {
            const answerString = selectedAnswers.join(' | ');
            try {
                const finalResult = await axios.post(
                    `${apiEndpoint}/Profile/SaveUserOnboardingFeedback`,
                    {
                        UserId: userId,
                        Answers: answerString
                    },
                    {
                        headers: {
                            XApiKey:
                                'lLBHnYLgfgYJe3dWFPSh1GygffGUcOA9JQrRbWdL5UiHg75QGcDjofnJcKyH5',
                        },
                    }
                );
                if (finalResult.status === 200) {
                    toast.success('Feedback Submitted successfully!')
                    setFilledOnboarding(true);
                }
                else {
                    toast.error('Failed to submit Feedback, Please try again later!')
                }
            }
            catch {
                toast.error('Failed to submit Feedback, Please try again later!')
            }
        }
        else {
            toast.error('Please select atleast one option!')
        }
    }

    setFilledOnboarding(false)
    return (
        <div className="m-auto rounded-xl bg-transparent overflow- opacity-full ">
            {(accountType == 1 && isPremium) ?
                (<BobPremium setSelectedAnswers={setSelectedAnswers} handleSubmitOnBoarding={handleSubmitOnBoarding} />) : (accountType == 1 && !isPremium) ?
                    (<BobStandard setSelectedAnswers={setSelectedAnswers} handleSubmitOnBoarding={handleSubmitOnBoarding} />) : ((accountType == 8 || accountType == 6 || accountType == 2 || accountType == 7 || accountType == 3) && isPremium) ?
                        (<PremiumExpertMentorProfessional accountType={accountType} setSelectedAnswers={setSelectedAnswers} handleSubmitOnBoarding={handleSubmitOnBoarding} />) : ((accountType == 8 || accountType == 6 || accountType == 2 || accountType == 7 || accountType == 3) && !isPremium) ?
                            (<StandardExpertMentorProfessional accountType={accountType} setSelectedAnswers={setSelectedAnswers} handleSubmitOnBoarding={handleSubmitOnBoarding} />) : (accountType == 5) ?
                                (<Partner setSelectedAnswers={setSelectedAnswers} handleSubmitOnBoarding={handleSubmitOnBoarding} />) : (accountType == 4) ?
                                    (<Advocate setSelectedAnswers={setSelectedAnswers} handleSubmitOnBoarding={handleSubmitOnBoarding} />) : (<></>)
            }
        </div>
    )
}