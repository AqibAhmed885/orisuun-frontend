import Image from 'next/image';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { clsx } from 'clsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { BankAccount } from './BankAcount';
import { Button } from '../../../../../../components/marketing/Button';
import {
    updatePaymentDetails,
    createBankAccountPaymentV1,
    getPaySubscriptionV1
} from '../../../../../api/auth/auth';
import {
    bankSchema,
    cardSchema,
} from '../../../../../../utils/marketing/schemas';
import { toast } from 'react-toastify';
import { SuccessModal } from './Contribution/successModal';
import Modal from '@/components/marketing/Payment Modal/Modal';
import { useRouter } from 'next/navigation';
import { accountType } from '@/data/marketing';
import {
    CardCvcElement,
    CardExpiryElement,
    CardNumberElement,
    Elements,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ApplePayPayment from './ApplePayPayment';
import Input from '@/components/ui/input';
import { useSelector } from 'react-redux';

// const stripePromise = loadStripe(
//     process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY 
// );

const PaymentVerification = ({ userData }) => {
    const stripe = useStripe();
    const { verificationData } = useSelector((state) => state.user)
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAccountType, setSelectedAccountType] = useState(
        accountType[0]
    );
    const [amount, setAmount] = useState();
    const [frequency, setFrequency] = useState();
    const [token, setToken] = useState();
    const [loader, setLoader] = useState(false);
    const elements = useElements();

    const handleChange = (option) => {
        setPaymentMethod(option);
    };
    const {
        register,
        handleSubmit: handleCardSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(cardSchema),
    });

    const {
        register: bankRegister,
        handleSubmit: handleBankSubmit,
        formState: { errors: bankErrors },
    } = useForm({
        resolver: yupResolver(bankSchema),
    });

    const cardSubmit = async (data) => {
        try {
            setLoader(true);
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!stripe || !elements) {
                return;
            }
            const cardNumberElement = elements.getElement(CardNumberElement);
            const paymentMethodReq = await stripe.createPaymentMethod({
                type: 'card',
                card: cardNumberElement,
                billing_details: {
                    name: data.nameOnCard,
                },
            });

            if (paymentMethodReq.error) {
                toast.error(paymentMethodReq.error?.message, { containerId: 'containerA' });
                console.error(paymentMethodReq.error.message);
                setLoader(false);
            } else {
                const verifyPayment = await updatePaymentDetails({
                    UserId: userData?.Id,
                    Id: verificationData?.Id,
                    PaymentMethod: paymentMethodReq.paymentMethod?.id,
                    Name: data.nameOnCard,
                });

                if (verifyPayment.status === 200) {
                    toast.success('Payment Successful!', { containerId: 'containerA' });
                    setLoader(false);
                    if (verifyPayment.data.Result.isVerificationFeePaid) {
                        router.push('/dashboard');
                    } else {
                        setIsOpen(false);
                        toast.error('Payment Failed.');
                    }
                }
            }
        } catch (error) {
            toast.error(error?.response?.Message || 'Payment Failed!', { containerId: 'containerA' });
            setLoader(false);
        }
    };

    const bankSubmit = async (data) => {
        try {
            setLoader(true);
            const registerData = JSON.parse(localStorage.getItem('userData'));

            const bankAccount = {
                country: 'US',
                currency: 'usd',
                routing_number: data?.routingNumber,
                account_number: data?.accountNumber,
                account_holder_name: data?.nameOnAccount,
            };

            const { token, error } = await stripe.createToken('bank_account', bankAccount);

            if (token) {
                const payload = {
                    AccountHolderName: data?.nameOnAccount,
                    AccountType: selectedAccountType,
                    RoutingNumber: data?.routingNumber,
                    AccountNumber: data?.accountNumber,
                    Country: 'US',
                    Currency: 'USD',
                    PlanId: registerData?.BillingPlanId,
                    SubscriptionType: registerData?.user?.SubscriptionPlanType,
                    BillingFrequency: registerData?.user?.BillingFrequency,
                    UserProfileName: registerData?.user?.ProfileType,
                    Token: token?.id,
                    UserId: registerData?.Id,
                };

                const res = await createBankAccountPaymentV1(payload);

                if (res.status === 200) {
                    toast.success('Payment Successful!', { containerId: 'containerA' });
                    const userData = JSON.parse(localStorage.getItem('userData'));
                    await stripe.confirmUsBankAccountPayment(res.data.Result.PaymentIntent.ClientSecret, {
                        payment_method: {
                            us_bank_account: {
                                routing_number: data?.routingNumber,
                                account_number: data?.accountNumber,
                                account_holder_type: 'individual',
                            },
                            billing_details: {
                                name: data?.nameOnAccount,
                                email: userData?.UserEmail,
                            },
                        },
                    });
                }
            } else {
                toast.error(error?.response?.Message || 'Payment Failed!');
                setLoader(false);
            }
        } catch (error) {
            toast.error(error?.response?.Message || 'Payment Failed!', { containerId: 'containerA' });
            setLoader(false);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const getCookie = (name) => {
                    if (typeof document === 'undefined') return null;
                    const value = `; ${document.cookie}`;
                    const parts = value.split(`; ${name}=`);
                    if (parts.length === 2) return parts.pop().split(';').shift();
                    return null;
                };
                const userCountry = getCookie('user_country') || 'US';

                const registerData = JSON.parse(localStorage.getItem('userData'));
                if (token?.id) {
                    const res = await getPaySubscriptionV1({
                        CustomerId: registerData?.paymentIntent?.CustomerId,
                        PlanId: registerData?.BillingPlanId,
                        Token: token?.id,
                        CountryCode: userCountry
                    });

                    if (res.status === 200) {
                        toast.success(res.data?.Message || 'Registration done!');
                    }
                }
            } catch (error) {
                toast.error(error?.response?.data?.Message || 'There was a server error while registering (contact support)');
            }
        })();
    }, [token]);

    const handlePayment = (e) => {
        e.preventDefault();
        if (paymentMethod === 'card') {
            handleCardSubmit(cardSubmit)();
        } else if (paymentMethod === 'bank') {
            handleBankSubmit(bankSubmit)();
        }
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        if (typeof window.localStorage !== 'undefined') {
            const registerUser = JSON.parse(localStorage.getItem('userData'));
            if (registerUser?.paymentIntent) {
                setAmount(registerUser?.paymentIntent?.Amount);
                setFrequency(registerUser?.user?.BillingFrequency);
            }
        }
    }, []);

    return (
        <>
            <form onSubmit={handlePayment} className=" space-y-4">
                <div className="flex justify-between items-center border-y border-[#D8D9D9] py-4">
                    <p className="text-lg font-semibold text-[#808181]">
                        Profile details
                    </p>
                    <Image
                        src="/icons/check.svg"
                        className=""
                        width={20}
                        height={20}
                        alt="check"
                    />
                </div>
                <div className="space-y-2">
                    <p className="text-sm font-medium text-[#6E6E6E]">Payment methods</p>
                    <div className="grid grid-cols-3 gap-4">
                        <Elements stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)}>
                            {' '}
                            <ApplePayPayment amount={amount} setToken={setToken} />
                        </Elements>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="w-[45%] h-[1px] bg-[#D8D9D9]" />
                    <p className="px-1">or</p>
                    <div className="w-[45%] h-[1px] bg-[#D8D9D9]" />
                </div>
                <div className="flex flex-wrap items-center justify-between">
                    <div className="space-x-2 md:space-x-4">
                        <input
                            type="radio"
                            name="payment"
                            id="card"
                            value="card"
                            onChange={() => handleChange('card')}
                        />
                        <label
                            htmlFor="card"
                            className={clsx(
                                'text-lg font-medium text-[#6E6E6E] cursor-pointer',
                                paymentMethod === 'card' && 'text-nav-blue font-semibold'
                            )}
                        >
                            Credit Card
                        </label>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Image
                            src="/icons/cardGroup.svg"
                            className=""
                            width={148}
                            height={24}
                            alt="card group"
                        />
                        <Popover className="relative">
                            <PopoverButton className="text-[#6E6E6E] font-medium">
                                +more
                            </PopoverButton>
                            <PopoverPanel anchor="top start" className="flex flex-col">
                                <Image
                                    src="/icons/methodGp.svg"
                                    className=""
                                    width={148}
                                    height={24}
                                    alt="card group"
                                />
                            </PopoverPanel>
                        </Popover>
                    </div>
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
                    </>)}
                <div className="space-x-4">
                    <input
                        type="radio"
                        name="payment"
                        id="bank"
                        value="bank"
                        onChange={() => handleChange('bank')}
                    />
                    <label
                        htmlFor="bank"
                        className={clsx(
                            'text-lg font-medium text-[#6E6E6E] cursor-pointer',
                            paymentMethod === 'bank' && 'text-nav-blue font-semibold'
                        )}
                    >
                        Bank Account (ACH Transaction)
                    </label>
                </div>
                {paymentMethod === 'bank' && (
                    <BankAccount
                        setSelectedAccountType={setSelectedAccountType}
                        selectedAccountType={selectedAccountType}
                        register={bankRegister}
                        errors={bankErrors}
                    />
                )}

                {paymentMethod !== '' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <p className="text-blue-strong text-lg font-semibold">Total</p>
                            <p className="text-blue-strong font-medium text-sm">
                                <span className="text-lg font-semibold">$99</span>
                            </p>
                        </div>
                        <Button
                            className="w-full"
                            onClick={handlePayment}
                            disabled={loader}
                        >
                            I&apos;m ready to build!
                        </Button>
                        <div className="flex items-center justify-center gap-2">
                            <Image
                                src="/icons/lock.svg"
                                className=""
                                width={14}
                                height={16}
                                alt="lock"
                            />
                            <p className="text-sm font-medium text-text-gray">
                                Payments are secure and encrypted
                            </p>
                        </div>
                    </div>
                )}
            </form>
            <Modal isOpen={isOpen} onClose={handleCloseModal} className={`z-30`}>
                <SuccessModal onClose={handleCloseModal} />;
            </Modal>
        </>
    );
};

export default PaymentVerification;