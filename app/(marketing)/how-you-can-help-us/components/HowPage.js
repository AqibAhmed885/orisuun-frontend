'use client';
import { useEffect, useState } from 'react';
import TopContent from './TopContent';
import Idea from './Idea';
import dynamic from 'next/dynamic';

// Lazy load components that are below the fold
const LazyContribution = dynamic(() => import('./Contribution'), {
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
});

const LazySupport = dynamic(() => import('./Support'), {
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
});

const LazyTellUs = dynamic(() => import('./TellUs'), {
    loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />,
});

export default function How() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Simple CSS-based animation instead of AOS
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={isLoaded ? 'opacity-100 transition-opacity duration-1000' : 'opacity-0'}>
            <main>
                <TopContent />
                <Idea />
                <LazyContribution />
                <LazySupport />
                <LazyTellUs />
            </main>
        </div>
    );
}
