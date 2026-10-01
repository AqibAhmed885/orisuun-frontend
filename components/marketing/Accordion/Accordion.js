'use client';

import React, { useState } from 'react';
import AccordionItem from './AccordionItem';

const faqData = [
    {
        title: 'How do you protect member data?',
        content:
            "Orisuun has a strong data protection culture and practice. We respect our members and their privacy, and therefore take efforts to remove data, documents, and information directly provided to us when they are no longer in use. Orisuun's practice is to delete member data within 90 days of account deletion. It is also our practice to delete uploaded verification documents within 90 days of use. For a complete and controlling explanation of our privacy policy, please visit our privacy policy page. \n \n As a matter of data hygiene, we ask that you not send us sensitive documents that we do not ask for and that any documents that you do send to us have redacted any sensitive personal information that we do not need(e.g.social security numbers, etc.).\n \n For payments on the site, we partner with Stripe.Your credit card and other payment data is not stored by Orisuun.Please visit Stripe to learn more about their data policies.",
    },
    {
        title: 'Does Orisuun have a free trial?',
        content:
            'Orisuun does not have a free trial or a free version. However, our prices are extremely accessible. Be assured that our subscription plans pay for themselves several times over.',
    },
    {
        title: 'Can I cancel the subscription anytime?',
        content:
            'Absolutely, members can cancel at any time. They simply need go to the "Billing" section of "Settings" on their account.',
    },
    {
        title: 'Which payment methods do you accept?',
        content:
            'We accept nearly all credit and debit card networks, including Visa, Mastercard, Maestro, American Express, Diners Club, Discover, JCP, Accel, Union Pay, Star, NYCE, and Pulse. \n \n For your convenience, we also accept Apple Pay, Google Pay, and PayPal across our site.',
    },
    {
        title: 'How are payment handled on Orisuun?',
        content:
            'For all payments on the site, we partner with Stripe. Your credit card and other payment data is handled by Stripe and not stored by Orisuun. Please visit Stripe to learn more about their transaction and data policies.',
    },
    {
        title: 'What is your refund policy?',
        content: 'Please see our [refund policy](/refund)',
    },
    {
        title: 'How do I cancel my Black Wealth Fund monthly contribution??',
        // to add link to cancellation form
        content:
            'We’re sorry to see you go, but if you must cancel, please click [here](/fund?isCancelOpen=true) for our cancellation form.',
    },
];

const Accordion = () => {
    const [openIndices, setOpenIndices] = useState([]);

    const handleClick = (index) => {
        setOpenIndices((prevOpenIndices) =>
            prevOpenIndices.includes(index)
                ? prevOpenIndices.filter((i) => i !== index)
                : [...prevOpenIndices, index]
        );
    };

    return (
        <div>
            {faqData.map((item, index) => (
                <AccordionItem
                    key={index}
                    faq={item}
                    index={index}
                    titleClass="text-[20px] font-semibold"
                    isOpen={openIndices.includes(index)}
                    onClick={() => handleClick(index)}
                />
            ))}
        </div>
    );
};

export default Accordion;
