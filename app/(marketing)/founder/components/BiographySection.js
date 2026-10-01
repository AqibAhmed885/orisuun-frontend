'use client';
import React, { useState } from 'react';

const BiographySection = ({ sections }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <article
      className={`xs:p-4 sm:!p-20 transition-all ${
        isExpanded ? 'max-h-full' : 'max-h-[350px] overflow-hidden'
      } sm:!max-h-full`}
    >
      <div className='xs:block sm:!hidden space-y-5'>
      {sections.map((section, index) => (
        <div
          key={index}
          className={`grid grid-cols-1 sm:!grid-cols-2 gap-x-12 gap-y-16 items-center ${!isExpanded && '[&:nth-of-type(n+2)]:hidden'}`}
        >
          <section className="space-y-4">
            {section.title && (
              <h2 className="text-xl sm:!text-[32px] font-semibold text-blue-strong mb-4 sm:!mb-10">
                {section.title}
              </h2>
            )}
            {section.content.map((paragraph, pIndex) => (
              <p
                key={pIndex}
                className={`text-blue-300 text-base sm:!text-xl leading-relaxed ${!isExpanded && '[&:nth-of-type(2)]:hidden'}`}
              >
                {paragraph}
                {index === 0 && pIndex === 0 && !isExpanded && (
                  <button
                    className="sm:hidden my-4 block text-sm font-semibold px-4 py-1 rounded-full text-white bg-blue-strong w-max"
                    onClick={handleToggleExpand}
                  >
                    Read More
                  </button>
                )}
              </p>
            ))}
          </section>
          <div className="hidden sm:!block"></div>
        </div>
      ))}
      </div>

      <div className='xs:hidden sm:!block space-y-14'>
      {sections.map((section, index) => (
        <div
          key={index}
          className={`xs:hidden sm:!grid sm:grid-cols-2 gap-x-12 gap-y-16 items-center`}
        >
          {index % 2 === 0 ? (
            <>
              <section className="space-y-4">
                {section.title && (
                  <h2 className="text-[32px] !leading-110 font-semibold text-blue-strong !mb-10">
                    {section.title}
                  </h2>
                )}
                {section.content.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className="text-blue-300 text-xl leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
              <div></div>
            </>
          ) : (
            <>
              <div></div>
              <section className="space-y-4">
                {section.title && (
                  <h2 className="text-[32px] !leading-110 font-semibold text-blue-strong !mb-10">
                    {section.title}
                  </h2>
                )}
                {section.content.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className="text-blue-300 text-xl leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            </>
          )}
        </div>
      ))}
      </div>

      {isExpanded && (
        <div className="sm:hidden">
          <button
            className="text-sm font-semibold px-4 py-1 rounded-full text-white bg-blue-strong w-max"
            onClick={handleToggleExpand}
          >
            Read Less
          </button>
        </div>
      )}
    </article>
  );
};

export default BiographySection;
