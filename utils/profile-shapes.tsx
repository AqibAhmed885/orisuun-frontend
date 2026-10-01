import React, { useId } from 'react';
import { resolveUserProfileImageSrc } from '@/utils/image-url';

/**
 * Renders different profile shapes based on user type
 * Each user type has a unique visual shape for their profile avatar
 * 
 * @param profileType - User's profile type ID (1-11)
 * @param imageUrl - URL to the user's profile picture
 * @param userName - User's name to display below the avatar
 * @returns React component with shaped avatar
 */
interface ProfileShapeProps {
    profileType: string;
    imageUrl: string;
    userName?: string;
    size?: number;
}

const ProfileShape: React.FC<ProfileShapeProps> = ({
    profileType,
    imageUrl,
    userName,
    size = 180,
}) => {
    const uniqueId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
    const imagePatternId = `profile-image-${uniqueId}`;
    const clipPathId = `profile-clip-${uniqueId}`;
    const maskId = `profile-mask-${uniqueId}`;
    const outerPathId = `profile-path-${uniqueId}`;
    const gradientId = `profile-gradient-${uniqueId}`;
    const imgSrc = resolveUserProfileImageSrc(imageUrl) ||
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

    // 1. Investor (7) - Octagon with gradient
    if (profileType === '7') {
        return (
            <>
                <div
                    className="rounded-octagon bg-[#dfebfb] flex items-center justify-center"
                    style={{ width: size, height: size }}
                >
                    {/* Inner white border with rounded octagon */}
                    <div className="w-[92%] h-[92%] bg-white rounded-octagon flex items-center justify-center">
                        {/* Image with rounded octagon shape */}
                        <div className="w-[92%] h-[92%] rounded-octagon overflow-hidden">

                            <img
                                src={imgSrc}
                                alt={userName}
                                className="w-full h-full object-cover"
                            />

                        </div>
                    </div>

                </div>
                {userName && (
                    <p className="text-[10px] md:text-sm font-bold  text-center text-[#0D1B39] truncate w-full mt-2">{userName}</p>
                )}
            </>

        );
    }

    // 2. Advocate (4) - Circle with photo
    if (profileType === '4') {
        return (
            <>

                <div className=" ">
                    <svg width={size} height={size} viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            {/* Clip path for the image */}
                            <clipPath id={clipPathId}>
                                <path d="M10 74C10 38.6538 38.6538 10 74 10H106C141.346 10 170 38.6538 170 74V106C170 141.346 141.346 170 106 170H14C11.7909 170 10 168.209 10 166V74Z" />
                            </clipPath>

                            {/* Top-only visible mask */}
                            {/* <linearGradient id="top-only-mask-gradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="white" stopOpacity="1" />
                                <stop offset="23%" stopColor="white" stopOpacity="1" />
                                <stop offset="21%" stopColor="white" stopOpacity="0" />
                                <stop offset="100%" stopColor="white" stopOpacity="0" />
                            </linearGradient> */}
                            <mask id={maskId}>
                                <rect x="0" y="0" width="180" height="180" fill="url(#top-only-mask-gradient)" />
                            </mask>

                            {/* Outer path for reuse */}
                            <path id={outerPathId} d="M10 74C10 38.6538 38.6538 10 74 10H106C141.346 10 170 38.6538 170 74V106C170 141.346 141.346 170 106 170H14C11.7909 170 10 168.209 10 166V74Z" />

                            {/* Gradient for border */}
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6EE7B7" />
                                <stop offset="100%" stopColor="#3B82F6" />
                            </linearGradient>
                        </defs>

                        {/* Top 20% gradient stroke */}
                        {/* <use
                            href="#outer-path"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="11"
                            filter="url(#glass-effect)"
                            opacity="0.1"
                            mask="url(#top-only-mask)"
                            transform="scale(1.03) translate(-2 -2.5)"
                        /> */}

                        {/* Profile image clipped inside shape */}
                        <g clipPath={`url(#${clipPathId})`}>
                            <image
                                href={imgSrc}  // <-- Replace this with your actual image path or URL
                                x="0"
                                y="0"
                                width="180"
                                height="200"
                                preserveAspectRatio="xMidYMid slice"
                            />
                        </g>

                        {/* Optional inner gray border */}
                        <path
                            d="M10 74C10 38.6538 38.6538 10 74 10H106C141.346 10 170 38.6538 170 74V106C170 141.346 141.346 170 106 170H14C11.7909 170 10 168.209 10 166V74Z"
                            fill="none"
                            stroke="#F2F4F7"
                            strokeWidth="4"
                        />
                    </svg>
                </div>

                {userName && (
                    <p className="text-sm font-bold  text-center text-[#0D1B39] truncate w-full mt-2">{userName}</p>
                )}
            </>
        );
    }

    // 3. Strategy Consultants (2) - Rounded rectangle/portrait
    if (profileType === '2') {
        return (
            <>
                <div className="relative sm:mx-0" style={{ width: size, height: size }}>
                    <svg width={size} height={size} viewBox="0 0 183 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <clipPath id={clipPathId} transform="translate(7.50125 6.24134)">
                                <path d="M84.5579 3.34315C88.9449 1.23049 94.0551 1.23049 98.4421 3.34316L158.588 32.3081C162.975 34.4207 166.162 38.4161 167.245 43.1632L182.1 108.247C183.183 112.994 182.046 117.976 179.01 121.783L137.388 173.976C134.352 177.783 129.748 180 124.879 180H58.1214C53.2522 180 48.648 177.783 45.6121 173.976L3.98958 121.783C0.953689 117.976 -0.183454 112.994 0.900044 108.247L15.7549 43.1632C16.8384 38.4161 20.0246 34.4207 24.4116 32.308L84.5579 3.34315Z" />
                            </clipPath>
                            <pattern id={imagePatternId} patternUnits="userSpaceOnUse" width="183" height="180">
                                <image
                                    href={imgSrc}  // <-- Replace this with your actual image path or URL
                                    x="0"
                                    y="0"
                                    width="183"
                                    height="180"
                                    preserveAspectRatio="xMidYMid slice"
                                />
                            </pattern>
                        </defs>
                        <foreignObject
                            x={-7.50125}
                            y={-6.24134}
                            width={198.003}
                            height={194.241}
                        >
                            <div
                                style={{
                                    backdropFilter: 'blur(4px)',
                                    clipPath: `url(#${clipPathId})`,
                                    height: '100%',
                                    width: '100%',
                                }}
                            />
                        </foreignObject>
                        <path
                            d="M84.5579 3.34315C88.9449 1.23049 94.0551 1.23049 98.4421 3.34316L158.588 32.3081C162.975 34.4207 166.162 38.4161 167.245 43.1632L182.1 108.247C183.183 112.994 182.046 117.976 179.01 121.783L137.388 173.976C134.352 177.783 129.748 180 124.879 180H58.1214C53.2522 180 48.648 177.783 45.6121 173.976L3.98958 121.783C0.953689 117.976 -0.183454 112.994 0.900044 108.247L15.7549 43.1632C16.8384 38.4161 20.0246 34.4207 24.4116 32.308L84.5579 3.34315Z"
                            fill="#D9D9D9"
                            fillOpacity="0.2"
                        />
                        <path
                            d="M83.1895 13.542C88.1251 11.1649 93.8749 11.1649 98.8105 13.542L149.081 37.7529C154.016 40.1298 157.601 44.6245 158.819 49.9648L171.235 104.368C172.454 109.708 171.175 115.312 167.76 119.595L132.971 163.223C129.555 167.505 124.375 170 118.897 170H63.1025C57.6247 170 52.4447 167.505 49.0293 163.223L14.2402 119.595C10.8253 115.312 9.54603 109.708 10.7646 104.368L23.1807 49.9648C24.3995 44.6245 27.9839 40.1298 32.9189 37.7529L83.1895 13.542Z"
                            fill={`url(#${imagePatternId})`}
                            stroke="#F2F4F7"
                            strokeWidth={4}
                        />
                    </svg>





                </div>
                {userName && (
                    <p className="text-sm font-bold  text-[#0D1B39] mt-2">{userName}--</p>
                )}
            </>
        );
    }

    // 4. Expert (3) - Circle
    if (profileType === '3') {
        return (
            <>
                <div className='relative'>
                    <svg width={size} height={size} viewBox="0 0 180 180" fill="none">
                        <defs>
                            <clipPath id={clipPathId} transform="translate(0 8)">
                                <path d="M8 70C8 31.3401 39.3401 0 78 0H90H102C140.66 0 172 31.3401 172 70V90V110C172 148.66 140.66 180 102 180H90H78C39.3401 180 8 148.66 8 110V90V70Z" />
                            </clipPath>
                            <pattern id={imagePatternId} patternUnits="userSpaceOnUse" width="183" height="180">
                                <image
                                    href={imgSrc}  // <-- Replace this with your actual image path or URL
                                    x="0"
                                    y="0"
                                    width="183"
                                    height="180"
                                    preserveAspectRatio="xMidYMid slice"
                                />
                            </pattern>
                        </defs>

                        <foreignObject x="0" y="-8" width="180" height="196">
                            <div
                                style={{
                                    backdropFilter: 'blur(4px)',
                                    clipPath: `url(#${clipPathId})`,
                                    height: '100%',
                                    width: '100%',
                                }}
                            />
                        </foreignObject>

                        <path
                            data-figma-bg-blur-radius="8"
                            d="M8 70C8 31.3401 39.3401 0 78 0H90H102C140.66 0 172 31.3401 172 70V90V110C172 148.66 140.66 180 102 180H90H78C39.3401 180 8 148.66 8 110V90V70Z"
                            fill="white"
                            fillOpacity="0.2"
                        />
                        <path
                            d="M96 8C132.451 8 162 37.5492 162 74V106C162 142.451 132.451 172 96 172H84C47.5492 172 18 142.451 18 106V74C18 37.5492 47.5492 8 84 8H96Z"
                            fill={`url(#${imagePatternId})`}
                            stroke="#F2F4F7"
                            strokeWidth="4"
                        />



                    </svg>

                </div>
                {userName && (
                    <p className="text-sm font-bold  text-center text-[#0D1B39] mt-2">{userName}</p>
                )}
            </>
        );
    }

    // 5. Partner (5) - Hexagon shape
    if (profileType === '5') {
        return (
            <>
                <div className="relative">

                    <svg width={size} height={size} viewBox="0 0 170 164" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <clipPath id={clipPathId}>
                                <path
                                    d="M126.011 8C133.459 8 140.138 12.5868 142.812 19.5381L166.459 81.0225C168.191 85.527 168.043 90.539 166.046 94.9326L143.084 145.448C140.163 151.874 133.756 156 126.697 156H46.7559C40.016 156 33.8405 152.235 30.7539 146.243L4.70215 95.6709C2.22486 90.862 2.04162 85.1942 4.20312 80.2354L30.9795 18.8076C33.8406 12.244 40.3194 8.00005 47.4795 8H126.011Z"
                                />
                            </clipPath>
                        </defs>

                        {/* Profile Image inside clipped shape */}
                        <image
                            href={imgSrc}  // <-- Replace this with your actual image path or URL
                            width="170"
                            height="164"
                            clipPath={`url(#${clipPathId})`}
                            preserveAspectRatio="xMidYMid slice"
                        />

                        {/* Optional: Inner subtle gray border */}
                        <path
                            d="M126.011 8C133.459 8 140.138 12.5868 142.812 19.5381L166.459 81.0225C168.191 85.527 168.043 90.539 166.046 94.9326L143.084 145.448C140.163 151.874 133.756 156 126.697 156H46.7559C40.016 156 33.8405 152.235 30.7539 146.243L4.70215 95.6709C2.22486 90.862 2.04162 85.1942 4.20312 80.2354L30.9795 18.8076C33.8406 12.244 40.3194 8.00005 47.4795 8H126.011Z"
                            fill="none"
                            stroke="#F2F4F7"
                            strokeWidth="4"
                        />
                    </svg>

                </div>
                {userName && (
                    <p className="text-sm font-bold  text-center text-[#0D1B39] mt-2">{userName}</p>
                )}
            </>
        );
    }

    // 6. Professional (6) - Large circle with border
    if (profileType === '6') {
        return (
            <>
                <svg width={size} height={size} viewBox="0 0 180 180" fill="none">
                    <foreignObject x="-8" y="-8" width="196" height="196">
                        <div
                            style={{
                                backdropFilter: 'blur(4px)',
                                clipPath: `url(#${clipPathId})`,
                                height: '100%',
                                width: '100%',
                            }}
                        />
                    </foreignObject>
                    <g data-figma-bg-blur-radius="8">
                        <rect width="180" height="180" rx="8" fill="white" fillOpacity="0.2" />
                    </g>
                    <rect x="9" y="8" width="164" height="164" rx="6" fill={`url(#${imagePatternId})`} />
                    <rect
                        x="9"
                        y="8"
                        width="164"
                        height="164"
                        rx="6"
                        stroke="#F2F4F7"
                        strokeWidth="4"
                    />
                    <defs>
                        <clipPath id={clipPathId} transform="translate(8 8)">
                            <rect width="180" height="180" rx="8" />
                        </clipPath>
                        <pattern id={imagePatternId} patternUnits="userSpaceOnUse" width="183" height="180">
                            <image
                                href={imgSrc}  // <-- Replace this with your actual image path or URL
                                x="0"
                                y="0"
                                width="183"
                                height="180"
                                preserveAspectRatio="xMidYMid slice"
                            />
                        </pattern>
                    </defs>
                </svg>
                {userName && (
                    <p className="text-sm font-bold  text-center text-[#0D1B39] mt-2">{userName}</p>
                )}
            </>
        );
    }

    // 7. Mentor (8/9) - Circle
    if (profileType === '8' || profileType === '9') {
        return (
            <>
                <div className="relative">

                    <svg width={size} height={size} viewBox="0 0 189 189" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <foreignObject
                            x="3.65347"
                            y="-8.12778"
                            width="181.693"
                            height="205.256"
                        >
                            <div
                                style={{
                                    backdropFilter: 'blur(4.19px)',
                                    clipPath: `url(#${clipPathId})`,
                                    height: '100%',
                                    width: '100%',
                                }}
                            />
                        </foreignObject>

                        <path
                            d="M12.0312 75.65C12.0312 34.0077 45.789 0.25 87.4312 0.25H94.5H101.569C143.211 0.25 176.969 34.0077 176.969 75.65V94.5V94.5C176.969 123.816 161.867 151.064 137.007 166.601L105.615 186.221C102.971 187.874 99.9154 188.75 96.7972 188.75H94.5H92.2028C89.0846 188.75 86.0292 187.874 83.385 186.221L51.9932 166.601C27.1334 151.064 12.0312 123.816 12.0312 94.5V94.5V75.65Z"
                            fill="white"
                            fillOpacity="0.2"
                        />
                        <path
                            d="M100.783 8.62749C138.955 8.62749 169.899 39.5726 169.899 77.7447V94.4996C169.899 121.28 156.103 146.172 133.393 160.366L105.49 177.806C102.807 179.483 99.7061 180.373 96.5419 180.373H92.4579C89.2937 180.373 86.1929 179.483 83.5097 177.806L55.6063 160.366C32.8964 146.172 19.0995 121.28 19.0995 94.4996V77.7447C19.0995 39.5726 50.0446 8.62749 88.2167 8.62749H100.783Z"
                            fill={`url(#${imagePatternId})`}
                            stroke="#F2F4F7"
                            strokeWidth="4.18889"
                        />

                        <defs>
                            <clipPath id={clipPathId} transform="translate(-3.65347 8.12778)">
                                <path d="M12.0312 75.65C12.0312 34.0077 45.789 0.25 87.4312 0.25H94.5H101.569C143.211 0.25 176.969 34.0077 176.969 75.65V94.5V94.5C176.969 123.816 161.867 151.064 137.007 166.601L105.615 186.221C102.971 187.874 99.9154 188.75 96.7972 188.75H94.5H92.2028C89.0846 188.75 86.0292 187.874 83.385 186.221L51.9932 166.601C27.1334 151.064 12.0312 123.816 12.0312 94.5V94.5V75.65Z" />
                            </clipPath>

                            <pattern id={imagePatternId} patternUnits="userSpaceOnUse" width="183" height="180">
                                <image
                                    href={imgSrc}  // <-- Replace this with your actual image path or URL
                                    x="0"
                                    y="0"
                                    width="183"
                                    height="180"
                                    preserveAspectRatio="xMidYMid slice"
                                />
                            </pattern>
                        </defs>
                    </svg>
                </div>
                {userName && (
                    <p className="text-sm font-bold  text-center text-[#0D1B39] mt-2">{userName}</p>
                )}
            </>
        );
    }

    // 8. Black-owned Business (1) - Dark circle
    if (profileType === '1') {
        return (
            <div className='w-full '>
                <div className="rounded-full p-1 md:p-1.5 relative custom-shadow-blur " style={{ width: size, height: size }}>

                    {/* Frosted Glass Border */}
                    <div className="absolute inset-0 backdrop-blur-md rounded-full border border-white bg-white/20  z-0"
                    ></div>

                    {/* Inner Content */}
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-profile-frame border-white border-[3.14px] z-10">
                        <img
                            src={imgSrc}
                            alt={userName}
                            className="w-full h-full object-cover rounded-full border border-gray-200"
                        />
                    </div>
                </div>
                {userName && (
                    <p className="text-[10px] md:text-sm font-bold text-center text-[#0D1B39]  truncate w-36 mx-auto text-wrap mt-2">{userName}</p>
                )}
            </div>
        );
    }

    // Default - Circle
    return (
        <div className="flex flex-col items-center gap-3">
            <div
                className="rounded-full border-4 border-gray-300 overflow-hidden flex items-center justify-center"
                style={{ width: size, height: size }}
            >
                <img src={imgSrc} alt={userName} className="w-full h-full object-cover" />
            </div>
            {userName && (
                <p className="text-sm font-bold  text-[#0D1B39] truncate w-full">{userName}</p>
            )}
        </div>
    );
};

export const renderProfileShape = (
    profileType: string,
    imageUrl: string,
    userName?: string,
    size: number = 180
) => (
    <ProfileShape
        profileType={profileType}
        imageUrl={imageUrl}
        userName={userName}
        size={size}
    />
);

/**
 * Profile type metadata
 * Maps profile type IDs to their display labels
 */
export const profileTypes = [
    { label: 'Black-owned Business', value: '1' },
    { label: 'Strategy Consultants', value: '2' },
    { label: 'Expert', value: '3' },
    { label: 'Advocate', value: '4' },
    { label: 'Partner', value: '5' },
    { label: 'Professional', value: '6' },
    { label: 'Investor', value: '7' },
    { label: 'Mentor', value: '8' },
    { label: 'Mentor', value: '9' },
    { label: 'Admin', value: '10' },
    { label: 'SystemAdmin', value: '11' },
];
