// components/Favicon.tsx
import { useEffect, useState } from 'react';
import Image from 'next/image';

const Favicon = ({ url, className }: { url: string; className?: string }) => {
    const [favicon, setFavicon] = useState<string | null>(null);

    useEffect(() => {
        const getFavicon = () => {
            try {
                const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
                setFavicon(`https://www.google.com/s2/favicons?domain=${domain}`);
            } catch {
                setFavicon(null);
            }
        };

        getFavicon();
    }, [url]);

    return (
        <Image
            src={favicon || '/NonFavicon.png'}
            alt=""
            width={40}
            height={40}
            className={className}
            onError={() => setFavicon(null)}
        />
    );
};

export default Favicon;