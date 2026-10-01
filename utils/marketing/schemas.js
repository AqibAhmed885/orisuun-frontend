import * as yup from 'yup';
import { z } from 'zod';

const US_COUNTRY_IDENTIFIERS = new Set(['US', 'USA', 'UNITED STATES', 'UNITED STATES OF AMERICA']);

const isUSCountry = (value) => {
  const normalized = (value || '').toString().trim().toUpperCase();
  return US_COUNTRY_IDENTIFIERS.has(normalized);
};

export const profileSchema = yup.object({
  firstName: yup.string().required('Enter your First Name'),
  lastName: yup.string().required('Enter your Last Name'),
  email: yup.string().required('Enter your Email').email('Email is Invalid'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must not exceed 50 characters'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Password does not match'),
  // agree: yup.boolean().oneOf([true], 'You must agree to the terms to proceed'),
});

export const detailsSchema = yup.object({
  firstName: yup.string().required('Enter your First Name'),
  lastName: yup.string().required('Enter your Last Name'),
  email: yup.string().required('Enter your Email').email('Email is Invalid'),
  city: yup.string().required('Enter your City'),
});

export const methodSchema = yup.object({
  email: yup.string().required('Enter your Email').email('Email is Invalid'),
  subscriptionKey: yup.string().required('Enter your Subscription Key'),
});

export const cardSchema = yup.object().shape({
  nameOnCard: yup.string().required('Name on Card is required'),

  billingZipCode: yup.string().when('$userCountry', {
    is: (userCountry) => isUSCountry(userCountry),
    then: (schema) =>
      schema
        .required('ZIP Code is required') // ✅ changed wording
        .matches(
          /^\d{5}(-\d{4})?$/,
          'Invalid ZIP Code format (e.g. 12345 or 12345-6789)' // ✅ clearer
        ),
    otherwise: (schema) => schema.optional(),
  }),
});

export const contributeSchema = yup.object().shape({
  fullName: yup.string().optional(),
  location: yup.string().optional(),
  choose: yup.boolean().optional(),
  amount: yup.number().required('Amount is required'),
});

export const bankSchema = yup.object().shape({
  nameOnAccount: yup.string().required('Name on Account is required'),
  routingNumber: yup
    .string()
    .required('ACH Routing Number is required')
    .matches(/^\d{9}$/, 'Routing Number must be 9 digits'),
  accountNumber: yup
    .string()
    .required('Account Number is required')
    .matches(/^\d{8,12}$/, 'Account Number must be between 8 and 12 digits'),
  confirmAccountNumber: yup
    .string()
    .required('Confirm Account Number is required')
    .oneOf([yup.ref('accountNumber')], 'Account numbers must match'),
});

// Free tier signup schema (simplified, no payment required)
export const freeSignupSchema = yup.object({
  firstName: yup.string().required('Enter your First Name'),
  lastName: yup.string().required('Enter your Last Name'),
  email: yup.string().required('Enter your Email').email('Email is Invalid'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must not exceed 50 characters'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Password does not match'),
});
