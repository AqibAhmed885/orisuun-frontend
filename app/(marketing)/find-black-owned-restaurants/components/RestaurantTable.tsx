'use client'
import { ChevronDoubleDownIcon } from '@heroicons/react/24/solid'
import React from 'react'

const RestaurantTable = ({ restaurants }) => {
    return (
        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden table-reset">
            <div className="overflow-x-auto">
                <div role="table" className="w-full min-w-[900px]" aria-label="Restaurants table">
                    {/* Header */}
                    <div role="rowgroup" className="border-b border-gray-200">
                        <div role="row" className="grid grid-cols-6 gap-4 px-4 py-3 text-left text-[12px] font-medium text-gray-500 capitalize tracking-wider">
                            <div role="columnheader" className="flex gap-2 items-center font-semibold ">
                                Name of business

                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#101828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div role="columnheader" className="flex gap-2 items-center font-semibold ">Country

                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#101828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </div>
                            <div role="columnheader" className="flex gap-2 items-center font-semibold">Description

                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#101828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </div>
                            <div role="columnheader" className="flex gap-2 items-center font-semibold">Location

                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#101828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </div>
                            <div role="columnheader" className="flex gap-2 items-center font-semibold">Industry

                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 4.5L6 7.5L9 4.5" stroke="#101828" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                            </div>
                            <div role="columnheader" className="flex gap-2 items-center font-semibold">Action



                            </div>
                        </div>
                    </div>

                    {/* Rows */}
                    <div role="rowgroup" className="bg-gray-50 divide-y divide-gray-200">
                        {restaurants.map((restaurant, index) => (
                            <div
                                role="row"
                                key={`${restaurant.name}-${index}`}
                                className="hover:bg-olblue-50 transition border-b  last:border-none"
                            >
                                <div className="grid grid-cols-6 gap-4 px-4 py-3 items-center">
                                    {/* Name */}
                                    <div role="cell" className="">
                                        <div className="flex items-center gap-3">
                                            {restaurant.image ? (
                                                <img
                                                    src={restaurant.image}
                                                    alt={restaurant.name}
                                                    className="h-12 w-12 shrink-0 bg-white rounded-full object-cover"
                                                />
                                            ) : (
                                                <div
                                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white text-sm font-semibold"
                                                    style={{ backgroundImage: `linear-gradient(135deg, ${restaurant.colors[0]}, ${restaurant.colors[1]})` }}
                                                >
                                                    {restaurant.initials}
                                                </div>
                                            )}
                                            <span className="text-sm font-semibold text-gray-900">{restaurant.name}</span>
                                        </div>
                                    </div>

                                    {/* Country */}
                                    <div role="cell">
                                        <div className="flex items-center rounded-full justify-center bg-[#E7F2FD] gap-2 inline-flex px-2 py-1">
                                            <img
                                                src={`https://flagcdn.com/${restaurant.countryCode}.svg`}
                                                alt={restaurant.country}
                                                className="w-3 h-2.5 object-cover rounded-sm"
                                            />
                                            <span className="text-sm text-gray-700">{restaurant.country}</span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div role="cell">
                                        <p className="text-sm text-gray-600 max-w-xs">{restaurant.description}</p>
                                    </div>

                                    {/* Location */}
                                    <div role="cell">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8.52668 7.82288C10.2285 7.82288 11.608 6.44331 11.608 4.74152C11.608 3.03973 10.2285 1.66016 8.52668 1.66016C6.82489 1.66016 5.44531 3.03973 5.44531 4.74152C5.44531 6.44331 6.82489 7.82288 8.52668 7.82288Z" stroke="#2357C6" strokeWidth="1.06663" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M8.53125 12.5609V7.82031" stroke="#2357C6" strokeWidth="1.06663" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M11.3744 11.7891C13.7513 12.0877 15.4039 12.7486 15.4039 13.5156C15.4039 14.5632 12.3263 15.4118 8.53006 15.4118C4.73382 15.4118 1.65625 14.5632 1.65625 13.5156C1.65625 12.7486 3.30881 12.0868 5.68573 11.7891" stroke="#2357C6" strokeWidth="1.06663" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {restaurant.location}
                                        </div>
                                    </div>

                                    {/* Industry */}
                                    <div role="cell" className="align-middle">
                                        <div className="flex items-center justify-start h-full">
                                            <span className="text-sm bg-gray-200 rounded-full px-2 font-semibold text-gray-700">{restaurant.industry}</span>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div role="cell" className="w-48">
                                        <div className="flex flex-col md:items-center w-36 justify-center gap-2">
                                            <button className="px-3 py-1.5 bg-omblue-500 w-full text-white text-[10px] font-semibold rounded-full hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                Chat
                                            </button>
                                            <button className="text-xs text-omblue-500 hover:text-omblue-700 font-semibold underline transition">
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantTable
