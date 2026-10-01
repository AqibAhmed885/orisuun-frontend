'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Button from '@/components/ui/button';
import { getAllResources, updateResource } from '@/app/api/admin/resources';
import { getCountryList, getCityList, getStateList, getResourceTypes, CountryItem, StateItem, CityItem, ResourceTypeItem } from '@/app/api/marketing/resources';

interface AdminResourceFormState {
  Id: string;
  ResourceTypeId: string;
  Name: string;
  Sponsor: string;
  CountryId: string;
  StateId: string;
  CityId: string;
  RegionId: string;
  ApplicationDeadline: string;
  StartDate: string;
  EndDate: string;
  ContactEmail: string;
  Eligibility: string;
  Description: string;
  Address: string;
  WebsiteLink: string;
  SocialLinks: string;
  IsPaused: boolean;
  DebtAvailable: boolean;
  EquityAvailable: boolean;
  isBlackFocused: boolean;
  IsLocationVirtual: boolean;
  IsEquityNegotiated: boolean;
  IsNationWide: boolean;
  IsStateWide: boolean;
  ResourceFrequency: string;
  CurrencySymbol: string;
  ExpirationDate: string;
  DeadLineType: string;
  EventDate: string;
  AcceleratorDetails: {
    InvestmentAmount: string;
    EquityAmount: string;
    HasMentors: boolean;
    HasInvestorDay: boolean;
  };
  GrantDetails: {
    GrantAmount: string;
  };
  CompetitionDetails: {
    CompetitionDate: string;
    PrizeAmount: string;
  };
}

const emptyFormState: AdminResourceFormState = {
  Id: '',
  ResourceTypeId: '',
  Name: '',
  Sponsor: '',
  CountryId: '',
  StateId: '',
  CityId: '',
  RegionId: '',
  ApplicationDeadline: '',
  StartDate: '',
  EndDate: '',
  ContactEmail: '',
  Eligibility: '',
  Description: '',
  Address: '',
  WebsiteLink: '',
  SocialLinks: '',
  IsPaused: false,
  DebtAvailable: false,
  EquityAvailable: false,
  isBlackFocused: false,
  IsLocationVirtual: false,
  IsEquityNegotiated: false,
  IsNationWide: false,
  IsStateWide: false,
  ResourceFrequency: '',
  CurrencySymbol: '',
  ExpirationDate: '',
  DeadLineType: 'Standard',
  EventDate: '',
  AcceleratorDetails: {
    InvestmentAmount: '',
    EquityAmount: '',
    HasMentors: false,
    HasInvestorDay: false,
  },
  GrantDetails: {
    GrantAmount: '',
  },
  CompetitionDetails: {
    CompetitionDate: '',
    PrizeAmount: '',
  },
};

const formatDateInput = (value?: string | null): string => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const toNumberOrZero = (value: string): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const toIsoOrNull = (value: string): string | null => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
};

const normalizeResourceToForm = (resource: any): AdminResourceFormState => {
  const accelerator = resource?.AcceleratorDetails || {};
  const grant = resource?.GrantDetails || {};
  const competition = resource?.CompetitionDetails || {};

  return {
    ...emptyFormState,
    Id: resource?.Id || '',
    ResourceTypeId: resource?.ResourceTypeId ? String(resource.ResourceTypeId) : '',
    Name: resource?.Name || '',
    Sponsor: resource?.Sponsor || '',
    CountryId: resource?.CountryId ? String(resource.CountryId) : '',
    StateId: resource?.StateId ? String(resource.StateId) : '',
    CityId: resource?.CityId ? String(resource.CityId) : '',
    RegionId: resource?.RegionId ? String(resource.RegionId) : '',
    ApplicationDeadline: formatDateInput(resource?.ApplicationDeadline),
    StartDate: formatDateInput(resource?.StartDate),
    EndDate: formatDateInput(resource?.EndDate),
    ContactEmail: resource?.ContactEmail || '',
    Eligibility: resource?.Eligibility || '',
    Description: resource?.Description || '',
    Address: resource?.Address || '',
    WebsiteLink: resource?.WebsiteLink || '',
    SocialLinks: resource?.SocialLinks || '',
    IsPaused: Boolean(resource?.IsPaused),
    DebtAvailable: Boolean(resource?.DebtAvailable),
    EquityAvailable: Boolean(resource?.EquityAvailable),
    isBlackFocused: Boolean(resource?.isBlackFocused ?? resource?.IsBlackFocused),
    IsLocationVirtual: Boolean(resource?.IsLocationVirtual),
    IsEquityNegotiated: Boolean(resource?.IsEquityNegotiated),
    IsNationWide: Boolean(resource?.IsNationWide),
    IsStateWide: Boolean(resource?.IsStateWide),
    ResourceFrequency: resource?.ResourceFrequency || '',
    CurrencySymbol: resource?.CurrencySymbol || '',
    ExpirationDate: formatDateInput(resource?.ExpirationDate),
    DeadLineType: resource?.DeadLineType || resource?.DeadlineType || 'Standard',
    EventDate: formatDateInput(resource?.EventDate),
    AcceleratorDetails: {
      InvestmentAmount: accelerator?.InvestmentAmount ? String(accelerator.InvestmentAmount) : '',
      EquityAmount: accelerator?.EquityAmount ? String(accelerator.EquityAmount) : '',
      HasMentors: Boolean(accelerator?.HasMentors),
      HasInvestorDay: Boolean(accelerator?.HasInvestorDay),
    },
    GrantDetails: {
      GrantAmount: grant?.GrantAmount ? String(grant.GrantAmount) : '',
    },
    CompetitionDetails: {
      CompetitionDate: formatDateInput(competition?.CompetitionDate),
      PrizeAmount: competition?.PrizeAmount ? String(competition.PrizeAmount) : '',
    },
  };
};

