import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { billingFrequency } from '@/data/marketing';
import {
    CardCvcElement,
    CardExpiryElement,
    CardNumberElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import Input from '@/components/ui/input';
import { cardSchema } from '@/utils/marketing/schemas';
import { Button } from '@/components/marketing';
import { BillingFrequency } from '../../../../../(dashboard)/(auth)/(account)/signup/components/BillingFrequency';
import { PlanType } from '../../../../../(dashboard)/(auth)/(account)/signup/components/PlanType';
import { getSubscriptionPlan, renewSubscription } from '../../../../../api/dashboard/settings';
import { profileTypesWithIds } from '@/data/marketing';
import { ProfileType } from '../../../../../(dashboard)/(auth)/(account)/signup/components/ProfileType';

const CreditCardPayment = ({ userData, showModal }) => {
    const stripe = useStripe();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isOpen, setIsOpen] = useState(false);
    const [loader, setLoader] = useState(false);
    const elements = useElements();
    const [availablePlanTypes, setAvailablePlanTypes] = useState(["Standard", "Premium"]);
    const [selectedPlan, setSelectedPlan] = useState(availablePlanTypes[0]);
    const [selectedProfile, setSelectedProfile] = useState(profileTypesWithIds[0].UserProfileName);
    const [selectedOption, setSelectedOption] = useState('');
    const [billings, setBillings] = useState([]);
    const [selectedBilling, setSelectedBilling] = useState(billingFrequency[0]?.type);
    const currentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData'))
    const handleChange = (option) => { setPaymentMethod(option); };
    const {register, handleSubmit: handleCardSubmit, formState: { errors },} = useForm({resolver: yupResolver(cardSchema),});

    useEffect(() => {
        if (currentUser?.UserSubscribedPlanType) {
            setSelectedPlan(currentUser?.UserSubscribedPlanType);
        }
        if (currentUser?.BillingFrequency) {
            setSelectedBilling(currentUser?.BillingFrequency);
        }
        if (currentUser?.UserProfileType) {
            setSelectedProfile(currentUser?.UserProfileTypeId);
        }
    }, [showModal])

    useEffect(() => {
        const fetchSubscriptionPlan = async () => {
            if (selectedPlan) {
                const planType = selectedPlan === "Standard" ? "1" : "2";
                const result = await getSubscriptionPlan(
                    currentUser?.UserProfileTypeId?.toString(),
                    planType
                );
                if (result) {
                    setBillings(result);
                }
            }
        };
        fetchSubscriptionPlan();
    }, [selectedOption, selectedPlan]);

    const cardSubmit = async (data) => {
        try {
            setLoader(true);
            if (!stripe || !elements) {
                return;
            }

            const cardNumberElement = elements.getElement(CardNumberElement);
            const { error, token } = await stripe.createToken(cardNumberElement, {
                name: data.nameOnCard,
            });

            if (error) {
                toast.error(error.message, { containerId: 'containerA' });
                console.error("Stripe Error:", error.message);
                setLoader(false);
            } else {
                const selectedBillingPlan = billings.find(bill => bill.Name === selectedBilling);
                const success = await renewSubscription(
                    userData?.Id,
                    selectedBillingPlan.Id,
                    token?.id,
                    selectedProfile
                );

                if (success) {
                    toast.success('Payment Successful!', { containerId: 'containerA' });
                    setLoader(false);
                    router.push('/signin');
                }
            }
        } catch (error) {
            toast.error(error?.response?.Message || 'Payment Failed!', {
                containerId: 'containerA',
            });
            setLoader(false);
        }
    };

    const handlePayment = (e) => {
        e.preventDefault();
        if (paymentMethod === 'card') {
            handleCardSubmit(cardSubmit)();
        }
    };
    
    return (
        <>
            <form onSubmit={handlePayment} className=" space-y-4">
                <div className="space-y-2">
                    <p className="text-sm text-[#6E6E6E] font-medium">Profile Type</p>
                    <ProfileType
                        selected={selectedProfile}
                        setSelectedProfile={setSelectedProfile}
                        profileTypes={profileTypesWithIds}
                    />
                </div>

                <div className="space-y-2">
                    <p className="text-sm text-[#6E6E6E] font-medium">Plan Type</p>
                    <PlanType
                        selected={selectedPlan}
                        setSelected={setSelectedPlan}
                        planType={availablePlanTypes}
                        profileType={userData?.UserProfileTypeId}
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-[#6E6E6E] font-medium">
                        Billing Frequency
                    </p>
                    <BillingFrequency
                        selected={selectedBilling}
                        setSelected={setSelectedBilling}
                        billings={billings}
                    />
                </div>
                {paymentMethod === 'card' && (
                    <>
                        <div className="w-full space-y-4">
                            <Input
                                {...register('nameOnCard')}
                                placeholder="Name on card"
                                error={errors.nameOnCard?.message}
                            />
                            <div className="stripe-input border bg-white focus:border-omblue-500 focus:bg-[#f3f7f9] text-h9 2xl:text-scaled-h9 font-medium px-4 py-3 rounded-md w-full">
                                <CardNumberElement options={{ showIcon: true }} />
                            </div>
                            <div className="flex items-center w-full gap-[18px]">
                                <div className="stripe-input border bg-white focus:border-omblue-500 focus:bg-[#f3f7f9] text-h9 2xl:text-scaled-h9 font-medium px-4 py-3 rounded-md w-full">
                                    <CardExpiryElement />
                                </div>
                                <div className="stripe-input border bg-white focus:border-omblue-500 focus:bg-[#f3f7f9] text-h9 2xl:text-scaled-h9 font-medium px-4 py-3 rounded-md w-full">
                                    <CardCvcElement />
                                </div>
                            </div>
                        </div>
                        <Button
                            className="w-full"
                            onClick={handlePayment}
                            disabled={loader}
                        >
                            I&apos;m ready to build!
                        </Button>
                    </>
                )}
            </form>
        </>
    );
};

export default CreditCardPayment;