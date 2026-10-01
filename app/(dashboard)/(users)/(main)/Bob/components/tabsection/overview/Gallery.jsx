'use client';
import { useEffect, useState } from "react";

const Gallery = ({ items }) => {
    const [filter, setFilter] = useState('All');
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (selectedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedImage]);

    const filteredItems = filter === 'All'
        ? items
        : items.filter(item => item.type === (filter === 'Photos' ? 'photo' : 'video'));

    const openImage = (index) => {
        setSelectedImage(filteredItems[index]);
        setCurrentIndex(index);
    };

    const closeImage = () => setSelectedImage(null);

    const navigate = (direction) => {
        const newIndex = direction === 'prev'
            ? (currentIndex - 1 + filteredItems.length) % filteredItems.length
            : (currentIndex + 1) % filteredItems.length;
        setSelectedImage(filteredItems[newIndex]);
        setCurrentIndex(newIndex);
    };

    return (
        <div className="bg-white p-4   border border-gray-200 rounded-xl shadow-md mt-6">
            <h3 className="text-lg font-semibold text-gray-900">Gallery</h3>

            {/* Filters */}
            <div className="gallery-filters flex space-x-4 mb-4 border-b pb-2">
                {['All', 'Photos', 'Videos'].map(type => (
                    <button
                        key={type}
                        className={`pb-1 ${filter === type ? 'text-[#2357C6] font-semibold border-b-2 border-[#2357C6]' : 'text-gray-600'}`}
                        onClick={() => setFilter(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Grid - Show message if no items */}
            {filteredItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No {filter === 'All' ? 'items' : filter.toLowerCase()} found
                </div>
            ) : (
                <div className="gallery-grid grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredItems.map((item, index) => (
                        <div key={item.id} className="cursor-pointer group" onClick={() => openImage(index)}>
                            <div className="relative aspect-square overflow-hidden rounded-lg">
                                {item.type === 'photo' ? (
                                    <img
                                        src={item.src}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <video
                                            src={item.src}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="backdrop-blur-md border border-bg-black/30 bg-black/30 rounded-full p-4">
                                                <svg
                                                    className="w-8 h-8 text-white"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-gray-400 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
                        <div className="relative flex-1 flex flex-col">
                            <button
                                onClick={closeImage}
                                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <div className="p-4 md:p-8 flex-1 flex flex-col">
                                <div className="relative flex-1 flex items-center justify-center min-h-[50vh]">
                                    {selectedImage.type === 'photo' ? (
                                        <img
                                            src={selectedImage.src}
                                            alt={selectedImage.title}
                                            className="max-w-full max-h-[60vh] object-contain rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <video
                                                src={selectedImage.src}
                                                controls
                                                className="max-w-full max-h-[60vh] object-contain rounded-lg"
                                                autoPlay
                                            />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => navigate('prev')}
                                        className="absolute bg-[#0C111D] left-1 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 shadow-md hover:bg-opacity-70"
                                    >
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => navigate('next')}
                                        className="absolute bg-[#0C111D] right-1 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full p-2 shadow-md hover:bg-opacity-70"
                                    >
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="mt-4 text-center">
                                    <p className="text-gray-600 mt-2">
                                        <span className="bg-[#D1E9FF] p-2 rounded-2xl text-[#1849A9] font-semibold">
                                            {selectedImage.type === 'photo' ? 'Image' : 'Video'}
                                        </span> {currentIndex + 1} of {filteredItems.length}
                                    </p>
                                    <h3 className="text-xl text-[#344054] mt-2 font-semibold">{selectedImage.title}</h3>
                                </div>

                                {/* Thumbnail images row */}
                                <div className="flex justify-center mt-6 space-x-2 overflow-x-auto py-2">
                                    {filteredItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`flex-shrink-0 cursor-pointer border-2 ${index === currentIndex ? 'border-blue-500' : 'border-transparent'} rounded-md overflow-hidden`}
                                            onClick={() => {
                                                setSelectedImage(item);
                                                setCurrentIndex(index);
                                            }}
                                        >
                                            {item.type === 'photo' ? (
                                                <img
                                                    src={item.src}
                                                    alt={item.title}
                                                    className="w-16 h-16 object-cover"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center relative">
                                                    <video
                                                        src={item.src}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-white bg-black bg-opacity-50 rounded-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;