const buildPayload = (data: AdminResourceFormState) => ({
  Id: data.Id,
  ResourceTypeId: toNumberOrZero(data.ResourceTypeId),
  Name: data.Name,
  Sponsor: data.Sponsor,
  CountryId: toNumberOrZero(data.CountryId),
  StateId: toNumberOrZero(data.StateId),
  CityId: toNumberOrZero(data.CityId),
  RegionId: toNumberOrZero(data.RegionId),
  ApplicationDeadline: toIsoOrNull(data.ApplicationDeadline),
  StartDate: toIsoOrNull(data.StartDate),
  EndDate: toIsoOrNull(data.EndDate),
  ContactEmail: data.ContactEmail,
  Eligibility: data.Eligibility,
  Description: data.Description,
  Address: data.Address,
  WebsiteLink: data.WebsiteLink,
  SocialLinks: data.SocialLinks?.trim() || null,
  IsPaused: data.IsPaused,
  DebtAvailable: data.DebtAvailable,
  EquityAvailable: data.EquityAvailable,
  isBlackFocused: data.isBlackFocused,
  IsLocationVirtual: data.IsLocationVirtual,
  IsEquityNegotiated: data.IsEquityNegotiated,
  IsNationWide: data.IsNationWide,
  IsStateWide: data.IsStateWide,
  ResourceFrequency: data.ResourceFrequency,
  CurrencySymbol: data.CurrencySymbol,
  ExpirationDate: toIsoOrNull(data.ExpirationDate),
  DeadLineType: data.DeadLineType,
  EventDate: toIsoOrNull(data.EventDate),
  AcceleratorDetails: {
    InvestmentAmount: toNumberOrZero(data.AcceleratorDetails.InvestmentAmount),
    EquityAmount: toNumberOrZero(data.AcceleratorDetails.EquityAmount),
    HasMentors: data.AcceleratorDetails.HasMentors,
    HasInvestorDay: data.AcceleratorDetails.HasInvestorDay,
  },
  GrantDetails: {
    GrantAmount: toNumberOrZero(data.GrantDetails.GrantAmount),
  },
  CompetitionDetails: {
    CompetitionDate: toIsoOrNull(data.CompetitionDetails.CompetitionDate),
    PrizeAmount: toNumberOrZero(data.CompetitionDetails.PrizeAmount),
  },
});

