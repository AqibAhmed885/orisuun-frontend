"use client";

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { apiEndpoint } from '@/utils/utils';
import { resetAuthState } from '@/data/slices/auth-slice';
import { resetUserState } from '@/data/slices/user-slice';
import { useDispatch } from 'react-redux';
import { profileTypes } from '@/data/marketing/signupData';

const NewsletterSignupsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [signups, setSignups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('All');
  const [search, setSearch] = useState('');

  const currentUser =
    typeof window !== 'undefined' && JSON.parse(localStorage.getItem('userData') as string);

  useEffect(() => {
    fetchSignups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSignups = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiEndpoint}/Admin/GetNewsletterSignups`, {
        headers: { XApiKey: currentUser?.Token },
      });
      if (res.status === 200) {
        setSignups(res.data?.Result || []);
      }
    } catch (error: any) {
      if (error?.response?.data === 'Token is expired.') {
        handleTokenExpiration();
      } else {
        console.error('Failed to fetch newsletter signups', error);
        toast.error('Failed to load newsletter signups');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTokenExpiration = () => {
    toast.error('Token is expired');
    dispatch(resetUserState());
    dispatch(resetAuthState());
    localStorage.clear();
    Cookies.remove('token', { path: '/' });
    Cookies.remove('userData', { path: '/' });
    router.push('/signin');
  };

  const filtered = useMemo(() => {
    let rows = signups;
    if (filterType !== 'All') {
      rows = rows.filter((r: any) => r.ProfileType === filterType);
    }
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r: any) =>
          r.Name?.toLowerCase().includes(q) ||
          r.Email?.toLowerCase().includes(q) ||
          r.ProfileType?.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [signups, filterType, search]);

  return (
    <div className="p-6 tracking-wide">
      <div className="border-b border-gray-200 px-5">
        <div className="-mb-px flex items-center gap-4 py-4">
          <h2 className="text-xl font-semibold text-[#0B1636] flex items-center gap-3">
            <div className="h-12 w-[8px] rounded-r-lg bg-[#0B1636]"></div>
            <span>Newsletter Signups</span>
          </h2>
          <div className="ml-auto flex gap-3 items-center">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="All">All Types</option>
              {profileTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email"
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md py-5 mt-5">
        <div className="px-5 py-4">
          {loading ? (
            <p>Loading…</p>
          ) : filtered.length === 0 ? (
            <p>No newsletter signups found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                    <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">Email</th>
                    <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">Profile Type</th>
                    <th className="px-2 py-3 text-left text-sm font-semibold text-gray-600">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row: any, idx: number) => (
                    <tr key={idx}>
                      <td className="px-2 py-3 text-sm text-gray-800 border-t">{row.Name}</td>
                      <td className="px-2 py-3 text-sm text-gray-800 border-t">{row.Email}</td>
                      <td className="px-2 py-3 text-sm text-gray-800 border-t">{row.ProfileType}</td>
                      <td className="px-2 py-3 text-sm text-gray-800 border-t">
                        {row.CreatedDateTime ? moment(row.CreatedDateTime).format('DD MMM, YYYY hh:mm a') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignupsPage;
