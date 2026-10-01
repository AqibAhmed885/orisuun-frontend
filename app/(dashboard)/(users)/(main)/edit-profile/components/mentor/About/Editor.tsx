'use client';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const Editor = ({ label, placeholder, name }) => {
    const { register, setValue, watch } = useFormContext();
    const value = watch(name);
    const [showListDropdown, setShowListDropdown] = useState(false);
    const bulletStyles = ['●', '○', '■', '★', '➤', '➞', '+', '◆', '☑', '☐', '☻', '☺'];
    const numberedStyles = ['1.', '1.1.', 'a)', 'i)', '→'];

    const formatListWithSymbol = (symbol) => {
        const currentText = watch(name) || '';
        const lines = currentText.split('\n').map(line => `${symbol} ${line}`);
        setValue(name, lines.join('\n'));
        setShowListDropdown(false);
    };


    const [styles, setStyles] = useState({
        bold: false,
        italic: false,
        underline: false,
        strikethrough: false
    });

    const [lineHeight, setLineHeight] = useState('1.6');
    const [showLineHeightDropdown, setShowLineHeightDropdown] = useState(false);

    const lineHeightOptions = [
        { value: '1.0', label: '1.0' },
        { value: '1.2', label: '1.2' },
        { value: '1.4', label: '1.4' },
        { value: '1.6', label: '1.6 (Default)' },
        { value: '1.8', label: '1.8' },
        { value: '2.0', label: '2.0' },
    ];

    const toggleStyle = (style) => {
        setStyles((prev) => ({ ...prev, [style]: !prev[style] }));
    };

    const getTextStyle = () =>
        `${styles.bold ? ' font-bold' : ''}${styles.italic ? ' italic' : ''}${styles.underline ? ' underline' : ''}${styles.strikethrough ? ' line-through' : ''}`;

    const handleLineHeightChange = (value) => {
        setLineHeight(value);
        setShowLineHeightDropdown(false);

    };

    const [textColor, setTextColor] = useState('#000000');
    const [showColorPicker, setShowColorPicker] = useState(false);


    return (
        <>
            <h2 className='text-[16px] text-gray-700 font-semibold'>{label}</h2>
            <div className='flex items-center justify-between border border-gray-200 rounded-t-lg px-4 py-2 bg-gray-50 mt-4'>
                <div className='text-[14px] font-medium text-gray-700 flex items-center gap-1'>
                    Normal Text
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="#101828" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className='flex items-center gap-4 text-gray-700 text-[16px]'>
                    <button
                        type="button"
                        onClick={() => toggleStyle('italic')}
                        className={styles.italic ? 'text-blue-500' : ''}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 7.33333V6H9.33333V7.33333H12.76L9.84667 16.6667H6V18H14.6667V16.6667H11.24L14.1533 7.33333H18Z" fill={styles.italic ? "#3B82F6" : "#344054"} />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => toggleStyle('bold')}
                        className={styles.bold ? 'text-blue-500' : ''}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.88494 17V6.81818H11.9616C12.7107 6.81818 13.3355 6.92921 13.8359 7.15128C14.3364 7.37334 14.7126 7.68158 14.9645 8.07599C15.2164 8.46709 15.3423 8.91785 15.3423 9.42827C15.3423 9.82599 15.2628 10.1757 15.1037 10.4773C14.9446 10.7756 14.7259 11.0208 14.4474 11.2131C14.1723 11.402 13.8575 11.5362 13.5028 11.6158V11.7152C13.8906 11.7318 14.2536 11.8411 14.5916 12.0433C14.933 12.2455 15.2098 12.5289 15.4219 12.8935C15.634 13.2547 15.7401 13.6856 15.7401 14.1861C15.7401 14.7263 15.6058 15.2086 15.3374 15.6328C15.0722 16.0537 14.6795 16.3868 14.1591 16.6321C13.6387 16.8774 12.9974 17 12.2351 17H7.88494ZM10.0376 15.2401H11.7926C12.3925 15.2401 12.83 15.1257 13.1051 14.897C13.3802 14.665 13.5178 14.3568 13.5178 13.9723C13.5178 13.6906 13.4498 13.442 13.3139 13.2266C13.178 13.0111 12.9841 12.8421 12.7322 12.7195C12.4837 12.5968 12.187 12.5355 11.8423 12.5355H10.0376V15.2401ZM10.0376 11.0788H11.6335C11.9285 11.0788 12.1903 11.0275 12.419 10.9247C12.651 10.8187 12.8333 10.6695 12.9659 10.4773C13.1018 10.285 13.1697 10.0547 13.1697 9.78622C13.1697 9.41832 13.0388 9.12169 12.777 8.89631C12.5185 8.67093 12.1506 8.55824 11.6733 8.55824H10.0376V11.0788Z" fill={styles.bold ? "#3B82F6" : "#344054"} />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => toggleStyle('underline')}
                        className={styles.underline ? 'text-blue-500' : ''}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.9148 6.81818H15.1477V13.5597C15.1477 14.2557 14.9837 14.8771 14.6555 15.424C14.3307 15.9676 13.8717 16.3968 13.2784 16.7116C12.6851 17.0232 11.9891 17.179 11.1903 17.179C10.3916 17.179 9.69555 17.0232 9.10227 16.7116C8.509 16.3968 8.0483 15.9676 7.72017 15.424C7.39536 14.8771 7.23295 14.2557 7.23295 13.5597V6.81818H8.46591V13.4602C8.46591 13.9574 8.57528 14.3999 8.79403 14.7876C9.01278 15.1721 9.32434 15.4754 9.72869 15.6974C10.1364 15.9162 10.6236 16.0256 11.1903 16.0256C11.7571 16.0256 12.2443 15.9162 12.652 15.6974C13.0597 15.4754 13.3712 15.1721 13.5866 14.7876C13.8054 14.3999 13.9148 13.9574 13.9148 13.4602V6.81818Z" fill={styles.underline ? "#3B82F6" : "#344054"} />
                            <rect x="6" y="19" width="11" height="1" fill={styles.underline ? "#3B82F6" : "#344054"} />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={() => toggleStyle('strikethrough')}
                        className={styles.strikethrough ? 'text-blue-500' : ''}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.9148 6.81818H15.1477V13.5597C15.1477 14.2557 14.9837 14.8771 14.6555 15.424C14.3307 15.9676 13.8717 16.3968 13.2784 16.7116C12.6851 17.0232 11.9891 17.179 11.1903 17.179C10.3916 17.179 9.69555 17.0232 9.10227 16.7116C8.509 16.3968 8.0483 15.9676 7.72017 15.424C7.39536 14.8771 7.23295 14.2557 7.23295 13.5597V6.81818H8.46591V13.4602C8.46591 13.9574 8.57528 14.3999 8.79403 14.7876C9.01278 15.1721 9.32434 15.4754 9.72869 15.6974C10.1364 15.9162 10.6236 16.0256 11.1903 16.0256C11.7571 16.0256 12.2443 15.9162 12.652 15.6974C13.0597 15.4754 13.3712 15.1721 13.5866 14.7876C13.8054 14.3999 13.9148 13.9574 13.9148 13.4602V6.81818Z" fill={styles.strikethrough ? "#3B82F6" : "#344054"} />
                            <rect x="6" y="12" width="11" height="1" fill={styles.strikethrough ? "#3B82F6" : "#344054"} />
                        </svg>
                    </button>

                    {/* Line Height Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            className='flex items-center gap-1'
                            onClick={() => setShowLineHeightDropdown(!showLineHeightDropdown)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14 11H5" stroke="#344054" strokeLinecap="square" strokeLinejoin="round" />
                                <path d="M17 8H5" stroke="#344054" strokeLinecap="square" strokeLinejoin="round" />
                                <path d="M17 14H5" stroke="#344054" strokeLinecap="square" strokeLinejoin="round" />
                                <path d="M14 17H5" stroke="#344054" strokeLinecap="square" strokeLinejoin="round" />
                            </svg>
                            <span className="text-sm">{lineHeight}</span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 4.5L6 7.5L9 4.5" stroke="#101828" strokeWidth="0.72" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        {showLineHeightDropdown && (
                            <div className="absolute z-10 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200">
                                {lineHeightOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        className={`w-full text-left px-4 py-2 text-sm ${lineHeight === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                                        onClick={() => handleLineHeightChange(option.value)}
                                    >

                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowListDropdown(!showListDropdown)}
                            className="flex items-center justify-center"
                        >
                            <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 5.5C3.26522 5.5 3.51957 5.39464 3.70711 5.20711C3.89464 5.01957 4 4.76522 4 4.5C4 4.23478 3.89464 3.98043 3.70711 3.79289C3.51957 3.60536 3.26522 3.5 3 3.5C2.73478 3.5 2.48043 3.60536 2.29289 3.79289C2.10536 3.98043 2 4.23478 2 4.5C2 4.76522 2.10536 5.01957 2.29289 5.20711C2.48043 5.39464 2.73478 5.5 3 5.5ZM6 4.5C6 4.36739 6.05268 4.24021 6.14645 4.14645C6.24021 4.05268 6.36739 4 6.5 4H17.5C17.6326 4 17.7598 4.05268 17.8536 4.14645C17.9473 4.24021 18 4.36739 18 4.5C18 4.63261 17.9473 4.75979 17.8536 4.85355C17.7598 4.94732 17.6326 5 17.5 5H6.5C6.36739 5 6.24021 4.94732 6.14645 4.85355C6.05268 4.75979 6 4.63261 6 4.5ZM6 9.5C6 9.36739 6.05268 9.24021 6.14645 9.14645C6.24021 9.05268 6.36739 9 6.5 9H17.5C17.6326 9 17.7598 9.05268 17.8536 9.14645C17.9473 9.24021 18 9.36739 18 9.5C18 9.63261 17.9473 9.75979 17.8536 9.85355C17.7598 9.94732 17.6326 10 17.5 10H6.5C6.36739 10 6.24021 9.94732 6.14645 9.85355C6.05268 9.75979 6 9.63261 6 9.5ZM6.5 14C6.36739 14 6.24021 14.0527 6.14645 14.1464C6.05268 14.2402 6 14.3674 6 14.5C6 14.6326 6.05268 14.7598 6.14645 14.8536C6.24021 14.9473 6.36739 15 6.5 15H17.5C17.6326 15 17.7598 14.9473 17.8536 14.8536C17.9473 14.7598 18 14.6326 18 14.5C18 14.3674 17.9473 14.2402 17.8536 14.1464C17.7598 14.0527 17.6326 14 17.5 14H6.5ZM4 14.5C4 14.7652 3.89464 15.0196 3.70711 15.2071C3.51957 15.3946 3.26522 15.5 3 15.5C2.73478 15.5 2.48043 15.3946 2.29289 15.2071C2.10536 15.0196 2 14.7652 2 14.5C2 14.2348 2.10536 13.9804 2.29289 13.7929C2.48043 13.6054 2.73478 13.5 3 13.5C3.26522 13.5 3.51957 13.6054 3.70711 13.7929C3.89464 13.9804 4 14.2348 4 14.5ZM3 10.5C3.26522 10.5 3.51957 10.3946 3.70711 10.2071C3.89464 10.0196 4 9.76522 4 9.5C4 9.23478 3.89464 8.98043 3.70711 8.79289C3.51957 8.60536 3.26522 8.5 3 8.5C2.73478 8.5 2.48043 8.60536 2.29289 8.79289C2.10536 8.98043 2 9.23478 2 9.5C2 9.76522 2.10536 10.0196 2.29289 10.2071C2.48043 10.3946 2.73478 10.5 3 10.5Z" fill="#344054" />
                                <path d="M23 8.5L26 11.5L29 8.5" stroke="#101828" stroke-width="0.72" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>

                        {showListDropdown && (
                            <div className="absolute right-0 mt-2 w-[240px] bg-white border rounded-md shadow-lg p-3 z-50">
                                <div className="mb-2">
                                    <p className="text-xs font-semibold text-gray-500 mb-1">Bullet Library</p>
                                    <div className="grid grid-cols-6 gap-2">
                                        {bulletStyles.map((symbol, idx) => (
                                            <button
                                                key={idx}
                                                className="text-lg hover:bg-gray-100 p-1 rounded"
                                                onClick={() => formatListWithSymbol(symbol)}
                                            >
                                                {symbol}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-2">
                                    <p className="text-xs font-semibold text-gray-500 mb-1">Multi-Level List</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {numberedStyles.map((symbol, idx) => (
                                            <button
                                                key={idx}
                                                className="text-sm hover:bg-gray-100 p-1 rounded text-left"
                                                onClick={() => formatListWithSymbol(symbol)}
                                            >
                                                {symbol} Item
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-semibold text-gray-500 mb-1">Document Bullets</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['●', '■', '◦'].map((symbol, idx) => (
                                            <button
                                                key={idx}
                                                className="text-lg hover:bg-gray-100 p-1 rounded"
                                                onClick={() => formatListWithSymbol(symbol)}
                                            >
                                                {symbol}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            className="flex items-center justify-center"
                            onClick={() => setShowColorPicker(!showColorPicker)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="6.5" y="6.5" width="11" height="11" rx="0.5" fill={textColor} stroke="white" />
                            </svg>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 4.5L6 7.5L9 4.5" stroke="#101828" strokeWidth="0.72" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {showColorPicker && (
                            <div className="absolute z-10 mt-2">
                                <input
                                    type="color"
                                    value={textColor}
                                    onChange={(e) => setTextColor(e.target.value)}
                                    onBlur={() => setShowColorPicker(false)} // Close when user clicks outside
                                    className="block w-10 h-10 border-none bg-transparent cursor-pointer"
                                    style={{
                                        padding: 0,
                                        appearance: 'none',
                                    }}
                                />
                            </div>
                        )}
                    </div>


                </div>
            </div>
            <textarea
                className={`w-full h-[100px] border border-gray-200 p-4 text-[16px] text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-b-lg${getTextStyle()}`}
                placeholder={placeholder}
                {...register(name)}
                value={value}
                onChange={(e) => setValue(name, e.target.value)}
                style={{ lineHeight: lineHeight, color: textColor }}
            />


            <p className='text-[14px] font-normal text-gray-600'>This will be displayed prominently on your profile</p>
        </>
    );
};

export default Editor;