export default function AdminEditResourcePage() {
  const params = useParams();
  const router = useRouter();
  const resourceId = useMemo(() => (Array.isArray(params?.id) ? params?.id[0] : params?.id) as string, [params]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AdminResourceFormState>(emptyFormState);

  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);
  const [cities, setCities] = useState<CityItem[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [states, setStates] = useState<StateItem[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);
  const [resourceTypes, setResourceTypes] = useState<ResourceTypeItem[]>([]);
  const [resourceTypesLoading, setResourceTypesLoading] = useState(false);

  useEffect(() => {
    const fetchLookups = async () => {
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

    fetchLookups();
  }, []);

  useEffect(() => {
    const loadResource = async () => {
      if (!resourceId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getAllResources({ includeExpired: true, page: 1, pageSize: 1000 });
        const resource = data.find((item: any) => item.Id === resourceId);
        if (!resource) {
          setError('Resource not found.');
          return;
        }
        const normalized = normalizeResourceToForm(resource);
        setFormData(normalized);
        
        // Load cities and states if country is set
        if (normalized.CountryId) {
          const countryIdNum = Number(normalized.CountryId);
          if (countryIdNum) {
            setCitiesLoading(true);
            setStatesLoading(true);
            try {
              const [cityList, stateList] = await Promise.all([
                getCityList(countryIdNum).catch(() => []),
                getStateList(countryIdNum).catch(() => []),
              ]);
              setCities(cityList || []);
              setStates(stateList || []);
            } catch (err) {
              console.error('Failed to fetch cities or states', err);
            } finally {
              setCitiesLoading(false);
              setStatesLoading(false);
            }
          }
        }
      } catch (err) {
        setError('Failed to load resource.');
      } finally {
        setLoading(false);
      }
    };

    loadResource();
  }, [resourceId]);

  const handleCountryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryId = e.target.value;
    setFormData({ ...formData, CountryId: countryId, StateId: '', CityId: '' });
    
    if (countryId) {
      const country = countries.find(c => c.id === Number(countryId));
      if (country) {
        setCitiesLoading(true);
        setStatesLoading(true);
        try {
          const [cityList, stateList] = await Promise.all([
            getCityList(country.id).catch(() => []),
            getStateList(country.id).catch(() => []),
          ]);
          setCities(cityList || []);
          setStates(stateList || []);
          if (country.regionId) {
            setFormData(prev => ({ ...prev, CountryId: countryId, RegionId: String(country.regionId), StateId: '', CityId: '' }));
          }
        } catch (err) {
          console.error('Failed to fetch cities or states', err);
        } finally {
          setCitiesLoading(false);
          setStatesLoading(false);
        }
      }
    } else {
      setCities([]);
      setStates([]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = buildPayload(formData);
      await updateResource(payload);
      toast.success('Resource updated successfully');
      router.push('/admin/resources-management');
    } catch (err) {
      toast.error('Failed to update resource');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-10 text-center">Loading resource...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="border border-gray-200 rounded-lg p-10 text-center text-red-500">{error}</div>
        <div className="mt-4">
          <Button 
            onClick={() => router.push('/admin/resources-management')} 
            title="Back to Resources"
            variant="primary"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-h6 text-blue-600 font-semibold mb-6">Edit Resource</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resource Name <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.Name}
                onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sponsor <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.Sponsor}
                onChange={(e) => setFormData({ ...formData, Sponsor: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
              <select
                value={formData.ResourceTypeId}
                onChange={(e) => setFormData({ ...formData, ResourceTypeId: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 bg-white"
                disabled={resourceTypesLoading}
              >
                <option value="">Select Resource Type</option>
                {resourceTypes.map((rt) => (
                  <option key={rt.id} value={rt.id}>
                    {rt.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                value={formData.ContactEmail}
                onChange={(e) => setFormData({ ...formData, ContactEmail: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                value={formData.CountryId}
                onChange={handleCountryChange}
                className="w-full border rounded-lg px-3 py-2 bg-white"
                disabled={countriesLoading}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State/Province</label>
              <select
                value={formData.StateId}
                onChange={(e) => setFormData({ ...formData, StateId: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 bg-white"
                disabled={statesLoading || !formData.CountryId}
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                value={formData.CityId}
                onChange={(e) => setFormData({ ...formData, CityId: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 bg-white"
                disabled={citiesLoading || !formData.CountryId}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              value={formData.Address}
              onChange={(e) => setFormData({ ...formData, Address: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Important Dates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
              <input
                type="date"
                value={formData.ApplicationDeadline}
                onChange={(e) => setFormData({ ...formData, ApplicationDeadline: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.StartDate}
                onChange={(e) => setFormData({ ...formData, StartDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={formData.EndDate}
                onChange={(e) => setFormData({ ...formData, EndDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
              <input
                type="date"
                value={formData.ExpirationDate}
                onChange={(e) => setFormData({ ...formData, ExpirationDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
              <input
                type="date"
                value={formData.EventDate}
                onChange={(e) => setFormData({ ...formData, EventDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline Type</label>
              <select
                value={formData.DeadLineType}
                onChange={(e) => setFormData({ ...formData, DeadLineType: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 bg-white"
              >
                <option value="Standard">Standard</option>
                <option value="Rolling">Rolling</option>
                <option value="TBD">TBD</option>
                <option value="MonthYear">Month/Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resource Frequency</label>
              <input
                value={formData.ResourceFrequency}
                onChange={(e) => setFormData({ ...formData, ResourceFrequency: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="e.g., Annual, Monthly"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency Symbol</label>
              <input
                value={formData.CurrencySymbol}
                onChange={(e) => setFormData({ ...formData, CurrencySymbol: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="e.g., USD, EUR"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Website Link</label>
            <input
              value={formData.WebsiteLink}
              onChange={(e) => setFormData({ ...formData, WebsiteLink: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://"
            />
          </div>
        </div>

        {/* Description & Eligibility */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Description & Eligibility</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
            <textarea
              value={formData.Eligibility}
              onChange={(e) => setFormData({ ...formData, Eligibility: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
              placeholder="Who is eligible for this resource?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.Description}
              onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              rows={4}
              placeholder="Provide a detailed description"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Social Links (comma separated)</label>
            <input
              value={formData.SocialLinks}
              onChange={(e) => setFormData({ ...formData, SocialLinks: e.target.value })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="https://twitter.com/..., https://linkedin.com/..."
            />
          </div>
        </div>

        {/* Boolean Flags */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Resource Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.IsPaused}
                onChange={(e) => setFormData({ ...formData, IsPaused: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Paused</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.DebtAvailable}
                onChange={(e) => setFormData({ ...formData, DebtAvailable: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Debt Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.EquityAvailable}
                onChange={(e) => setFormData({ ...formData, EquityAvailable: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Equity Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isBlackFocused}
                onChange={(e) => setFormData({ ...formData, isBlackFocused: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Black Focused</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.IsLocationVirtual}
                onChange={(e) => setFormData({ ...formData, IsLocationVirtual: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Virtual Location</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.IsEquityNegotiated}
                onChange={(e) => setFormData({ ...formData, IsEquityNegotiated: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Equity Negotiated</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.IsNationWide}
                onChange={(e) => setFormData({ ...formData, IsNationWide: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Nationwide</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.IsStateWide}
                onChange={(e) => setFormData({ ...formData, IsStateWide: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Statewide</span>
            </label>
          </div>
        </div>

        {/* Accelerator Details */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Accelerator Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount</label>
              <input
                type="number"
                value={formData.AcceleratorDetails.InvestmentAmount}
                onChange={(e) => setFormData({
                  ...formData,
                  AcceleratorDetails: { ...formData.AcceleratorDetails, InvestmentAmount: e.target.value },
                })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equity Amount (%)</label>
              <input
                type="number"
                value={formData.AcceleratorDetails.EquityAmount}
                onChange={(e) => setFormData({
                  ...formData,
                  AcceleratorDetails: { ...formData.AcceleratorDetails, EquityAmount: e.target.value },
                })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="0"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.AcceleratorDetails.HasMentors}
                onChange={(e) => setFormData({
                  ...formData,
                  AcceleratorDetails: { ...formData.AcceleratorDetails, HasMentors: e.target.checked },
                })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Has Mentors</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.AcceleratorDetails.HasInvestorDay}
                onChange={(e) => setFormData({
                  ...formData,
                  AcceleratorDetails: { ...formData.AcceleratorDetails, HasInvestorDay: e.target.checked },
                })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Has Investor Day</span>
            </label>
          </div>
        </div>

        {/* Grant Details */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Grant Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grant Amount</label>
            <input
              type="number"
              value={formData.GrantDetails.GrantAmount}
              onChange={(e) => setFormData({
                ...formData,
                GrantDetails: { GrantAmount: e.target.value },
              })}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="0"
            />
          </div>
        </div>

        {/* Competition Details */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Competition Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Competition Date</label>
              <input
                type="date"
                value={formData.CompetitionDetails.CompetitionDate}
                onChange={(e) => setFormData({
                  ...formData,
                  CompetitionDetails: { ...formData.CompetitionDetails, CompetitionDate: e.target.value },
                })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prize Amount</label>
              <input
                type="number"
                value={formData.CompetitionDetails.PrizeAmount}
                onChange={(e) => setFormData({
                  ...formData,
                  CompetitionDetails: { ...formData.CompetitionDetails, PrizeAmount: e.target.value },
                })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3 pt-6">
          <Button 
            type="submit" 
            title={saving ? 'Saving...' : 'Save Changes'}
            disabled={saving}
            variant="primary"
          />
          <Button
            type="button"
            title="Cancel"
            variant="secondary"
            onClick={() => router.push('/resources-management')}
          />
        </div>
      </form>
    </div>
  );
}