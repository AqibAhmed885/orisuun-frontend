import React, { useState, useEffect } from 'react'
import { X } from 'react-feather';
import AddResourceStep1 from './AddResourceStep1';
import AddResourceStep2 from './AddResourceStep2';
import { toast } from 'react-toastify';
import { getCountryList, getCityList, getStateList, CountryItem, StateItem, CityItem, saveResource, getResourceTypes, ResourceTypeItem } from '@/app/api/marketing/resources';
import { pluralizeResourceTypeName } from '@/utils/resourceType';
import { notifySearchEngines } from '@/utils/sitemapNotifier';


interface FormDataType {
  resourceType: string;
  resourceTypeId?: number;
  name: string;
  sponsor: string;
  isBlackFocused: string;
  IsLocationVirtual?: string | boolean;
  IsNationWide?: string | boolean;
  IsStateWide?: string | boolean;
  country: string;
  countryId?: string | number;
  regionId?: number;
  state: string;
  stateId?: string | number;
  city: string;
  cityId?: string | number;
  address: string;
  applicationDeadline: string;
  deadlineType?: string;
  competitionDate: string;
  eligibility: string;
  description: string;
  email: string;
  expirationDate: string;
  website: string;
  socials: string[];
  captcha: string;
  // Add missing fields
  investmentAmount?: string;
  investmentCurrency?: string;
  equityRequirement?: string;
  IsEquityNegotiated?: string | boolean;
  mentorshipAvailable?: string;
  investmentDay?: string;
  equityAvailable?: string;
  debtAvailable?: string;
  prizeAmount?: string;
  prizeCurrency?: string;
  grantAmount?: string;
  grantCurrency?: string;
  frequency?: string;
  startDate?: string;
  endDate?: string;
}

interface ErrorsType {
  resourceType?: string;
  name?: string;
  sponsor?: string;
  isBlackFocused?: string;
  country?: string;
  applicationDeadline?: string;
  eligibility?: string;
  email?: string;
  expirationDate?: string;
  captcha?: string;
  state?: string;
  city?: string;
  address?: string;
  description?: string;
  website?: string;
  // Type-specific field errors
  investmentAmount?: string;
  equityRequirement?: string;
  mentorshipAvailable?: string;
  investmentDay?: string;
  startDate?: string;
  endDate?: string;
  prizeAmount?: string;
  competitionDate?: string;
  grantAmount?: string;
  frequency?: string;
  equityAvailable?: string;
  debtAvailable?: string;
  IsLocationVirtual?: string;
  IsNationWide?: string;
  IsStateWide?: string;
  deadlineType?: string;
}

