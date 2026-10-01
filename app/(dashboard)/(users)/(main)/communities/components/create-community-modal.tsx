"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { createCommunity, getCurrentUserId } from "@/server-actions/community";
import { useSelector } from "react-redux";
import { RootState } from "@/data/store";
import { communityApi } from "@/app/api/dashboard/community";
import { toast } from "react-toastify";

interface CreateCommunityData {
  name: string;
  description: string;
  city?: string;
  country?: string;
  imageFile?: File | null;
}

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate?: (data: CreateCommunityData) => void | Promise<void>;
  onSuccess?: (communityData: any) => void;
}

interface Country {
  Id: number;
  CountryName: string;
  RegionId: number;
}

interface City {
  Id: number;
  CityName: string;
  StateId: number;
  CountryId: number;
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [modalState, setModalState] = useState<'confirm' | 'creating' | 'success'>('confirm');
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [countryHighlightedIndex, setCountryHighlightedIndex] = useState(-1);
  const [cityHighlightedIndex, setCityHighlightedIndex] = useState(-1);

  // Get user ID from Redux store
  const { currentUser } = useSelector((state: RootState) => state.user);
  const userId = currentUser?.UserId;

  useEffect(() => {
    let isMounted = true;

    const fetchCountries = async () => {
      if (!isOpen) return;
      
      setIsLoadingCountries(true);
      try {
        const response = await communityApi.getCountries();
        if (isMounted && Array.isArray(response)) {
          setCountries(response);
          setFilteredCountries(response);
        }

        
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        if (isMounted) {
          setIsLoadingCountries(false);
        }
      }
    };

    fetchCountries();

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  useEffect(() => {
    let isMounted = true;

    const fetchCities = async () => {
      if (!selectedCountryId) {
        setCities([]);
        setFilteredCities([]);
        return;
      }

      setIsLoadingCities(true);
      try {
        const response = await communityApi.getCities(selectedCountryId);
        if (isMounted && Array.isArray(response)) {
          setCities(response);
          setFilteredCities(response);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        if (isMounted) {
          setIsLoadingCities(false);
        }
      }
    };

    fetchCities();

    return () => {
      isMounted = false;
    };
  }, [selectedCountryId]);

  // Filter countries based on search
  useEffect(() => {
    if (countrySearch.trim() === "") {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country =>
        country.CountryName.toLowerCase().includes(countrySearch.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [countrySearch, countries]);

  // Filter cities based on search
  useEffect(() => {
    if (citySearch.trim() === "") {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter(city =>
        city.CityName.toLowerCase().includes(citySearch.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [citySearch, cities]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setImageFile(f);
      setPreviewUrl(URL.createObjectURL(f));
    }
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleCancel = () => {
    // reset local state
    setName("");
    setDescription("");
    setCity("");
    setCountry("");
    setImageFile(null);
    setPreviewUrl(null);
    setError(null);
    setIsLoading(false);
    setSelectedCountryId(null);
    setSelectedCityId(null);
    setConfirmationChecked(false);
    setShowSuccess(false);
    setModalState('confirm');
    setCountrySearch("");
    setCitySearch("");
    setFilteredCountries([]);
    setFilteredCities([]);
    onClose();
  };

  const handleCreate = async () => {
    // Reset error state
    setError(null);

    // Basic validation
    if (!name.trim()) {
      setError("Community name is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    if (!country.trim()) {
      setError("Country is required");
      return;
    }
    if (!city.trim()) {
      setError("City is required");
      return;
    }
    if (!imageFile) {
      setError("Community image is required");
      return;
    }
    if (!confirmationChecked) {
      setError("You must agree to moderate your community");
      return;
    }

    if (!userId) {
      setError("You must be logged in to create a community. Please log in again.");
      return;
    }

    setModalState('creating');
    await createCommunityWithUserId(userId);
  };

  const createCommunityWithUserId = async (userIdToUse: string) => {
    setIsLoading(true);

    try {
      // Call the onCreate callback first (if provided)
      if (onCreate) {
        const legacyPayload: CreateCommunityData = {
          name,
          description,
          city,
          country,
          imageFile,
        };
        await onCreate(legacyPayload);
      }

      // Call the API to create the community
      const result = await createCommunity({
        Name: name,
        Description: description,
        CreatedBy: userIdToUse,
        City: city,
        Country: country,
        InitialMemberIds: [], // Can be extended to support initial members
        imageFile,
      });

      if (!result.success) {
        setShowSuccess(false);
        setModalState('confirm');
        setError(result.message);
        return;
      }

      // Success - show success screen
      setModalState('success');

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess(result.data);
      }
    } catch (err: any) {
      console.error('Create community error:', err);
      setShowSuccess(false);
      setModalState('confirm');
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 tracking-wide flex items-center justify-center">
        <div
          className="absolute inset-0 bg-gray-500/60"
          onClick={() => {
            if (modalState !== 'creating') {
              setShowSuccess(false);
              handleCancel();
            }
          }}
          aria-hidden
        />

        <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-[0px_4px_12px_rgba(16,24,40,0.12)] overflow-hidden">
          <div className="p-6 text-center">
            {modalState === 'confirm' ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Created!</h3>
                <p className="text-base font-medium text-gray-600 mb-6">
                  Thank you for creating a community. It needs to be approved by the Orisuun team. We&apos;ll send you a notification once we decide.
                </p>
                <button
                  onClick={() => {
                    setShowSuccess(false);
                    handleCancel();
                    handleCreate();
                  }}
                  className="w-full py-2 bg-omblue-600 text-white rounded-full text-sm hover:bg-omblue-700"
                >
                  OK
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed tracking-wide inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-gray-500/60"
        onClick={handleCancel}
        aria-hidden
      />

      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-[0px_4px_12px_rgba(16,24,40,0.12)] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold">Create community</h3>
          <button
            aria-label="Close"
            className="p-2 text-gray-500  hover:bg-gray-100 rounded"
            onClick={handleCancel}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex flex-col items-center">
            <div className="w-36 h-36 bg-gray-50 rounded-lg flex items-center justify-center mb-2 border-2 border-white overflow-hidden">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
                    <path d="M3 7a1 1 0 011-1h3l1-2h6l1 2h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth={1.5} />
                  </svg>
                </div>
              )}
            </div>

            <p className="text-base font-semibold text-gray-900 mb-1">Upload Community image</p>
            <p className="text-sm font-medium text-gray-400 mb-3">Optimal dimensions 3200 x 560px</p>

            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={handleUploadClick}
                disabled={isLoading}
                className="px-4 py-2 bg-omblue-600 text-white font-semibold rounded-full hover:bg-omblue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload Image
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Community Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter community name"
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-200 rounded-md bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-omblue-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is the purpose of your group?"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-200 rounded-md bg-white text-sm  resize-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-omblue-200"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <label className="text-sm font-semibold">Country *</label>
              <div className="relative">
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => {
                    setCountrySearch(e.target.value);
                    setCountry("");
                    setSelectedCountryId(null);
                    setSelectedCityId(null);
                    setCity("");
                    setCitySearch("");
                    setCountryHighlightedIndex(-1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setCountryHighlightedIndex(prev =>
                        prev < filteredCountries.length - 1 ? prev + 1 : prev
                      );
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setCountryHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
                    } else if (e.key === 'Enter') {
                      if (countryHighlightedIndex >= 0 && filteredCountries[countryHighlightedIndex]) {
                        const item = filteredCountries[countryHighlightedIndex];
                        setSelectedCountryId(item.Id);
                        setCountry(item.CountryName);
                        setCountrySearch(item.CountryName);
                        setSelectedCityId(null);
                        setCity("");
                        setCitySearch("");
                        setCountryHighlightedIndex(-1);
                      } else {
                        // Fallback to exact match
                        const exactMatch = filteredCountries.find(c =>
                          c.CountryName.toLowerCase() === countrySearch.toLowerCase()
                        );
                        if (exactMatch) {
                          setSelectedCountryId(exactMatch.Id);
                          setCountry(exactMatch.CountryName);
                          setCountrySearch(exactMatch.CountryName);
                          setSelectedCityId(null);
                          setCity("");
                          setCitySearch("");
                        }
                      }
                    }
                  }}
                  onBlur={() => {
                    // If user types something that matches exactly, select it
                    const exactMatch = filteredCountries.find(c =>
                      c.CountryName.toLowerCase() === countrySearch.toLowerCase()
                    );
                    if (exactMatch) {
                      setSelectedCountryId(exactMatch.Id);
                      setCountry(exactMatch.CountryName);
                      setCountrySearch(exactMatch.CountryName);
                    }
                  }}
                  placeholder="Search for a country"
                  disabled={isLoading || isLoadingCountries}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-omblue-200"
                />
                {countrySearch && !selectedCountryId && filteredCountries.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {filteredCountries.map((country, index) => (
                      <div
                        key={country.Id}
                        className={`px-4 py-2 cursor-pointer text-sm ${index === countryHighlightedIndex ? 'bg-omblue-100' : 'hover:bg-gray-100'
                          }`}
                        onClick={() => {
                          setSelectedCountryId(country.Id);
                          setCountry(country.CountryName);
                          setCountrySearch(country.CountryName);
                          setSelectedCityId(null);
                          setCity("");
                          setCitySearch("");
                          setCountryHighlightedIndex(-1);
                        }}
                      >
                        {country.CountryName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold">City *</label>
              <div className="relative">
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => {
                    setCitySearch(e.target.value);
                    setCity("");
                    setSelectedCityId(null);
                    setCityHighlightedIndex(-1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setCityHighlightedIndex(prev =>
                        prev < filteredCities.length - 1 ? prev + 1 : prev
                      );
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setCityHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
                    } else if (e.key === 'Enter') {
                      if (cityHighlightedIndex >= 0 && filteredCities[cityHighlightedIndex]) {
                        const item = filteredCities[cityHighlightedIndex];
                        setSelectedCityId(item.Id);
                        setCity(item.CityName);
                        setCitySearch(item.CityName);
                        setCityHighlightedIndex(-1);
                      } else {
                        // Fallback to exact match
                        const exactMatch = filteredCities.find(c =>
                          c.CityName.toLowerCase() === citySearch.toLowerCase()
                        );
                        if (exactMatch) {
                          setSelectedCityId(exactMatch.Id);
                          setCity(exactMatch.CityName);
                          setCitySearch(exactMatch.CityName);
                        }
                      }
                    }
                  }}
                  onBlur={() => {
                    // If user types something that matches exactly, select it
                    const exactMatch = filteredCities.find(c =>
                      c.CityName.toLowerCase() === citySearch.toLowerCase()
                    );
                    if (exactMatch) {
                      setSelectedCityId(exactMatch.Id);
                      setCity(exactMatch.CityName);
                      setCitySearch(exactMatch.CityName);
                    }
                  }}
                  placeholder="Search for a city"
                  disabled={isLoading || isLoadingCities || !selectedCountryId}
                  className="w-full px-4 py-2 border border-gray-200 rounded-md bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-omblue-200"
                />
                {citySearch && !selectedCityId && filteredCities.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {filteredCities.map((city, index) => (
                      <div
                        key={city.Id}
                        className={`px-4 py-2 cursor-pointer text-sm ${index === cityHighlightedIndex ? 'bg-omblue-100' : 'hover:bg-gray-100'
                          }`}
                        onClick={() => {
                          setSelectedCityId(city.Id);
                          setCity(city.CityName);
                          setCitySearch(city.CityName);
                          setCityHighlightedIndex(-1);
                        }}
                      >
                        {city.CityName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={confirmationChecked}
                onChange={(e) => setConfirmationChecked(e.target.checked)}
                disabled={isLoading}
                className="mt-1"
              />
              <span className="text-sm font-medium tracking-wide text-gray-700">
                You agree to moderate your community—keeping it on topic and civil by deleting posts and removing users when necessary.
              </span>
            </label>
          </div>

          <div className="flex items-center justify-between gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 py-2 border border-gray-200 rounded-full text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                setShowSuccess(true);
                setModalState('confirm');
                
              }}
              disabled={isLoading || !name.trim() || !description.trim() || !country.trim() || !city.trim() || !imageFile || !confirmationChecked}
              className="flex-1 py-2 bg-omblue-500 text-white rounded-full text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityModal;
