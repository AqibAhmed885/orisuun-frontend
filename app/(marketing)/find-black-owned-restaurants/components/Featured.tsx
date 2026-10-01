'use client'
import React from 'react'
import RestaurantTable from './RestaurantTable'
import Image from 'next/image'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import CardViewIcon from '@/icons/card-view'
import ListViewIcon from '@/icons/list-view'
const staticUrl = process.env.NEXT_PUBLIC_STATIC_URL;

type ViewMode = 'map' | 'card' | 'list'

const Featured = ({ title, subtitle , data, category}) => {
    const [viewMode, setViewMode] = React.useState<ViewMode>('list')
    const [searchTerm, setSearchTerm] = React.useState('')
    const [selectedIndustry, setSelectedIndustry] = React.useState('')
    const [selectedLocation, setSelectedLocation] = React.useState('')

    // Scroll-driven progress (0..1) for z-axis transforms
    const [headerRef, headerProgress] = useScrollProgress({ start: 0.95, end: 0.2 })
    // Starts morphing near viewport center
    const [tableRef, tableProgress] = useScrollProgress({ start: 0.7, end: 0.25 })

    // Googlebot ko 0 opacity nahi dikhni chahiye. 
    // Hum initial opacity 0.1 rakhenge taki content DOM mein 'visible' rahe.
    const safeHeaderOpacity = Math.max(0.1, headerProgress);
    const safeTableOpacity = Math.max(0.1, tableProgress);

    return (

        <section className="relative overflow-visible " aria-labelledby="featured-restaurants-heading"
            style={{
                backgroundImage: `url(${staticUrl}/find/resturants/background.svg)`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
            }}
        >
            

            <div className="max-w-7xl mx-auto px-6 md:px-0 py-12" style={{ perspective: '1200px' }}>
                {/* Header Section */}
                <div
                    ref={headerRef as React.RefObject<HTMLDivElement>}
                    className="text-center max-w-3xl mx-auto mb-12 will-change-transform"
                    style={{
                        transform: `translateZ(${(-140 + 140 * headerProgress).toFixed(2)}px) translateY(${(-16 + 16 * headerProgress).toFixed(2)}px)`,
                        opacity: safeHeaderOpacity,
                        transformStyle: 'preserve-3d',
                    }}
                >
                    <h2 id="featured-restaurants-heading" className="text-3xl md:text-6xl font-semibold text-[#001E5F] mb-6" style={{ fontFamily: '"Neue Haas Grotesk Display Pro", sans-serif' }}>
                        {title}
                    </h2>
                    <p className="md:text-xl text-sm  text-[#4A5668] leading-relaxed">
                        {subtitle}
                    </p>
                </div>

                {/* Search & Filter Header */}
                <div className="bg-gray-50  rounded-lg will-change-transform border border-gray-200 p-4 mb-6 skew-on-scroll trapezoid-on-scroll"
                    ref={tableRef as React.RefObject<HTMLDivElement>}
                    style={{
                        transform: `translateZ(${(-140 + 140 * tableProgress).toFixed(2)}px) translateY(${(24 - 24 * tableProgress).toFixed(2)}px)`,
                        opacity: safeTableOpacity,
                        transformStyle: 'preserve-3d',
                        // Drives the trapezoid/skew effect
                        ['--skew-progress' as string]: tableProgress,
                        ['--trap-progress' as string]: tableProgress,
                        boxShadow: '0px 24px 48px -12px #1018282E',
                    }}
                >
                    <div className='bg-white p-4 rounded-lg mb-4'>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search Input */}
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search Businesses..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Industry Dropdown */}
                            <div className="relative">
                                <select
                                    value={selectedIndustry}
                                    onChange={(e) => setSelectedIndustry(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-10"
                                >
                                    <option value="">Industry</option>
                                    <option value="Food">Food</option>
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {/* Location Dropdown */}
                            <div className="relative">
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white pr-10"
                                >
                                    <option value="">Location</option>
                                    <option value="United States">United States</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    

                    {/* Results Count & View Toggles */}
                    <div className="flex items-center bg-white p-4 rounded-lg justify-between mb-4">
                        <h2 id="featured-restaurants-heading" className="text-lg font-semibold text-gray-900">
                            {data.length} {category} 
                        </h2>
                        <div className="md:flex items-center hidden  gap-2">
                            <button
                                onClick={() => setViewMode('map')}
                                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition ${viewMode === 'map'
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                    } border border-gray-300`}
                            >

                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7.33122 1.17286L4.18477 0.071602C3.92047 -0.0227914 3.631 -0.0227914 3.3667 0.0653091L0.855833 0.908557C0.346109 1.08476 0 1.56302 0 2.10421V9.56128C0 10.4486 0.887298 11.0527 1.71167 10.7318L3.55548 10.0144C3.69393 9.95774 3.85125 9.95774 3.98969 10.0081L7.13614 11.1093C7.40044 11.2037 7.68992 11.2037 7.95422 11.1156L10.4651 10.2724C10.9748 10.1025 11.3209 9.61792 11.3209 9.07673V1.61965C11.3209 0.732356 10.4336 0.128238 9.60925 0.449176L7.76543 1.16657C7.62699 1.21691 7.47596 1.2232 7.33122 1.17286ZM7.55147 9.92627L3.77574 8.59847V1.25467L7.55147 2.58247V9.92627Z" fill="#344054" />
                                </svg>

                                Map View
                            </button>
                            <button
                                onClick={() => setViewMode('card')}
                                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition ${viewMode === 'card'
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                    } border border-gray-300`}
                            >
                                <CardViewIcon viewMode={'list'}/>
                                Card View
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition ${viewMode === 'list'
                                    ? 'bg-omblue-600 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                    } border ${viewMode === 'list' ? 'border-omblue-600' : 'border-gray-300'}`}
                            >
                                <ListViewIcon viewMode={'list'}/>
                                List View
                            </button>
                        </div>
                    </div>

                    {/* Table */}

                    <RestaurantTable restaurants={data} />
                   
                </div>

                <div className='flex items-center justify-center'>
                    <Image
                        src={`${staticUrl}/find/resturants/wave.svg`}
                        alt="Illustration"
                        width={600}
                        height={600}
                        className=" pointer-events-none select-none"
                    />
                </div>

                
            </div>
        </section>
    )
}

export default Featured
