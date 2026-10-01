import React, { useState, useRef, useEffect } from 'react';
import Dropdown from '@/components/ui/dropdown';
import { CountryItem, StateItem, CityItem, ResourceTypeItem, checkResourceExists } from '@/app/api/marketing/resources';
import { CalendarPicker } from '@/components/calendar/calendar';
import { CURRENCY_SYMBOLS, getCurrencySymbol, getCurrencyName } from '@/utils/currency';
import { Calendar } from 'react-feather';

interface AddResourceStep1Props {
    formData: {
        resourceType: string;
        resourceTypeId: string;
        name: string;
        sponsor: string;
        isBlackFocused: string;
        IsLocationVirtual?: string | boolean;
        IsNationWide?: string | boolean;
        IsStateWide?: string | boolean;
        country: string;
        regionId?: number;
        countryId?: string | number;
        state: string;
        stateId?: string | number;
        city: string;
        cityId?: string | number;
        address: string;
        applicationDeadline: string;
        deadlineType?: string;
        competitionDate: string;
        investmentAmount?: string;
        investmentCurrency?: string;
        equityRequirement?: string;
        investmentDay?: string;
        mentorshipAvailable?: string;
        equityAvailable?: string;
        debtAvailable?: string;
        startDate?: string;
        endDate?: string;
        prizeAmount?: string;
        prizeCurrency?: string;
        grantAmount?: string;
        grantCurrency?: string;
        frequency?: string;

    };
    handleChange: (e: any) => void;
    errors: {
        resourceType?: string;
        resourceTypeId?: string;
        name?: string;
        sponsor?: string;
        isBlackFocused?: string;
        country?: string;
        state?: string;
        applicationDeadline?: string;
        prizeAmount?: string;
        city?: string;
        address?: string;
        // Type-specific field errors
        investmentAmount?: string;
        equityRequirement?: string;
        mentorshipAvailable?: string;
        investmentDay?: string;
        startDate?: string;
        endDate?: string;
        competitionDate?: string;
        grantAmount?: string;
        frequency?: string;
        equityAvailable?: string;
        debtAvailable?: string;
        IsLocationVirtual?: string;
        deadlineType?: string;
    };
    resourceTypes: ResourceTypeItem[];
    resourceTypesLoading?: boolean;
    countryOptions?: CountryItem[];
    countryLoading?: boolean;
    onCountrySelect?: (c: CountryItem) => void;
    cityOptions?: CityItem[];
    cityLoading?: boolean;
    stateOptions?: StateItem[];
    stateLoading?: boolean;
    onStateSelect?: (s: StateItem) => void;
    onResourceTypeSelect?: (rt: ResourceTypeItem) => void;
    disableSubmit?: boolean; // parent can pass submit disabled state aggregation
    onDuplicateStateChange?: (duplicate: boolean) => void; // notify parent of duplicate state
}

