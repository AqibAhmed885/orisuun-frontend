import Image from 'next/image';

const socialIconAssets: Record<string, string> = {
    bluesky: '/social-icons/Vector (6).svg',
    facebook: '/social-icons/facebook-line.svg',
    instagram: '/social-icons/instagram-line.svg',
    linkedin: '/social-icons/linkedin-line.svg',
    reddit: '/social-icons/Vector (7).svg',
    threads: '/social-icons/Vector (8).svg',
    tiktok: '/social-icons/Vector (9).svg',
    twitter: '/social-icons/Twitter-X.svg',
};

export const hasSocialMediaAsset = (platform = '') =>
    Boolean(socialIconAssets[platform.toLowerCase()]);

const SocialMediaIcon = ({ platform }: { platform?: string }) => {
    const src = socialIconAssets[platform?.toLowerCase() || ''];

    if (!src) return null;

    return (
        <Image
            src={src}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 shrink-0 object-contain"
        />
    );
};

export default SocialMediaIcon;
