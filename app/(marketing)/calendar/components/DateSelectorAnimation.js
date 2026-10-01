import React from 'react';

const DateSelectorAnimation = ({
    dates,
    selectedDates,
    handleDateClick,
    isDragging,
    previewWidth,
    handleDragStart,
    showTooltip,
    containerRef
}) => {
    const ArrowHandle = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
        >
            <circle
                cx="15"
                cy="15"
                r="14"
                fill="#0A193A"
                stroke="white"
                strokeWidth="2"
            />
            <path
                d="M8.64645 14.6464C8.45118 14.8417 8.45118 15.1583 8.64645 15.3536L11.8284 18.5355C12.0237 18.7308 12.3403 18.7308 12.5355 18.5355C12.7308 18.3403 12.7308 18.0237 12.5355 17.8284L9.70711 15L12.5355 12.1716C12.7308 11.9763 12.7308 11.6597 12.5355 11.4645C12.3403 11.2692 12.0237 11.2692 11.8284 11.4645L8.64645 14.6464ZM21.3536 15.3536C21.5488 15.1583 21.5488 14.8417 21.3536 14.6464L18.1716 11.4645C17.9763 11.2692 17.6597 11.2692 17.4645 11.4645C17.2692 11.6597 17.2692 11.9763 17.4645 12.1716L20.2929 15L17.4645 17.8284C17.2692 18.0237 17.2692 18.3403 17.4645 18.5355C17.6597 18.7308 17.9763 18.7308 18.1716 18.5355L21.3536 15.3536ZM9 15.5H21V14.5H9V15.5Z"
                fill="white"
            />
        </svg>
    );

    const ArrowHandle2 = () => (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="15" r="14" fill="#A8B1C5" stroke="white" strokeWidth="2" />
            <path opacity="0.7" d="M8.64645 14.6464C8.45118 14.8417 8.45118 15.1583 8.64645 15.3536L11.8284 18.5355C12.0237 18.7308 12.3403 18.7308 12.5355 18.5355C12.7308 18.3403 12.7308 18.0237 12.5355 17.8284L9.70711 15L12.5355 12.1716C12.7308 11.9763 12.7308 11.6597 12.5355 11.4645C12.3403 11.2692 12.0237 11.2692 11.8284 11.4645L8.64645 14.6464ZM21.3536 15.3536C21.5488 15.1583 21.5488 14.8417 21.3536 14.6464L18.1716 11.4645C17.9763 11.2692 17.6597 11.2692 17.4645 11.4645C17.2692 11.6597 17.2692 11.9763 17.4645 12.1716L20.2929 15L17.4645 17.8284C17.2692 18.0237 17.2692 18.3403 17.4645 18.5355C17.6597 18.7308 17.9763 18.7308 18.1716 18.5355L21.3536 15.3536ZM9 15.5H21V14.5H9V15.5Z" fill="white" />
        </svg>
    );

    return (
        <div
            className="flex justify-between gap-2 items-center w-[1440px] relative"
            ref={containerRef}
        >
            {/* Permanent blue border for selected dates - always visible */}
            <div
                className="absolute h-[48px] bg-white border-2 small-767:block hidden border-omblue-500 rounded-lg transition-all duration-200"
                style={{
                    width: `${(selectedDates.length * 100 / dates.length) - (6 - ((selectedDates.length - 1) * 4))}%`,
                    left: 0,
                }}
            />
            <div
                className="absolute h-[48px] bg-white border-2 small-767:hidden block border-omblue-500 rounded-lg transition-all duration-200"
                style={{
                    width: `${(selectedDates.length * 100 / dates.length) - (18 - ((selectedDates.length - 1) * 6))}%`,
                    left: 0,
                }}
            />

            {/* Gray preview border during drag - shows potential selection */}
            {isDragging && (
                <div
                    className="absolute h-[48px] screen-767:block hidden bg-gray-100 border-2 border-gray-300 rounded-lg opacity-50"
                    style={{
                        width: `${previewWidth + 25}px`,
                        left: 0,
                    }}
                />
            )}
            {isDragging && (
                <div
                    className="absolute h-[48px] screen-767:hidden block bg-gray-100 border-2 border-gray-300 rounded-lg opacity-50"
                    style={{
                        width: `${previewWidth + 25}px`,
                        left: 0,
                    }}
                />
            )}

            {/* Date buttons */}
            {dates.map((dateObj, index) => (
                <button
                    key={`${dateObj.date}-${dateObj.day}`}
                    className={`relative z-10 text-lg py-2 px-5 h-[48px] rounded-lg font-medium transition-colors duration-100 ${index < selectedDates.length
                            ? 'text-omblue-500 font-semibold'
                            : 'text-blue-500'
                        }`}
                    onClick={() => handleDateClick(index)}
                >
                    <span className="small-767:text-center small-767:absolute small-767:top-[-24px] small-767:left-0 small-767:right-0 small-767:text-gray-500 small-767:text-[14px] small-767:font-medium small-767:leading-[18px] small-767:not-italic small-767:tracking-[0.16px]">
                        {dateObj.day}
                    </span>
                    {dateObj.date}
                </button>
            ))}

            {/* Handle - visible all the time when dates are selected */}
            {selectedDates.length > 0 && (
                <>
                    {isDragging && showTooltip && (
                        <div
                            className="absolute z-30 bg-gray-900 text-white shadow-lg rounded-md p-2 text-sm whitespace-nowrap"
                            style={{
                                bottom: '100%',
                                left: `${previewWidth + 12}px`,
                                transform: 'translateX(-50%)',
                                marginBottom: '10px'
                            }}
                        >
                            Pull to capture a larger period
                            <div
                                className="absolute top-full left-1/2 -translate-x-1/2"
                                style={{
                                    width: 0,
                                    height: 0,
                                    borderLeft: '8px solid transparent',
                                    borderRight: '8px solid transparent',
                                    borderTop: '8px solid black'
                                }}
                            />
                        </div>
                    )}

                    <div
                        className={`absolute top-1/2 -translate-y-1/2 small-767:hidden block cursor-ew-resize z-20 ${isDragging ? 'opacity-100' : 'opacity-100'}`}
                        style={{
                            left: `calc(${(selectedDates.length * 100 / dates.length) - (18 - ((selectedDates.length - 1) * 6))}% - 12px)`,
                        }}
                        onMouseDown={handleDragStart}
                        onTouchStart={handleDragStart}
                    >
                        {!isDragging && <ArrowHandle />}
                    </div>

                    <div
                        className={`absolute top-1/2 -translate-y-1/2 small-767:block hidden cursor-ew-resize z-20 ${isDragging ? 'opacity-100' : 'opacity-100'}`}
                        style={{
                            left: `calc(${(selectedDates.length * 100 / dates.length) - (7 - ((selectedDates.length - 1) * 4))}% - 12px)`,
                        }}
                        onMouseDown={handleDragStart}
                        onTouchStart={handleDragStart}
                    >
                        {!isDragging && <ArrowHandle />}
                    </div>
                </>
            )}
            {isDragging && (
                <div
                    className="absolute top-1/2 -translate-y-1/2 cursor-ew-resize z-20"
                    style={{
                        left: `${previewWidth + 1}px`,
                    }}
                >
                    <ArrowHandle2 />
                </div>
            )}
        </div>
    );
};

export default DateSelectorAnimation;