const AddResourceStep1: React.FC<AddResourceStep1Props> = ({
    formData,
    handleChange,
    errors,
    resourceTypes,
    resourceTypesLoading = false,
    countryOptions = [],
    countryLoading = false,
    onCountrySelect,
    cityOptions = [],
    cityLoading = false,
    stateOptions = [],
    stateLoading = false,
    onStateSelect,
    onResourceTypeSelect,
    disableSubmit = false,
    onDuplicateStateChange,
}) => {
    const [showAppDeadlineCalendar, setShowAppDeadlineCalendar] = useState(false);
    const [showEventDateCalendar, setShowEventDateCalendar] = useState(false);
    const [showStartDateCalendar, setShowStartDateCalendar] = useState(false);
    const [showEndDateCalendar, setShowEndDateCalendar] = useState(false);
    // Duplicate checking state
    const [resourceChecking, setResourceChecking] = useState(false);
    const [resourceExists, setResourceExists] = useState(false);
    const seqRef = useRef(0);
    const debounceRef = useRef<any>(null);

    // Debounced duplicate check for resource name + type
    useEffect(() => {
        const name = (formData.name || '').trim();
        const typeId = formData.resourceTypeId;
        if (!name || !typeId || name.length < 3) {
            setResourceExists(false);
            setResourceChecking(false);
            if (onDuplicateStateChange) onDuplicateStateChange(false);
            if (debounceRef.current) clearTimeout(debounceRef.current);
            return;
        }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setResourceChecking(true);
        const seq = ++seqRef.current;
        debounceRef.current = setTimeout(async () => {
            try {
                const exists = await checkResourceExists(name, typeId);
                if (seq === seqRef.current) {
                    setResourceExists(exists);
                    if (onDuplicateStateChange) onDuplicateStateChange(exists);
                }
            } catch (e) {
                if (seq === seqRef.current) {
                    setResourceExists(false);
                    if (onDuplicateStateChange) onDuplicateStateChange(false);
                }
            } finally {
                if (seq === seqRef.current) setResourceChecking(false);
            }
        }, 450);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [formData.name, formData.resourceTypeId, onDuplicateStateChange]);

    const runImmediateCheck = async () => {
        const name = (formData.name || '').trim();
        const typeId = formData.resourceTypeId;
        if (!name || !typeId || name.length < 3) return;
        const seq = ++seqRef.current;
        setResourceChecking(true);
        try {
            const exists = await checkResourceExists(name, typeId);
            if (seq === seqRef.current) {
                setResourceExists(exists);
                if (onDuplicateStateChange) onDuplicateStateChange(exists);
            }
        } catch {
            if (seq === seqRef.current) {
                setResourceExists(false);
                if (onDuplicateStateChange) onDuplicateStateChange(false);
            }
        } finally {
            if (seq === seqRef.current) setResourceChecking(false);
        }
    };
    return (
        <form>
            <div className="mb-4">
                <label className="block font-[550] text-gray-700 mb-1">
                    Resources type
                    <span className="text-red-500">*</span>
                </label>
                {resourceTypesLoading ? (
                    <div className="w-full border rounded-lg px-4 py-2 text-sm text-gray-500">Loading resource types...</div>
                ) : (
                        <Dropdown
                            items={resourceTypes}
                            // Match by ID if available, else by name
                            selected={
                                resourceTypes.find(
                                    (rt) =>
                                        String(rt.id) === String(formData.resourceTypeId) ||
                                        String(rt.name) === String(formData.resourceType)
                                ) || null
                            }
                            onSelect={(raw) => {
                                const selected =
                                    typeof raw === "object" && raw !== null && (raw as ResourceTypeItem).id !== undefined
                                        ? (raw as ResourceTypeItem)
                                        : resourceTypes.find(
                                            (rt) =>
                                                String(rt.id) === String(raw) ||
                                                String(rt.name) === String(raw)
                                        );

                                if (selected) {
                                    handleChange({
                                        target: { name: "resourceType", value: selected.name },
                                    });
                                    handleChange({
                                        target: { name: "resourceTypeId", value: selected.id },
                                    });

                                    if (onResourceTypeSelect) onResourceTypeSelect(selected);
                                } else if (typeof raw === "string") {
                                    // fallback for text entry
                                    handleChange({ target: { name: "resourceType", value: raw } });
                                    handleChange({ target: { name: "resourceTypeId", value: "" } });
                                }
                            }}
                            renderItem={(item) => (item as ResourceTypeItem).name}
                            placeholder="Select one"
                            className="w-full "
                            wrapperClass="py-2 rounded-lg border"
                            border={true}
                            getItemLabel={(it) => String((it as ResourceTypeItem).name)}
                            searchPlaceholder="Search resource types"
                        />


                )}
                {errors.resourceType && <p className="text-red-500 text-sm">{errors.resourceType}</p>}
            </div>
            <div className="mb-4">
                <label className="block font-[550] text-gray-700 mb-1">
                    {formData.resourceType ? `${formData.resourceType}` : ''} Name <span className="text-red-500"> * </span>
                </label>
                <input
                    name="name"
                    type="text"
                    placeholder="e.g. Innovation Lab"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={runImmediateCheck}
                    className="w-full border rounded-lg px-4 py-2"
                    disabled={resourceExists}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                {resourceChecking && !resourceExists && (
                    <p className="text-blue-500 text-xs mt-1">Checking if resource exists...</p>
                )}
                {resourceExists && (
                    <p className="text-red-500 text-xs mt-1 font-medium">⚠ A resource with this name and type already exists. Please choose a different name.</p>
                )}
            </div>
            <div className="mb-4 flex gap-4">
                <div className="flex-1">
                    <label className="block font-[550] text-gray-700 mb-1">Sponsor
                        <span className="text-red-500"> * </span>
                    </label>
                    <input
                        name="sponsor"
                        type="text"
                        placeholder="Who owns this program?"
                        value={formData.sponsor}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2"
                        disabled={resourceExists}
                    />
                    {errors.sponsor && <p className="text-red-500 text-sm">{errors.sponsor}</p>}
                </div>
                <div className="flex flex-col justify-end">
                    <label className="block font-[550] text-gray-700 mb-1">
                        Is this a Black-focused resource? <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-4 mt-2">
                        {["Yes", "No"].map((option) => (
                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                                <span
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
                                        ${formData.isBlackFocused === option
                                        ? "border-omblue-600 bg-white"
                                            : "border-gray-400 bg-white"}
                                        transition-colors duration-150`}
                                >
                                    {formData.isBlackFocused === option && (
                                        <span className="w-2.5 h-2.5 rounded-full bg-omblue-600 block" />
                                    )}
                                </span>
                                <input
                                    type="radio"
                                    name="isBlackFocused"
                                    value={option}
                                    checked={formData.isBlackFocused === option}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <span className="text-gray-700">{option}</span>
                            </label>
                        ))}
                    </div>
                    {errors.isBlackFocused && <p className="text-red-500 text-sm">{errors.isBlackFocused}</p>}
                </div>
            </div>

            {formData.resourceType === "Non-traditional or Specialty Financing" && (
                <div className="flex md:flex-row flex-col gap-6">
                    <div className="mb-4">
                        <label className="block font-[550] text-gray-700 mb-1">
                            Are equity investments available? <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4 mt-2">
                            {["Yes", "No"].map((option) => (
                                <label key={`equity-${option}`} className="flex items-center gap-2 cursor-pointer">
                                    <span
                                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
                                            ${formData.equityAvailable === option
                                                ? "border-omblue-600 bg-white"
                                                : "border-gray-400 bg-white"}
                                            transition-colors duration-150`}
                                    >
                                        {formData.equityAvailable === option && (
                                            <span className="w-2.5 h-2.5 rounded-full bg-omblue-600 block" />
                                        )}
                                    </span>
                                    <input
                                        type="radio"
                                        name="equityAvailable"
                                        value={option}
                                        checked={formData.equityAvailable === option}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <span className="text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>
                        {errors.equityAvailable && <p className="text-red-500 text-sm">{errors.equityAvailable}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block font-[550] text-gray-700 mb-1">
                            Are debt investments available? <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-4 mt-2">
                            {["Yes", "No"].map((option) => (
                                <label key={`debt-${option}`} className="flex items-center gap-2 cursor-pointer">
                                    <span
                                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
                                            ${formData.debtAvailable === option
                                                ? "border-omblue-600 bg-white"
                                                : "border-gray-400 bg-white"}
                                            transition-colors duration-150`}
                                    >
                                        {formData.debtAvailable === option && (
                                            <span className="w-2.5 h-2.5 rounded-full bg-omblue-600 block" />
                                        )}
                                    </span>
                                    <input
                                        type="radio"
                                        name="debtAvailable"
                                        value={option}
                                        checked={formData.debtAvailable === option}
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <span className="text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>
                        {errors.debtAvailable && <p className="text-red-500 text-sm">{errors.debtAvailable}</p>}
                    </div>
                </div>
            )}

            {formData.resourceType === "Accelerator"  && (
                <>
                    <div className="mb-4 flex gap-4">
                        <div className="flex-1">
                            <label className="block font-[550] text-gray-700 mb-1">
                                Investment amount <span className="text-red-500">*</span>
                            </label>
                            <div className="flex ">
                                <select
                                    name="investmentCurrency"
                                    value={formData.investmentCurrency || 'USD'}
                                    onChange={handleChange}
                                    className="border rounded-l-lg px-1 py-2 bg-white"
                                >
                                    {Object.keys(CURRENCY_SYMBOLS).map((code) => (
                                        <option key={code} value={code}>
                                            {getCurrencySymbol(code)}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    name="investmentAmount"
                                    type="text"
                                    placeholder="Enter amount"
                                    value={formData.investmentAmount}
                                    onChange={handleChange}
                                    className="flex-1 border rounded-r-lg px-4 py-2"
                                />
                            </div>
                            {errors.investmentAmount && <p className="text-red-500 text-sm">{errors.investmentAmount}</p>}
                        </div>
                        <div className="flex-1">
                            <label className="block font-[550] text-gray-700 mb-1">
                                Equity requirement <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    name="equityRequirement"
                                    type="text"
                                    placeholder="% or type 'Negotiated'"
                                    value={formData.equityRequirement}
                                    onChange={handleChange}
                                    className="flex-1 border rounded-lg px-4 py-2"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleChange({
                                            target: { name: 'equityRequirement', value: 'Negotiated' }
                                        });
                                    }}
                                    className="px-4 py-2 border rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium whitespace-nowrap"
                                >
                                    Negotiated
                                </button>
                            </div>
                            {errors.equityRequirement && <p className="text-red-500 text-sm">{errors.equityRequirement}</p>}
                        </div>
                    </div>
                    <div className="mb-4 flex gap-4">
                        <div className="flex-1">
                            <label className="block font-[550] text-gray-700 mb-1">
                                Is there an investment day? <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-4 mt-2">
                                {["Yes", "No"].map((option) => (
                                    <label key={option} className="flex items-center gap-3 cursor-pointer select-none">
                                        <span
                                            className={`w-5 h-5 flex items-center justify-center rounded-md border-2 transition-colors duration-150 ${formData.investmentDay === option
                                                    ? 'border-omblue-600 bg-white'
                                                    : 'border-gray-300 bg-white'
                                                }`}
                                        >
                                            {formData.investmentDay === option && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-omblue-600 block" />
                                            )}
                                        </span>
                                        <input
                                            type="radio"
                                            name="investmentDay"
                                            value={option}
                                            checked={formData.investmentDay === option}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <span className="text-gray-700 font-medium">{option}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.investmentDay && <p className="text-red-500 text-sm">{errors.investmentDay}</p>}
                        </div>
                        <div className="flex-1">
                            <label className="block font-[550] text-gray-700 mb-1">
                                Mentorship available? <span className="text-red-500">*</span>
                            </label>
                            <div className="flex gap-4 mt-2">
                                {["Yes", "No"].map((option) => (
                                    <label key={option} className="flex items-center gap-3 cursor-pointer select-none">
                                        <span
                                            className={`w-5 h-5 flex items-center justify-center rounded-md border-2 transition-colors duration-150 ${formData.mentorshipAvailable === option
                                                    ? 'border-omblue-600 bg-white'
                                                    : 'border-gray-300 bg-white'
                                                }`}
                                        >
                                            {formData.mentorshipAvailable === option && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-omblue-600 block" />
                                            )}
                                        </span>
                                        <input
                                            type="radio"
                                            name="mentorshipAvailable"
                                            value={option}
                                            checked={formData.mentorshipAvailable === option}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <span className="text-gray-700 font-medium">{option}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.mentorshipAvailable && <p className="text-red-500 text-sm">{errors.mentorshipAvailable}</p>}
                        </div>
                    </div>

                </>
            )}

            {/* Virtual Location Checkbox for Accelerators */}
            {formData.resourceType === "Accelerator" && (
                <div className="mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="IsLocationVirtual"
                            checked={formData.IsLocationVirtual === true || formData.IsLocationVirtual === "Yes"}
                            onChange={(e) => {
                                handleChange({
                                    target: { name: 'IsLocationVirtual', value: e.target.checked ? "Yes" : "No" }
                                });
                            }}
                            className="w-5 h-5 rounded border-gray-300 text-omblue-600 focus:ring-omblue-500"
                        />
                        <span className="font-[550] text-gray-700">
                            This is a virtual accelerator (accessible from anywhere)
                        </span>
                    </label>
                </div>
            )}


            <div className="mb-4 flex gap-4">
                <div className="flex-1">
                    <label className="block font-[550] text-gray-700 mb-1">
                        Country {formData.IsLocationVirtual !== "Yes" && formData.IsNationWide !== "Yes" && <span className="text-red-500">*</span>}
                    </label>
                    {countryLoading ? (
                        <div className="w-full border rounded-lg px-4 py-2 text-sm text-gray-500">Loading countries...</div>
                    ) : (
                        <Dropdown
                            items={countryOptions}
                            // selected expects the same shape as items; keep object match by id
                            selected={countryOptions.find((c) => String(c.id) === String(formData.countryId)) || null}
                            onSelect={(raw) => {
                                // Dropdown may return object or primitive; resolve to CountryItem
                                const selected =
                                    typeof raw === 'object' && raw !== null && (raw as CountryItem).id !== undefined
                                        ? (raw as CountryItem)
                                        : countryOptions.find(c => String(c.id) === String(raw) || String(c.name) === String(raw));
                                if (selected && onCountrySelect) onCountrySelect(selected);
                                // fallback: if Dropdown returned primitive name, propagate to change
                                if (!selected && typeof raw === 'string') {
                                    handleChange({ target: { name: 'country', value: raw } });
                                }
                            }}
                            renderItem={(item) => (item as CountryItem).name}
                            placeholder={formData.IsLocationVirtual === "Yes" ? "Optional for virtual" : "Select a country"}
                            className="w-full"
                            wrapperClass="py-2 rounded-lg"
                            border={true}
                            searchable
                            getItemLabel={(it) => String((it as CountryItem).name)}
                            searchPlaceholder="Search countries"
                        />
                    )}
                    {formData.resourceType === "Grant" && (
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="IsNationWide"
                                checked={formData.IsNationWide === true || formData.IsNationWide === "Yes"}
                                onChange={(e) => {
                                    handleChange({
                                        target: { name: 'IsNationWide', value: e.target.checked ? "Yes" : "No" }
                                    } as any);
                                    // Uncheck IsStateWide if IsNationWide is checked
                                    if (e.target.checked) {
                                        handleChange({
                                            target: { name: 'IsStateWide', value: "No" }
                                        } as any);
                                    }
                                }}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="font-[550] text-gray-700">
                                Nationwide
                            </span>
                        </label>
                    )}

                    {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
                </div>
                <div className="flex-1">
                    <label className="block font-[550] text-gray-700 mb-1">
                        State / Province {formData.IsStateWide === "Yes" && <span className="text-red-500">*</span>}
                    </label>
                    {stateLoading ? (
                        <div className="w-full border rounded-lg px-4 py-2 text-sm text-gray-500">Loading states...</div>
                    ) : (
                        <Dropdown
                            items={stateOptions}
                            selected={stateOptions.find(s => String(s.id) === String(formData.stateId)) || null}
                            onSelect={(raw) => {
                                const selected =
                                    typeof raw === 'object' && raw !== null && (raw as StateItem).id !== undefined
                                        ? (raw as StateItem)
                                        : stateOptions.find(s => String(s.id) === String(raw) || String(s.name) === String(raw));
                                if (selected && onStateSelect) onStateSelect(selected);
                                if (!selected && typeof raw === 'string') {
                                    handleChange({ target: { name: 'state', value: raw } });
                                }
                            }}
                            renderItem={(item) => (item as StateItem).name}
                            placeholder={formData.IsStateWide === "Yes" ? "Select state (required)" : "State / Province"}
                            className="w-full"
                            wrapperClass="py-2 rounded-lg"
                            border={true}
                            searchable
                            getItemLabel={(it) => String((it as StateItem).name)}
                            searchPlaceholder="Search states"
                        />
                    )}
                    {formData.resourceType === "Grant" && (
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="IsStateWide"
                                checked={formData.IsStateWide === true || formData.IsStateWide === "Yes"}
                                onChange={(e) => {
                                    handleChange({
                                        target: { name: 'IsStateWide', value: e.target.checked ? "Yes" : "No" }
                                    } as any);
                                    // Uncheck IsNationWide if IsStateWide is checked
                                    if (e.target.checked) {
                                        handleChange({
                                            target: { name: 'IsNationWide', value: "No" }
                                        } as any);
                                    }
                                }}
                                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                            />
                            <span className="font-[550] text-gray-700">
                                State-wide
                            </span>
                        </label>
                    )}

                    {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                </div>
                <div className="flex-1">
                    <label className="block font-[550] text-gray-700 mb-1">
                        City {formData.IsNationWide !== "Yes" && formData.IsStateWide !== "Yes" && <span className="text-red-500"> * </span>}
                    </label>
                    {cityLoading ? (
                        <div className="w-full border rounded-lg px-4 py-2 text-sm text-gray-500">Loading cities...</div>
                    ) : (
                        <Dropdown
                            items={cityOptions}
                            selected={cityOptions.find(c => String(c.id) === String(formData.cityId)) || null}
                            onSelect={(raw) => {
                                const selected =
                                    typeof raw === 'object' && raw !== null && (raw as CityItem).id !== undefined
                                        ? (raw as CityItem)
                                        : cityOptions.find(c => String(c.id) === String(raw) || String(c.name) === String(raw));
                                if (selected) {
                                    handleChange({ target: { name: 'city', value: selected.name } });
                                    handleChange({ target: { name: 'cityId', value: selected.id } });
                                }
                                if (!selected && typeof raw === 'string') {
                                    handleChange({ target: { name: 'city', value: raw } });
                                }
                            }}
                            renderItem={(item) => (item as CityItem).name}
                            placeholder={formData.IsNationWide === "Yes" || formData.IsStateWide === "Yes" ? "Optional for nationwide/statewide" : "Select a city"}
                            className="w-full"
                            wrapperClass="py-2 rounded-lg"
                            border={true}
                            searchable
                            getItemLabel={(it) => String((it as CityItem).name)}
                            searchPlaceholder="Search cities"
                        />
                    )}
                    {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>
            </div>
            <div className="mb-4">
                <label className="block font-[550] text-gray-700 mb-1">
                    Address {formData.IsNationWide !== "Yes" && formData.IsStateWide !== "Yes" && <span className="text-red-500"> * </span>}
                </label>
                <input
                    name="address"
                    type="text"
                    placeholder={formData.IsNationWide === "Yes" || formData.IsStateWide === "Yes" || formData.IsLocationVirtual === "Yes" ? "Optional for nationwide/statewide/virtual" : "e.g. 1022, Western"}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2"
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
            <div className="mb-4 flex gap-4">
                {/* Deadline Type */}
                <div className="flex-1">
                    <label className="block font-[550] text-gray-700 mb-1">
                        Deadline Type
                    </label>
                    <select
                        name="deadlineType"
                        value={formData.deadlineType || 'Standard'}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-4 py-2 bg-white"
                    >
                        <option value="Standard">Standard Date</option>
                        <option value="Rolling">Ongoing/Rolling</option>
                        <option value="TBD">TBD</option>
                        <option value="MonthYear">Month/Year Only</option>
                    </select>
                </div>
                
                {/* Application deadline - conditional based on type */}
                <div className="flex-1">
                    <label className="block font-[550] text-gray-700 mb-1">
                        Application deadline
                    </label>
                    {formData.deadlineType === 'Rolling' || formData.deadlineType === 'TBD' ? (
                        <input
                            name="applicationDeadline"
                            type="text"
                            value={formData.deadlineType === 'Rolling' ? 'Ongoing/Rolling' : 'TBD'}
                            readOnly
                            className="w-full border rounded-lg px-4 py-2 bg-gray-100 cursor-not-allowed"
                        />
                    ) : formData.deadlineType === 'MonthYear' ? (
                        <input
                            name="applicationDeadline"
                            type="month"
                            value={formData.applicationDeadline}
                            onChange={handleChange}
                            placeholder="Select month/year"
                            className="w-full border rounded-lg px-4 py-2 bg-white"
                        />
                    ) : (
                        <div className="relative">
                            <Calendar className='absolute left-2 top-1/2 transform -translate-y-1/2 text-omblue-300' />
                            <input
                                name="applicationDeadline"
                                type="text"
                                value={formData.applicationDeadline}
                                onFocus={() => setShowAppDeadlineCalendar(true)}
                                onClick={() => setShowAppDeadlineCalendar(true)}
                                readOnly
                                placeholder="Select date"
                                className="w-full border rounded-lg px-10 py-2 cursor-pointer bg-white"
                            />
                            {showAppDeadlineCalendar && (
                                <div className="absolute z-50 bottom-12 w-full mt-2">
                                    <CalendarPicker
                                        selectedDate={formData.applicationDeadline ? new Date(formData.applicationDeadline) : undefined}
                                        handleDateSelectFromCalender={(date) => {
                                            handleChange({
                                                target: {
                                                    name: 'applicationDeadline',
                                                    value: date.toISOString().slice(0, 10), // Format as YYYY-MM-DD
                                                },
                                            });
                                            setShowAppDeadlineCalendar(false);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    {errors.applicationDeadline && <p className="text-red-500 text-sm">{errors.applicationDeadline}</p>}
                </div>


                {formData.resourceType === "Government Program" && (
                    <>
                        {/* Event / Competition date */}
                        <div className="flex-1">
                            <label className="block font-[550] text-gray-700 mb-1">Event / Competition date</label>
                            <div className="relative">
                                <Calendar className='absolute left-2 top-1/2 transform -translate-y-1/2 text-omblue-300' />

                                <input
                                    name="competitionDate"
                                    type="text"
                                    value={formData.competitionDate}
                                    onFocus={() => setShowEventDateCalendar(true)}
                                    onClick={() => setShowEventDateCalendar(true)}
                                    readOnly
                                    placeholder="Select date"
                                    className="w-full border rounded-lg px-10 py-2 cursor-pointer bg-white"
                                />
                                {showEventDateCalendar && (
                                    <div className="absolute bottom-12 w-full z-50 mt-2">
                                        <CalendarPicker
                                            selectedDate={formData.competitionDate ? new Date(formData.competitionDate) : undefined}
                                            handleDateSelectFromCalender={(date) => {
                                                handleChange({
                                                    target: {
                                                        name: 'competitionDate',
                                                        value: date.toISOString().slice(0, 10),
                                                    },
                                                });
                                                setShowEventDateCalendar(false);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                

            </div>
            {formData.resourceType === "Accelerator" && (
                <>
                    <div className="mb-4 flex gap-4">
                        <div className="flex-1">
                            <label className="block font-[550] text-gray-700 mb-1">
                                Start date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative flex items-center">
                                {/* Calendar icon */}
                                <Calendar className='absolute left-2 top-1/2 transform -translate-y-1/2 text-omblue-300' />
                                <input
                                    name="startDate"
                                    type="text"
                                    value={formData.startDate || ""}
                                    onFocus={() => setShowStartDateCalendar(true)}
                                    onClick={() => setShowStartDateCalendar(true)}
                                    readOnly
                                    placeholder="MM-DD-YYYY"
                                    className="w-full border rounded-lg px-10 py-2 cursor-pointer bg-white text-gray-600"
                                />
                                {showStartDateCalendar && (
                                    <div className="absolute z-50 mt-2 bottom-12 w-full">
                                        <CalendarPicker
                                            selectedDate={formData.startDate ? new Date(formData.startDate) : undefined}
                                            handleDateSelectFromCalender={(date) => {
                                                handleChange({
                                                    target: {
                                                        name: 'startDate',
                                                        value: date.toISOString().slice(0, 10),
                                                    },
                                                });
                                                setShowStartDateCalendar(false);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
                        </div>
                        <div className="flex-1">
                            <label className="block font-[550] text-gray-700 mb-1">
                                End date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative flex items-center">
                                {/* Calendar icon */}
                                <Calendar className='absolute left-2 top-1/2 transform -translate-y-1/2 text-omblue-300' />
                                <input
                                    name="endDate"
                                    type="text"
                                    value={formData.endDate || ""}
                                    onFocus={() => setShowEndDateCalendar(true)}
                                    onClick={() => setShowEndDateCalendar(true)}
                                    readOnly
                                    placeholder="MM-DD-YYYY"
                                    className="w-full border rounded-lg px-10 py-2 cursor-pointer bg-white text-gray-600"
                                />
                                {showEndDateCalendar && (
                                    <div className="absolute z-50 bottom-12 mt-2 w-full">
                                        <CalendarPicker
                                            selectedDate={formData.endDate ? new Date(formData.endDate) : undefined}
                                            handleDateSelectFromCalender={(date) => {
                                                handleChange({
                                                    target: {
                                                        name: 'endDate',
                                                        value: date.toISOString().slice(0, 10),
                                                    },
                                                });
                                                setShowEndDateCalendar(false);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
                        </div>
                    </div>
                </>
            )}
            {formData.resourceType === "Competition" && (
                <>
                    <div className="mb-4">
                        <label className="block font-[550] text-gray-700 mb-1">
                            Prize amount <span className="text-red-500">*</span>
                        </label>
                        <div className="flex ">
                            <select
                                name="prizeCurrency"
                                value={formData.prizeCurrency || 'USD'}
                                onChange={handleChange}
                                className="border rounded-l-lg px-3 py-2 bg-white"
                            >
                                {Object.keys(CURRENCY_SYMBOLS).map((code) => (
                                    <option key={code} value={code}>
                                        {getCurrencySymbol(code)}
                                    </option>
                                ))}
                            </select>
                            <input
                                name="prizeAmount"
                                type="text"
                                placeholder="Enter prize amount"
                                value={formData.prizeAmount || ""}
                                onChange={handleChange}
                                className="flex-1 border rounded-r-lg px-4 py-2"
                            />
                        </div>
                        {/* Optionally show error */}
                        {errors.prizeAmount && <p className="text-red-500 text-sm">{errors.prizeAmount}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block font-[550] text-gray-700 mb-1">
                            Competition date
                        </label>
                        <div className="relative">
                            <Calendar className='absolute left-2 top-1/2 transform -translate-y-1/2 text-omblue-300' />
                            <input
                                name="competitionDate"
                                type="text"
                                value={formData.competitionDate}
                                onFocus={() => setShowEventDateCalendar(true)}
                                onClick={() => setShowEventDateCalendar(true)}
                                readOnly
                                placeholder="Select date"
                                className="w-full border rounded-lg px-10 py-2 cursor-pointer bg-white"
                            />
                            {showEventDateCalendar && (
                                <div className="absolute bottom-12 w-full z-50 mt-2">
                                    <CalendarPicker
                                        selectedDate={formData.competitionDate ? new Date(formData.competitionDate) : undefined}
                                        handleDateSelectFromCalender={(date) => {
                                            handleChange({
                                                target: {
                                                    name: 'competitionDate',
                                                    value: date.toISOString().slice(0, 10),
                                                },
                                            });
                                            setShowEventDateCalendar(false);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        {errors.competitionDate && <p className="text-red-500 text-sm">{errors.competitionDate}</p>}
                    </div>
                </>
            )}
            {formData.resourceType === "Grant" && (
                <>
                    <div className="mb-4">
                        <label className="block font-[550] text-gray-700 mb-1">
                            Grant amount <span className="text-red-500">*</span>
                        </label>
                        <div className="flex ">
                            <select
                                name="grantCurrency"
                                value={formData.grantCurrency || 'USD'}
                                onChange={handleChange}
                                className="border rounded-l-lg px-3 py-2 bg-white"
                            >
                                {Object.keys(CURRENCY_SYMBOLS).map((code) => (
                                    <option key={code} value={code}>
                                        {getCurrencySymbol(code)}
                                    </option>
                                ))}
                            </select>
                            <input
                                name="grantAmount"
                                type="text"
                                placeholder="Enter grant amount"
                                value={formData.grantAmount || ""}
                                onChange={handleChange}
                                className="flex-1 border rounded-r-lg px-4 py-2"
                            />
                        </div>
                        {errors.grantAmount && <p className="text-red-500 text-sm">{errors.grantAmount}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block font-[550] text-gray-700 mb-1">
                            Payment Frequency <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="frequency"
                            value={formData.frequency || ''}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-4 py-2 bg-white"
                        >
                            <option value="">Select frequency</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Semiannually">Semiannually</option>
                            <option value="Annually">Annually</option>
                            <option value="One-time">One-time Payment</option>
                        </select>
                        {errors.frequency && <p className="text-red-500 text-sm">{errors.frequency}</p>}
                    </div>
                </>
            )}
        </form>
    );
};

export default AddResourceStep1;