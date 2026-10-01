"use client"
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

export default function HowItWorksSticky({steps}) {
  return (
      <section className="relative max-w-7xl mx-auto px:4 md:px-6 md:py-16 py-4 flex flex-col gap-16">
          {steps.length > 0 && steps.map((step, idx) => (
            <StepItem key={step.id || idx} step={step} />
          ))}
    </section>
  )
}

// Render title as JSX, plain string, or HTML string (dangerously set). Use with caution for untrusted content.
function renderTitle(title) {
  if (React.isValidElement(title)) return title
  if (typeof title === 'string') {
    if (/<[a-z][\s\S]*>/i.test(title)) {
      return <span dangerouslySetInnerHTML={{ __html: title }} />
    }
    return title
  }
  return title
}

// Produce plain-text title for attributes like image alt text.
function titleText(title, fallback = '') {
  if (typeof title === 'string') return title.replace(/<[^>]+>/g, '')
  if (React.isValidElement(title)) {
    const child = (title as any).props?.children
    if (typeof child === 'string') return child
    return fallback
  }
  return fallback
}

function StepItem({ step }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const imageRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = (entry.target as HTMLElement).dataset?.index
            if (idx != null) {
              setActiveIndex(Number(idx))
            }
          }
        })
      },
      { threshold: 0.6 }
    )

    imageRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [step.images])

  return (
    <div className="flex relative md:flex-row flex-col md:space-x-12 space-x-0">
      {/* LEFT SIDE - Sticky Content */}
      <aside className={`md:w-1/2 w-full ${step.images?.length > 1 ? '' : 'flex items-center my-auto'}`}>
        <div className={`hidden md:flex ${step.images?.length > 1 ? 'sticky top-1/3' : ''} space-x-4 md:py-20 py-4 will-change-transform`}>
          <div className='w-10 h-9 mt-3 shrink-0 rounded-full bg-omblue-500 text-white flex items-center justify-center font-semibold text-2xl'>
            {step?.stepId}
          </div>
          <div>
            <h3 className='text-[#001E5F] text-[40px] tracking-wide leading-none font-semibold'>
              {renderTitle(step.title)}
            </h3>
            {/* Animating description based on active index */}
            <p className='text-[#5B657B] md:text-xl text-lg mt-4 transition-opacity duration-300'>
              {step.images[activeIndex]?.description || step.description}
            </p>
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE - Scrolling Images */}
      <div className="md:w-1/2 relative w-full">
        <div className="flex flex-col gap-16 py-2 md:py-0">
          {step.images.map((image, idx) => (
            <div
              key={idx}
              ref={el => { imageRefs.current[idx] = el }}
              data-index={idx}
              className="w-full flex flex-col items-center justify-end md:h-[440px] h-full flex-shrink-0 rounded-md will-change-contents"
            >
              {/* Mobile View Title/Desc */}
              <div className="flex space-x-4 md:hidden py-4">
                <div className='w-10 h-9 mt-1 shrink-0 rounded-full bg-omblue-500 text-white flex items-center justify-center font-semibold text-xl'>
                  {step?.stepId}
                </div>
                <div>
                  <h1 className='text-[#001E5F] text-[24px] font-semibold'>{renderTitle(step.title)}</h1>
                  <p className='text-[#5B657B] text-lg'>{image.description || step.description}</p>
                </div>
              </div>
              <div className="relative h-full rounded-md overflow-visible">
                <Image
                  src={image.src}
                  alt={image.description || titleText(step.title)}
                  width={900}
                  height={620}
                  className=" w-full h-full z-10  object-cover object-right overflow-visible "
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
