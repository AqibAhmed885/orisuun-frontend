import { useEffect, useState } from 'react';
import Image from 'next/image';

// Fallback for regions (maps region names to a representative country code)
const regionToCountryCode: Record<string, string> = {
    "North America": "us",
    "Asia": "jp",
    "Europe": "de",
    "Africa": "ng",
    "South America": "br",
    "Oceania": "au",
};

const ProfileFlag = ({ location }: { location: string }) => {
    const [flagUrl, setFlagUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchFlag = async () => {
            const trimmedLocation = location.trim();

            // Use static mapping for regions
            const regionCode = regionToCountryCode[trimmedLocation];
            if (regionCode) {
                setFlagUrl(`https://flagcdn.com/w40/${regionCode}.png`);
                return;
            }

            // Try fetching flag via country name
            try {
                const res = await fetch(`https://restcountries.com/v3.1/name/${trimmedLocation}`);
                const data = await res.json();

                if (Array.isArray(data) && data[0]?.cca2) {
                    const countryCode = data[0].cca2.toLowerCase();
                    setFlagUrl(`https://flagcdn.com/w40/${countryCode}.png`);
                } else {
                    setFlagUrl(null);
                }
            } catch (error) {
                console.error('Error fetching flag:', error);
                setFlagUrl(null);
            }
        };

        fetchFlag();
    }, [location]);

    return flagUrl ? (
        <Image
            src={flagUrl}
            alt={`${location} flag`}
            width={20}
            height={15}
            className="w-5 h-5 object-cover rounded-full"
        />
    ) : null;
};

export default ProfileFlag;
