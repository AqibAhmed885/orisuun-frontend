import Image from 'next/image'
import React from 'react'

const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

interface Business {
  name: string
  location: string
  country: string
  countryCode: string
  description: string
  industry: string
  initials: string
  colors: string[]
  image: string
}

interface FeaturedServerContentProps {
  title: string
  subtitle: string
  data: Business[]
  category: string
}

const FeaturedServerContent = ({ title, subtitle, data, category }: FeaturedServerContentProps) => {
  return (
    <section 
      className="relative overflow-visible" 
      aria-labelledby="featured-businesses-heading"
      style={{
        backgroundImage: `url('${staticUrl}/find/resturants/background.svg')`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-0 py-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 id="featured-businesses-heading" className="text-3xl md:text-6xl font-semibold text-[#001E5F] mb-6" style={{ fontFamily: '"Neue Haas Grotesk Display Pro", sans-serif' }}>
            {title}
          </h2>
          <p className="md:text-xl text-sm text-[#4A5668] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Business Cards - Server Rendered for SEO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {data.slice(0, 12).map((business, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={business.image}
                    alt={business.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{business.name}</h3>
                  <p className="text-sm text-gray-500">{business.location}</p>
                  <p className="text-xs text-gray-400">{business.country}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{business.description}</p>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                {business.industry}
              </span>
            </div>
          ))}
        </div>

        {/* Mobile view illustration */}
        <div className='flex items-center md:hidden justify-center'>
          <Image
            src={`${staticUrl}/find/resturants/dashboard.svg`}
            alt="Illustration"
            width={800}
            height={800}
            className="pointer-events-none select-none"
          />
        </div>

        <div className='flex items-center justify-center'>
          <Image
            src={`${staticUrl}/find/resturants/wave.svg`}
            alt="Illustration"
            width={600}
            height={600}
            className="pointer-events-none select-none"
          />
        </div>
      </div>
    </section>
  )
}

export default FeaturedServerContent
