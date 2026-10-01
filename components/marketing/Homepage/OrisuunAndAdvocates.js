'use client';

import Image from 'next/image';
import orisuunAndAdvocates from '../../../public/home/images/OrisuunAndAdvocates.png';

export default function OrisuunAndAdvocates({ userType }) {
    const steps = [
        "Must currently work, or have previously worked, as a strategy consultant at a national-level or global strategy consulting firm (e.g., McKinsey, BCG, Bain, etc.).",
        "Must be a graduate-level student at a top business school, currently pursuing a concentration in business strategy or a related field."
    ];

    return (
        <section className="w-full bg-[#F2F7FC] px-6 md:px-12 flex flex-col md:flex-row justify-between items-center mb-12">
            <div className='w-[90%] flex md:flex-row flex-col mx-auto justify-between items-center'>
                <div className='max-w-[57%]'>
                    <Image src={orisuunAndAdvocates} height={100} width={600} alt='Dr. Michael Chen' />
                </div>
                <div className='max-w-[45%]'>
                    <h2 className="text-[30px] md:text-[40px] font-medium text-[#001E5F] mb-6">
                        Orisuun and Advocates
                    </h2>
                    <p className="text-[#5B657B] text-base md:text-[20px] mb-6">
                        Orisuun is your go-to online destination for discovering and supporting Black-owned businesses. We're a platform that is revolutionizing the way consumers connect with Black-owned businesses right in their neighborhood and around the world. 
                    </p>
                    <p className="text-[#5B657B] text-base md:text-[20px] mb-6">
                        Whether you're searching for restaurants, fashion boutiques, tech startups, or professional services, we've got you covered. Unlike any other platform, we're more than just a directory – we're a community-driven marketplace empowering consumers to connect directly with businesses that align with their values.
                    </p>
                </div>
            </div>
        </section>
    );
};
