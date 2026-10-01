'use client';
import { content } from '../../../../data/marketing/what-we-offer';
import ToolsCard from './ToolsCard';
import LoadingSkeleton from './LoadingSkeleton';
import { useState, useEffect, useRef } from 'react';

const ToolsComponent = () => {
  const [visibleItems, setVisibleItems] = useState(3); // Show first 3 items initially
  const [isLoading, setIsLoading] = useState(false);
  const loadTimerRef = useRef(null);

  const loadMoreItems = () => {
    setIsLoading(true);
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = setTimeout(() => {
      setVisibleItems(prev => Math.min(prev + 3, content.length));
      setIsLoading(false);
      loadTimerRef.current = null;
    }, 100); // Small delay to prevent overwhelming the browser
  };

  useEffect(() => () => {
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 && // Load when 1000px from bottom
        visibleItems < content.length &&
        !isLoading
      ) {
        loadMoreItems();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleItems, isLoading]);

  return (
    <div className="flex flex-col w-full lg:gap-0 md:gap-20 sm:gap-20 small-500:gap-20">
      {content.slice(0, visibleItems).map((item, index) => (
        <ToolsCard
          key={item.header}
          header={item.header}
          paragraphs={item.paragraphs}
          imageSrc={item.imageSrc}
          imageLeft={item.imageLeft}
          contentHeight={item.contentHeight}
          cardHeight={item.cardHeight}
          priority={index < 2} // Add priority loading for first 2 images
        />
      ))}
      
      {/* Show loading skeletons while loading more */}
      {isLoading && (
        <>
          {content.slice(visibleItems, visibleItems + 3).map((item, index) => (
            <LoadingSkeleton
              key={`skeleton-${visibleItems + index}`}
              contentHeight={item.contentHeight}
              cardHeight={item.cardHeight}
              imageLeft={item.imageLeft}
            />
          ))}
        </>
      )}
      
      {visibleItems < content.length && !isLoading && (
        <div className="flex justify-center py-8">
          <button
            onClick={loadMoreItems}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
          >
            <span>Load More Tools ({content.length - visibleItems} remaining)</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 12L8 4M8 4L4 8M8 4L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ToolsComponent;