const AddResourceForm = ({ showModal, setShowModal }) => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormDataType>({
    resourceType: "",
    resourceTypeId: 0,
    name: "",
    sponsor: "",
    isBlackFocused: "",
    IsLocationVirtual: "No",
    IsNationWide: "No",
    IsStateWide: "No",
    country: "",
    state: "",
    city: "",
    address: "",
    applicationDeadline: "",
    deadlineType: "Standard",
    competitionDate: "",
    eligibility: "",
    description: "",
    email: "",
    expirationDate: "",
    website: "",
    socials: ["", ""],
    equityAvailable: "",
    debtAvailable: "",
    captcha: "",
    investmentAmount: "",
    investmentCurrency: "USD",
    equityRequirement: "",
    IsEquityNegotiated: "No",
    mentorshipAvailable: "",
    investmentDay: "",
    prizeAmount: "",
    prizeCurrency: "USD",
    grantAmount: "",
    grantCurrency: "USD",
    frequency: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState<ErrorsType>({});



  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [states, setStates] = useState<StateItem[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [resourceTypes, setResourceTypes] = useState<ResourceTypeItem[]>([]);
  const [resourceTypesLoading, setResourceTypesLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setCountriesLoading(true);
      setResourceTypesLoading(true);
      try {
        const [countryList, typeList] = await Promise.all([
          getCountryList(),
          getResourceTypes(),
        ]);
        setCountries(countryList);
        setResourceTypes(typeList);
      } catch (err) {
        console.error('Failed to fetch countries or resource types', err);
      } finally {
        setCountriesLoading(false);
        setResourceTypesLoading(false);
      }
    };

    fetch();
  }, []);

  // add this handler and pass it to the step component
  const handleCountrySelect = async (country: CountryItem) => {
    // store both name and id in formData
    setFormData((prev) => ({ ...prev, country: country.name, countryId: country.id, regionId: country.regionId } as any));
    // fetch cities and states in parallel
    setCitiesLoading(true);
    setStatesLoading(true);
    try {
      const [cityList, stateList] = await Promise.all([
        getCityList(country.id).catch((e) => { console.error(e); return []; }),
        // new helper from resources.ts
        getStateList(country.id).catch((e) => { console.error(e); return []; }),
      ]);
      setCities(cityList || []);
      setStates(stateList || []);
    } catch (err) {
      console.error('Failed to fetch cities or states', err);
      setCities([]);
      setStates([]);
    } finally {
      setCitiesLoading(false);
      setStatesLoading(false);
    }
  };

  // state select handler (city selected handled by handleChange from dropdown if returning string)
  const handleStateSelect = (state: StateItem) => {
    setFormData((prev) => ({ ...prev, state: state.name, stateId: state.id }));
    if (errors.state) setErrors((prev) => ({ ...prev, state: undefined }));
  };

  const handleResourceTypeSelect = (rt: ResourceTypeItem) => {
    setFormData((prev) => ({ ...prev, resourceType: rt.name, resourceTypeId: rt.id }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // support names like socials[0]
    const socialsMatch = name.match(/^socials\[(\d+)\]$/);
    if (socialsMatch) {
      const idx = Number(socialsMatch[1]);
      setFormData((prev) => {
        const next = { ...prev, socials: [...prev.socials] };
        next.socials[idx] = value;
        return next;
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // functions to add/remove socials
  const addSocial = () => {
    setFormData((prev) => ({ ...prev, socials: [...prev.socials, ""] }));
  };

  const removeSocial = (index: number) => {
    setFormData((prev) => {
      const next = { ...prev, socials: [...prev.socials] };
      next.socials.splice(index, 1);
      return next;
    });
  };

  const validateStep = (step) => {
    const newErrors: ErrorsType = {};

    // Resource types that should skip deadline and event/competition date validation
    // Normalize to plural form before comparison
    const skipDeadlineTypes = ['School Programs', 'NGO Programs', 'Government Programs'];
    const currentTypePlural = pluralizeResourceTypeName(formData.resourceType);
    const shouldSkipDeadline = skipDeadlineTypes.includes(currentTypePlural);

    if (step === 1) {
      // === Basic Required Fields ===
      if (!formData.resourceType) newErrors.resourceType = "Resource type is required.";
      if (!formData.name) newErrors.name = "Name is required.";
      if (!formData.sponsor) newErrors.sponsor = "Sponsor is required.";
      if (!formData.isBlackFocused) newErrors.isBlackFocused = "Please select if it's Black-focused.";
      
      // === Location validation based on scope ===
      const isVirtualAccelerator = formData.resourceType === "Accelerator" && formData.IsLocationVirtual === "Yes";
      const isNationwide = formData.IsNationWide === "Yes";
      const isStatewide = formData.IsStateWide === "Yes";
      const isSpecificLocation = !isNationwide && !isStatewide;

      // Country required for specific locations and statewide (unless virtual)
      if (!isVirtualAccelerator && !isNationwide && !formData.country) {
        newErrors.country = "Country is required.";
      }
      
      // State/province is OPTIONAL per requirements - no validation needed
      
      // City required only for specific locations (not nationwide/statewide/virtual)
      if (isSpecificLocation && !isVirtualAccelerator && !formData.city) {
        newErrors.city = "City is required.";
      }
      
      // Address required only for specific locations (not nationwide/statewide/virtual)
      if (isSpecificLocation && !isVirtualAccelerator && !formData.address) {
        newErrors.address = "Address is required.";
      }
      
      // Application deadline not required for School, NGO, Government programs
      if (!shouldSkipDeadline && !formData.applicationDeadline) {
        newErrors.applicationDeadline = "Application deadline is required.";
      }

      // Deadline type required when deadline is set
      if (formData.applicationDeadline && !formData.deadlineType) {
        newErrors.deadlineType = "Deadline type is required.";
      }

      // === Type-Specific Field Validation ===

      // Accelerator specific validations
      if (formData.resourceType === "Accelerator") {
        if (!formData.IsLocationVirtual) {
          newErrors.IsLocationVirtual = "Please select if location is virtual.";
        }
        if (!formData.investmentAmount) {
          newErrors.investmentAmount = "Investment amount is required.";
        }
        if (!formData.equityRequirement) {
          newErrors.equityRequirement = "Equity requirement is required.";
        }
        if (!formData.mentorshipAvailable) {
          newErrors.mentorshipAvailable = "Please select if mentorship is available.";
        }
        if (!formData.investmentDay) {
          newErrors.investmentDay = "Please select if investor day is available.";
        }
        if (!formData.startDate) {
          newErrors.startDate = "Start date is required.";
        }
        if (!formData.endDate) {
          newErrors.endDate = "End date is required.";
        }
      }

      // Competition specific validations
      if (formData.resourceType === "Competition") {
        if (!formData.prizeAmount) {
          newErrors.prizeAmount = "Prize amount is required.";
        }
        // Competition date not required for School, NGO, Government programs
        if (!shouldSkipDeadline && !formData.competitionDate) {
          newErrors.competitionDate = "Competition date is required.";
        }
      }

      // Grant specific validations
      if (formData.resourceType === "Grant") {
        if (!formData.IsNationWide && !formData.IsStateWide) {
          // Need to select nationwide or statewide for grants, or select specific location
        }
        if (!formData.grantAmount) {
          newErrors.grantAmount = "Grant amount is required.";
        }
        if (!formData.frequency) {
          newErrors.frequency = "Frequency is required.";
        }
      }

      // Non-traditional or Specialty Financing validations
      if (formData.resourceType === "Non-traditional or Specialty Financing") {
        if (!formData.equityAvailable) {
          newErrors.equityAvailable = "Please select if equity is available.";
        }
        if (!formData.debtAvailable) {
          newErrors.debtAvailable = "Please select if debt is available.";
        }
      }

    } else if (step === 2) {
      // === Step 2 Required Fields ===
      if (!formData.eligibility) newErrors.eligibility = "Eligibility is required.";
      if (!formData.description) newErrors.description = "Description is required.";
      if (!formData.expirationDate) newErrors.expirationDate = "Expiration date is required.";
      if (!formData.website) newErrors.website = "Website is required.";

      // Contact email is OPTIONAL per requirements - no validation needed
      // Social media is OPTIONAL per requirements - no validation needed
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(1)) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(2)) {

      // Build payload with corrected conditionals (includes currency fields)
      const payload = {
        ResourceTypeId: formData.resourceTypeId,
        Name: formData.name,
        Sponsor: formData.sponsor,
        CountryId: formData.countryId || null,
        StateId: formData.stateId || null,
        CityId: formData.cityId || null,
        RegionId: formData.regionId || null,
        ApplicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline).toISOString() : null,
        DeadlineType: formData.deadlineType || "Standard",
        StartDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        EndDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        ContactEmail: formData.email,
        Eligibility: formData.eligibility,
        Description: formData.description,
        Address: formData.address,
        WebsiteLink: formData.website,
        SocialLinks: formData.socials.filter(s => s.trim()).join(", ") || null,
        IsPaused: false,
        DebtAvailable: formData.debtAvailable === "Yes" ? true : false , 
        EquityAvailable: formData.equityAvailable === "Yes" ? true : false ,
        isBlackFocused: formData.isBlackFocused === "Yes" ? true : false ,
        IsLocationVirtual: formData.IsLocationVirtual === "Yes" ? true : false ,
        IsEquityNegotiated: formData.IsEquityNegotiated === "Yes" ? true : false ,
        IsNationWide: formData.IsNationWide === "Yes" ? true : false ,
        IsStateWide: formData.IsStateWide === "Yes" ? true : false ,
        ResourceFrequency: formData.frequency ,
        // pick a primary currency symbol/code for the resource — prefer type-specific currency
        CurrencySymbol: (
          formData.resourceType === 'Accelerator' ? formData.investmentCurrency
            : formData.resourceType === 'Competition' ? formData.prizeCurrency
              : formData.resourceType === 'Grant' ? formData.grantCurrency
                : formData.investmentCurrency || formData.prizeCurrency || formData.grantCurrency || 'USD'
        ),
        AcceleratorDetails: formData.resourceType === "Accelerator" ? {
          InvestmentAmount: parseFloat(formData.investmentAmount) || 0,
          EquityAmount: formData.equityRequirement === "Negotiated" ? 0 : parseFloat(formData.equityRequirement) || 0,
          HasMentors: formData.mentorshipAvailable === "Yes" ? true : false,
          HasInvestorDay: formData.investmentDay === "Yes" ? true : false,
        } : null,
        GrantDetails: formData.resourceType === "Grant" ? {
          GrantAmount: parseFloat(formData.grantAmount) || 0,
          GrantCurrency: formData.grantCurrency || 'USD',
        } : null,
        CompetitionDetails: formData.resourceType === "Competition" ? {
          CompetitionDate: formData.competitionDate ? new Date(formData.competitionDate).toISOString() : null,
          PrizeAmount: parseFloat(formData.prizeAmount) || 0,
          PrizeCurrency: formData.prizeCurrency || 'USD',
        } : null,
      };

      try {
        await saveResource(payload, formData.captcha);
        toast.success("Resource added successfully!");
        
        // Notify search engines about the new resource (non-blocking)
        notifySearchEngines('resource').catch(err => 
          console.warn('Failed to notify search engines:', err)
        );
        
        setShowModal(false);
        // Reset form (include new fields)
        setFormData({
          resourceType: "",
          resourceTypeId: 0,
          name: "",
          sponsor: "",
          isBlackFocused: "",
          IsLocationVirtual: "No",
          IsNationWide: "No",
          IsStateWide: "No",
          country: "",
          state: "",
          city: "",
          address: "",
          applicationDeadline: "",
          deadlineType: "Standard",
          competitionDate: "",
          eligibility: "",
          description: "",
          email: "",
          expirationDate: "",
          website: "",
          equityAvailable: "",
          debtAvailable: "",
          socials: ["", ""],
          captcha: "",
          investmentAmount: "",
          investmentCurrency: "USD",
          equityRequirement: "",
          IsEquityNegotiated: "No",
          mentorshipAvailable: "",
          investmentDay: "",
          prizeAmount: "",
          prizeCurrency: "USD",
          grantAmount: "",
          grantCurrency: "USD",
          frequency: "",
          startDate: "",
          endDate: "",
        });
        setStep(1);
        setErrors({});
      } catch (error) {
        console.error("Failed to create resource:", error);
        toast.error("Failed to add resource. Please try again.");
      }
    }
  };

  return showModal ? (
    <div className='fixed w-full flex bg-black-900 bg-opacity-40 inset-0 top-0 bottom-0 z-[1000] items-center justify-center '>
      <div className="relative max-w-3xl p-6 w-full overflow-y-auto max-h-[95vh] rounded-lg bg-white mx-auto overflow-hidden flex flex-col">
        <div className='flex justify-between items-center'>
          <h1 className="text-xl font-semibold mb-4">Add Resource</h1>
          <button className="text-sm text-gray-500 absolute top-2 right-2 ">
            <X onClick={() => setShowModal(false)} />
          </button>
        </div>
        {/* Step 1 */}
        {step === 1 ? (
          <AddResourceStep1
            formData={{ ...formData, resourceTypeId: String(formData.resourceTypeId ?? "") }}
            handleChange={handleChange}
            errors={{
              resourceType: errors.resourceType,
              name: errors.name,
              sponsor: errors.sponsor,
              isBlackFocused: errors.isBlackFocused,
              country: errors.country,
              state: errors.state,
              city: errors.city,
              address: errors.address,
              applicationDeadline: errors.applicationDeadline,
              // Type-specific errors
              investmentAmount: errors.investmentAmount,
              equityRequirement: errors.equityRequirement,
              mentorshipAvailable: errors.mentorshipAvailable,
              investmentDay: errors.investmentDay,
              startDate: errors.startDate,
              endDate: errors.endDate,
              prizeAmount: errors.prizeAmount,
              competitionDate: errors.competitionDate,
              grantAmount: errors.grantAmount,
              frequency: errors.frequency,
              equityAvailable: errors.equityAvailable,
              debtAvailable: errors.debtAvailable,
              IsLocationVirtual: errors.IsLocationVirtual,
              deadlineType: errors.deadlineType,
            }}
            resourceTypes={resourceTypes}
            resourceTypesLoading={resourceTypesLoading}
            countryOptions={countries}
            countryLoading={countriesLoading}
            onCountrySelect={handleCountrySelect}
            cityOptions={cities}
            cityLoading={citiesLoading}
            stateOptions={states}
            stateLoading={statesLoading}
            onStateSelect={handleStateSelect}
          />
        ) : (
          // Step 2
          <AddResourceStep2
            formData={{
              eligibility: formData.eligibility,
              description: formData.description,
              email: formData.email,
              expirationDate: formData.expirationDate,
              website: formData.website,
              socials: formData.socials,
              captcha: formData.captcha,
            }}
            handleChange={handleChange}
            addSocial={addSocial}
            removeSocial={removeSocial}
            errors={{
              eligibility: errors.eligibility,
              email: errors.email,
              expirationDate: errors.expirationDate,
              captcha: errors.captcha,
              description: errors.description,
              website: errors.website,
            }}
          />
        )}

        {/* Buttons */}
        {step === 1 ? (
          <button
            type="button"
            className="w-full mt-8 py-1.5 rounded-full bg-omblue-600 text-white font-semibold"
            onClick={handleNext}
          >
            Next
          </button>
        ) : (
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              className="w-1/2 py-1.5 rounded-full border border-omblue-300 text-omblue-600 font-semibold bg-white hover:bg-gray-50"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button
              type="button"
              className="w-1/2 py-1.5 rounded-full bg-omblue-600 text-white font-semibold hover:bg-omblue-700"
              onClick={handleSubmit}
            >
              Add Resource
            </button>
          </div>
        )}
      </div>
    </div>
  ) : null;
}

export default AddResourceForm
