import { nullable, z } from 'zod';

export const signupSchema = z
  .object({
    profileType: z
      .union([z.string(), z.number()])
      .transform((val) => (typeof val === 'string' ? parseInt(val, 10) : val))
      .refine((val) => !isNaN(val), {
        message: 'Profile type must be valid',
      }),
    planType: z
      .union([z.string(), z.number()])
      .transform((val) => (typeof val === 'string' ? parseInt(val, 10) : val))
      .refine((val) => !isNaN(val), {
        message: 'Plan type must be valid',
      }),
    billingFrequency: z
      .union([z.string(), z.number()])
      .transform((val) => (typeof val === 'string' ? parseInt(val, 10) : val))
      .refine((val) => !isNaN(val), {
        message: 'Billing Frequency must be valid',
      }),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((value) => /[a-zA-Z]/.test(value), {
        message: 'Password must contain at least one letter',
      })
      .refine((value) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value), {
        message: 'Password must contain at least one special character (!@#$%^&* etc)',
      }),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((value) => /[a-zA-Z]/.test(value), {
        message: 'Password must contain at least one letter',
      })
      .refine((value) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value), {
        message: 'Password must contain at least one special character (!@#$%^&* etc)',
      }),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const paymentSchema = z
  .object({
    payment_option: z.enum(['card', 'bank_account']),
    card_name: z.string().optional(),
    card_number: z.string().optional(),
    card_expiry: z.string().optional(),
    card_cvc: z.string().optional(),
    bank_name: z.string().optional(),
    routing_number: z.string().optional(),
    account_number: z.string().optional(),
    confirm_account_number: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.payment_option === 'card') {
      if (!data.card_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Card name is required',
          path: ['card_name'],
        });
      }
    } else if (data.payment_option === 'bank_account') {
      if (!data.bank_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Bank name is required',
          path: ['bank_name'],
        });
      }
      if (!data.routing_number) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Routing number is required',
          path: ['routing_number'],
        });
      }
      if (!data.account_number) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Account number is required',
          path: ['account_number'],
        });
      }
      if (!data.confirm_account_number) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Confirm account number is required',
          path: ['confirm_account_number'],
        });
      }
      if (data.account_number !== data.confirm_account_number) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Account numbers don't match",
          path: ['confirm_account_number'],
        });
      }
    }
  });

export const signinSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Please enter a valid email'),
  password: z.string({ required_error: 'Password is required' }),
});

export const profileBasicInfoSchema = z.object({
  profilePic: z.string({ required_error: 'Profile Pic is required' }),
  CompanyName: z
    .string({ required_error: 'Company Name is required' })
    .min(2, 'Company Name should be at least 2 characters'),
  Tagline: z
    .string({ required_error: 'Company Tagline is required' })
    .trim()
    .min(1, 'Company Tagline is required'),
  Youtubeurl: z
    .string()
    .regex(/\./, 'Invalid Youtube URL')
    .optional()
    .or(z.literal('')),
  Facebookurl: z
    .string()
    .regex(/\./, 'Invalid Facebook URL')
    .optional()
    .or(z.literal('')),
  Linkedinurl: z
    .string()
    .regex(/\./, 'Invalid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  BlueSkyurl: z
    .string()
    .regex(/\./, 'Invalid BlueSky URL')
    .optional()
    .or(z.literal('')),
  Instagramurl: z
    .string()
    .regex(/\./, 'Invalid Instagram URL')
    .optional()
    .or(z.literal('')),
  AboutCompany: z
    .string({ required_error: 'This field is required' })
    .min(1, { message: "About Company is required" })
    .max(1000, { message: "About Company must be 1000 characters or less" }),
  CompanyDetails: z.array(z.string()),
  Tags: z.array(z.string()).max(5).optional(),
  CountryOfOrigin: z
    .string({ required_error: 'Country is required' })
    .min(1, 'Country is required'),
  City: z
    .string({ required_error: 'City is required' })
    .min(1, 'City is required'),
  CustomProfileUrl: z
    .string()
    .min(1, 'Custom URL must have at least one character after orisuun.com/')
    .refine(
      (value) => {
        // Ensure the value starts with the prefix and has at least one character after the prefix
        return value.trim().length > 0;
      },
      {
        message:
          'Custom URL must start with "orisuun.com/" and have at least one character after it',
      }
    )
    .refine(
      (value) => {
        return /^[a-zA-Z0-9-]+$/.test(value); // Allow alphanumeric characters and hyphens
      },
      {
        message: 'Custom URL can only contain letters, numbers, and hyphens',
      }
    )
    .refine((value) => value.trim().length > 0, {
      message: 'Custom URL cannot be empty after orisuun.com/',
    }),
});

export const profileSkillFormSchema = z.object({
  Skills: z
    .array(
      z.object({
        SkillName: z.string().min(1, { message: 'Skill name is required' }),
        Year: z
          .string()
          .min(1, { message: 'Year is required' })
          .max(4, { message: 'Enter a valid year' })
          .regex(/^\d{4}$/, 'Year must be a 4-digit number'),
      })
    )
    .nonempty({ message: 'At least one skill is required' }),
  Experiences: z
    .array(
      z.object({
        SkillName: z
          .string()
          .min(1, { message: 'Experience name is required' }),
        Year: z
          .string()
          .min(1, { message: 'Year is required' })
          .max(4, { message: 'Enter a valid year' })
          .regex(/^\d{4}$/, 'Year must be a 4-digit number'),
        ExperienceDescription: z
          .string()
          .min(1, { message: 'Description is required' }),
      })
    )
    .nonempty({ message: 'At least one experience is required' }),
  Educations: z
    .array(
      z.object({
        DegreeName: z.string().min(1, { message: 'Degree name is required' }),
        InstituteName: z
          .string()
          .min(1, { message: 'Institution name is required' }),
        FromYear: z
          .string()
          .min(1, { message: 'From year is required' })
          .max(4, { message: 'Enter a valid year' })
          .regex(/^\d{4}$/, 'Year must be a 4-digit number'),
        ToYear: z
          .string()
          .min(1, { message: 'To year is required' })
          .max(4, { message: 'Enter a valid year' })
          .regex(/^\d{4}$/, 'Year must be a 4-digit number'),
      })
    )
    .nonempty({ message: 'At least one education is required' }),
});

export const profileBusinessInfoSchema = z
  .object({
    AddressLine1: z
      .string({ required_error: 'Address line 1 is required' })
      .min(1),
    AddressLine2: z.string().optional(),
    Country: z.string({ required_error: 'Country is required' }).min(1),
    StateId: z
      .number({ required_error: 'State ID is required' })
      .int()
      .positive(),
    State: z.string({ required_error: 'State is required' }).min(1),
    CityId: z
      .number({ required_error: 'City ID is required' })
      .int()
      .positive(),
    City: z.string({ required_error: 'City is required' }).min(1),
    Code: z.string().optional().or(z.literal('')),
    Website: z
      .string()
      .regex(/\./, 'Invalid Website URL')
      .optional()
      .or(z.literal('')),
    noOfEmployees: z
      .string({ required_error: 'No of employees is required' })
      .min(1, 'No of employees is required'),
    emailQueries: z
      .string({ required_error: 'This field is required' })
      .email()
      .min(1, 'This field is required'),
    emailBusinessDevelopment: z.string().email().or(z.literal("")).or(z.null()).optional(),
    blackOwnershipPercentage: z
      .string({ required_error: 'This field is required' })
      .min(1, 'This field is required'),
    ethinicityBlackOwnership: z.string().optional(),
    languages: z.array(z.any()).max(5).optional(),
    phoneNo: z.string().optional(),
    inBusinessSince: z.string().min(1, 'This field is required'),
    businessType: z.string().optional(),
    hours: z.string().optional(),
    hoursFrom: z.string().optional(),
    hoursTo: z.string().optional(),
    videos: z.any(),
    isPrivate: z.boolean().default(false),
    images: z.any(),
  })
  .refine(
    (data) =>
      parseInt(data.blackOwnershipPercentage) === 0 ||
      (parseInt(data.blackOwnershipPercentage) > 0 &&
        data.ethinicityBlackOwnership),
    {
      message: 'Ethnicity Black Ownership is required',
      path: ['ethinicityBlackOwnership'],
    }
  );

export const profileExpertBasicInfoSchema = z
  .object({
    Name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name is required'),
    WorkTitle: z
      .string({ required_error: 'Work Title is required' })
      .min(1, 'Work Title is required'),
    Race: z
      .string({ required_error: 'Race is required' })
      .min(1, 'Race is required'),
    Nationality: z
      .string({ required_error: 'Nationality is required' })
      .min(1, 'Nationality is required'),
    Ethinicity: z.string().nullable(), // Initially optional
    VideoLink: z
      .string()
      .regex(/\./, 'Invalid URL')
      .optional()
      .or(z.literal('')),
    AboutYou: z
      .string({ required_error: 'This field is required' })
      .max(1000, 'About Company must be 1000 characters or less'),
    AdditionalAboutYouDetails: z.array(z.string()).optional(),
    Tags: z.array(z.string()).max(5, 'Enter up to 5 tags').optional(),
    profilePic: z.any().nullable(),
    CustomProfileUrl: z
      .string()
      .min(1, 'Custom URL must have at least one character after orisuun.com/')
      .refine(
        (value) => {
          // Ensure the value starts with the prefix and has at least one character after the prefix
          return value.trim().length > 0;
        },
        {
          message:
            'Custom URL must start with "orisuun.com/" and have at least one character after it',
        }
      )
      .refine(
        (value) => {
          return /^[a-zA-Z0-9-]+$/.test(value); // Allow alphanumeric characters and hyphens
        },
        {
          message: 'Custom URL can only contain letters, numbers, and hyphens',
        }
      )
      .refine((value) => value.trim().length > 0, {
        message: 'Custom URL cannot be empty after orisuun.com/',
      }),
  })
  .refine(
    (data) => {
      // Make Ethinicity required only if Race is 'Black'
      if (data.Race === 'black' && !data.Ethinicity) {
        return false;
      }
      return true;
    },
    {
      path: ['Ethinicity'], // Point to the Ethinicity field for the error
      message: 'Ethinicity is required.',
    }
  );

export const profileIndustrySelectionInfoSchema = z.object({
  CompanyName: z.string().min(2, 'Company Name is required'),
  Tagline: z.string().min(6, 'Tagline is required'),
  Youtubeurl: z
    .string()
    .regex(/\./, 'Invalid Youtube URL')
    .optional()
    .or(z.literal('')),
  Facebookurl: z
    .string()
    .regex(/\./, 'Invalid Facebook URL')
    .optional()
    .or(z.literal('')),
  Linkedinurl: z
    .string()
    .regex(/\./, 'Invalid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  BlueSkyurl: z
    .string()
    .regex(/\./, 'Invalid BlueSky URL')
    .optional()
    .or(z.literal('')),
  Instagramurl: z
    .string()
    .regex(/\./, 'Invalid Instagram URL')
    .optional()
    .or(z.literal('')),
  AboutCompany: z
    .string({ required_error: 'This field is required' })
    .min(1, { message: "About Company is required" })
    .max(1000, { message: "About Company must be 1000 characters or less" }),
  Tags: z.array(z.string()).max(5, 'Enter up to 5 tags').optional(),
});

const AffiliationSchema = z.object({
  name: z.string().optional().nullable(),
});


const CertificationSchema = z
  .object({
    name: z.string().optional(),
    year: z
      .string()
      .optional()
      .refine((year) => !year || (year.length === 4 && /^\d{4}$/.test(year)), {
        message: 'Year must be a 4-digit number.',
      }),
  })
  .refine((data) => (data.name && data.year) || (!data.name && !data.year), {
    message: 'Year is required',
    path: ['year'],
  });

const RecognitionSchema = z
  .object({
    name: z.string().optional(),
    year: z
      .string()
      .optional()
      .refine((year) => !year || (year.length === 4 && /^\d{4}$/.test(year)), {
        message: 'Year must be a 4-digit number.',
      }),
  })
  .refine((data) => (data.name && data.year) || (!data.name && !data.year), {
    message: 'Year is required',
    path: ['year'],
  });

export const profileQualificationsInfoSchema = z.object({
  affiliations: z.array(AffiliationSchema).optional().nullable(),
  certifications: z.array(CertificationSchema).optional().nullable(),
  recognitions: z.array(RecognitionSchema).optional().nullable(),
});

const PercentageSchema = z.string().refine((val) => {
  const num = Number(val);
  return !isNaN(num) && num >= 0 && num <= 100;
}, 'Percentage must be a valid number between 0 and 100');

const ServiceSchema = z.object({
  name: z.string().min(1, 'This field cannot be empty.'),
});

const IndustryServedSchema = z.object({
  name: z.string().min(1, 'This field cannot be empty.'),
});

const LocationSchema = z.object({
  name: z.string().min(1, 'This field cannot be empty.'),
});

const BusinessChannelPercentagesSchema = z
  .object({
    individuals: z.string().optional().nullable(),
    smallBusinesses: z.string().optional().nullable(),
    midmarketBusinesses: z.string().optional().nullable(),
    enterprise: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      const total = Object.values(data)
        .filter((val): val is string => val !== null && val !== undefined)
        .reduce((sum, val) => sum + Number(val), 0);
      return (
        total === 100 ||
        Object.values(data).every((val) => val === null || val === undefined)
      );
    },
    {
      message: 'Total percentage should be 100%',
    }
  );

export const profileSkillsChartsInfoSchema = z
  .object({
    services: z.array(ServiceSchema).min(1, 'At least one entry is required.'),
    servicesPercentages: z.array(PercentageSchema),
    industryServed: z
      .array(IndustryServedSchema)
      .min(1, 'At least one entry is required.'),
    industryServedPercentages: z.array(PercentageSchema),
    locations: z
      .array(LocationSchema)
      .min(1, 'At least one entry is required.'),
    businessChannelPercentages: BusinessChannelPercentagesSchema,
  })
  .refine(
    (data) => {
      return (
        data.services.length === data.servicesPercentages.length &&
        data.servicesPercentages.reduce(
          (sum, percentage) => sum + Number(percentage),
          0
        ) === 100
      );
    },
    {
      message: 'Total percentage should be 100%',
      path: ['servicesPercentages'],
    }
  )
  .refine(
    (data) => {
      return (
        data.industryServed.length === data.industryServedPercentages.length &&
        data.industryServedPercentages.reduce(
          (sum, percentage) => sum + Number(percentage),
          0
        ) === 100
      );
    },
    {
      message: 'Total percentage should be 100%',
      path: ['industryServedPercentages'],
    }
  );

export const verificationOnlinePresenceSchema = z.object({
  WebsiteUrl: z.string().regex(/\./, 'Website Url Is Required'),
  YoutubeUrl: z
    .string()
    .regex(/\./, 'Invalid Youtube URL')
    .optional()
    .or(z.literal('')),
  FacebookUrl: z
    .string()
    .regex(/\./, 'Invalid Facebook URL')
    .optional()
    .or(z.literal('')),
  LinkedinUrl: z
    .string()
    .regex(/\./, 'Invalid LinkedIn URL')
    .optional()
    .or(z.literal('')),
  BlueSkyUrl: z
    .string()
    .regex(/\./, 'Invalid BlueSky URL')
    .optional()
    .or(z.literal('')),
  InstagramUrl: z
    .string()
    .regex(/\./, 'Invalid Instagram URL')
    .optional()
    .or(z.literal('')),
});
export const verificationBusinesseSchema = z.object({
  businessFormationDocument: z.any().nullable(),
  certificates: z.any().nullable(),
  agreements: z.any().nullable(),
  companyByLaws: z.any().nullable(),
});
export const verificationOwnershipeSchema = z.object({
  shareTransferLedger: z.any().nullable(),
  latestTaxReturn: z.any().nullable(),
  awardOrCertificate: z.any().nullable(),
  certification: z.any().nullable(),
  affiliationLetter: z.any().nullable(),
});

export const personalIdentificationPresenceSchema = z.object({
  PersionalIdentificationURL: z
    .string()
    .regex(/\./, 'Persional Identification Url Is Required'),
});

export const businessOpportunityModelSchema = z.object({
  BDId: z.number(),
  UserId: z.string(),
  BdType: z.string(),
  IndustryType: z.string(),
  IndustryList: z.array(z.string()),
  RegionId: z.number(),
  CityIds: z.array(
    z.object({
      CityId: z.number(),
    })
  ),
  CountryIds: z.array(z.number()),
  StrategyName: z.string(),
  RepresentativeName: z.string(),
  Name: z.string(),
  PhoneNumber: z.string(),
  Email: z.string(),
  OpportunityStructure: z.string(),
  timeLine: z.string(),
  Description: z.string(),
  TagsInput: z.string(),
  TacticsNames: z.array(
    z.object({
      TacticsName: z.string(),
    })
  ),
  IsFilled: z.boolean(),
});

export const bDFacilateModelSchema = z.object({
  UserId: z.string(),
  BDId: z.number(),
  MatchedId: z.number(),
  UserProfileId: z.number(),
});

export const bDOpportinutyMatchedModelSchema = z.object({
  BDOpportinutyId: z.number(),
  MatchedUserProfileId: z.number(),
  UserId: z.string(),
});

export const verficationStatementsSchema = z.object({
  Statements: z.string().max(250, 'Statements must be 200 words or less'),
});

export const businessOpportunitySchema = z.object({
  BDOpportunityType: z
    .string({ required_error: 'BDOpportunityType is required' })
    .min(1, 'BDOpportunityType is required'),
  LevelOneIndustry: z.string().min(1, 'Representative name is required'),
  IndustryList: z.array(z.string()),
  RegionId: z.number(),
  countryList: z
    .array(
      z.object({
        id: z.number(),
        value: z.string(),
      })
    )
    .optional(),
  stateList: z
    .array(
      z.object({
        id: z.number(),
        value: z.string(),
      })
    )
    .optional(),
  cityList: z
    .array(
      z.object({
        id: z.number(),
        value: z.string(),
      })
    )
    .optional(),

  strategy: z.string().min(1, 'Strategy is required'),
  tactics: z
    .array(z.string({ required_error: 'Tactics are required' }), {
      required_error: 'Tactics are required',
    })
    .min(1, 'At least one tactic is required'),
  representativeName: z.string().min(1, 'Representative name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  phone: z.string().optional(),
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email address'),
  structure: z
    .string({ required_error: 'Opportunity Structure is required' })
    .min(1, 'Opportunity Structure is required'),
  timeline: z
    .string({ required_error: 'Timeline is required' })
    .min(1, 'Timeline is required'),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed').optional(),
  description: z
    .string({ required_error: 'Opportunity Description is required' })
    .min(1, 'Opportunity Description is required')
    .max(250, 'Maximum 250 words allowed'),
});

export const contractCreateSchema = z.object({
  Title: z.string().min(1, 'Contract Title is required'),
  Description: z.string().min(10, 'A Detailed Description is required'),
  Budget: z
    .number()
    .min(0)
    .max(25000, 'Budget of the Project should be between $0 to $25000'),
  ExpiryDate: z.string().date(),
  CounterPartyName: z.string().optional(),
  Deadline: z.string().optional(),
  attachements: z.any().optional(),
  expert: z.any().optional(),
  TermsOfContact: z.string().optional().nullable(),
});

export const createBusinessMemberOpportunitySchema = z
  .object({
    LevelOneIndustry: z.string().min(1, 'Industry type is required'),
    IndustryList: z.array(z.string()).min(1, 'At least one industry is required'),
    BusinessName: z.string().min(1, 'Business name is required'),
    YearsInBusiness: z
      .string()
      .min(1, 'Years in business is required')
      .transform((val) => parseInt(val, 10)) // Transform the input to a number
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Years in business must be a positive number',
      }),
    BusinessType: z.string().min(1, 'Business type is required'),
    BusinessLocation: z
      .array(
        z.object({
          id: z.string(),
          value: z.string(),
        })
      )
      .min(1, 'Select at least one location'),
    BusinessIndustry: z.string().optional(), // Change to string
    BusinessWebsite: z
      .string()
      .optional()
      .or(z.literal(''))
      .nullable(),
    BusinessDescription: z
      .string()
      .min(1, 'Business description is required')
      .max(250, 'Maximum 250 words allowed'),
    ContactName: z.string().min(1, 'Contact name is required'),
    ContactEmail: z
      .string()
      .email('Invalid email address')
      .min(1, 'Contact email is required'),
    ContactPhone: z.string().optional(),
    RoleSought: z.string().optional(),
    RoleDescription: z.string().trim().nullable(),
    PostDuration: z.string().min(1, 'Post duration is required'),
    InvestmentRequired: z.boolean().optional(),
    PreferredExperience: z.string().optional(),
    MatchType: z
      .number()
      .int()
      .min(0, 'Match type must be a non-negative integer'),
    PostTitle: z.string().optional(),
    DurationDescription: z.string().optional().nullable(),
    PreferredExperienceDescription: z
      .string()
      .trim()
      .min(1, 'Prefereed experience is required'),
    Tags: z.array(z.string()).max(5).optional().nullable(),
    PassionateProblem: z.string().optional(), // For Co-Founder question
    StrategicPartnerTypes: z.array(z.string()).optional(), // For Board Member question
    
  })
  .superRefine((data, ctx) => {
    if (data.MatchType === 2) {
      // if (!data.PreferredExperienceDescription) {
      //   ctx.addIssue({
      //     code: z.ZodIssueCode.custom,
      //     message:
      //       'Preferred Experience Description is required',
      //     path: ['PreferredExperienceDescription'],
      //   });
      // }
      if (!data.RoleDescription) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Role Description is required',
          path: ['RoleDescription'],
        });
      }
    }
  });

export const companyInformationSchema = z
  .object({
    CompanyLogo: z.string().min(1, 'Company logo is required'),
    logo: z.any(),
    CompanyName: z.string().min(1, 'Company name is required'),
    CompanyWebsite: z.string(),
    CompanySlogan: z.string().min(1, 'Company slogan is required'),
    CompanyIndustry: z.string().optional(),
    CompanyCategory: z.string().optional(),
    CompanyType: z.string().optional(),
    CompanyDescription: z.string().min(1, 'Company description is required'),
    IsStartUps: z.boolean(),
    DiscountPercentage: z.string().optional(),
    EstimatedSavings: z.string().optional(),
    SingleDiscountCode: z.string().optional(),
    DiscountDescription: z.string().min(1, 'Discount description is required'),
    TermsOfUsing: z.string().min(1, 'Terms of using is required'),
    DiscountActivation: z.string().min(1, 'Discount activation is required'),
    DiscountType: z.string().min(1, 'Discount type is required'),
    DiscountFor: z.string().min(1, 'Discount for is required'),
    ActiveDiscount: z.string().min(1, 'Active discount is required'),
    ActivationEligibility: z.string().min(1, 'Activation eligibility required'),
    ProposalDuration: z.number().min(1, 'Proposal duration is required'),
    NumberOfDiscount: z
      .union([
        z.string().refine((val) => !isNaN(Number(val)), {
          message: 'Enter a valid number',
        }),
        z.literal('Custom'),
      ])
      .refine((val) => val !== '', {
        message: 'Number of discounts per user is required',
      }),
    DiscountCode: z.any().optional(),
    DiscountCodeString: z.string().optional(),
    DiscountOff: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (!data.DiscountCode && !data.DiscountCodeString) {
      ctx.addIssue({
        path: ['DiscountCode'],
        message:
          'Either Discount Code file or Discount Code String is required.',
        code: z.ZodIssueCode.custom,
      });
    }
    if (data.DiscountCode && data.DiscountCodeString) {
      ctx.addIssue({
        path: ['DiscountCode'],
        message:
          'Please provide either Discount Code file or Discount Code String, not both.',
        code: z.ZodIssueCode.custom,
      });
    }
  });

export const profileSchema = z.object({
  firstName: z.string().min(1, 'Enter your First Name'),
  lastName: z.string().min(1, 'Enter your Last Name'),
  email: z.string().min(1, 'Enter your Email').email('Email is Invalid'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must not exceed 50 characters')
    .min(1, 'Password is required'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
  // .refine((val: string, ctx: z.ZodContext) => val === ctx.parent.password, {
  //   message: 'Passwords do not match',
  // })
});
const rewardSchema = z.object({
  Title: z.string().min(1, 'Title is required'),
  Description: z.string().min(1, 'Description is required'),
  Pricing: z.number().min(1, 'Pricing is required'),
  Inventory: z.number().min(1, 'Inventory is required'),
  ShippingTo: z.string().min(1, 'Shipping destination is required'),
  ShippingFrom: z.string().min(1, 'Shipping origin is required'),
  EstimatedDeliveryMonth: z.string().min(1, 'Shipping month is required'),
  EstimatedDeliveryYear: z.string().min(1, 'Shipping year is required'),
});

const createUserRewardsSchema = z.object({
  RewardId: z.string(),
  CampaignId: z.string(),
  UserId: z.string(),
  ContributionId: z.string(),
  Status: z.string(),
  ShippingAddressStreetName: z.string(),
  ShippingAddressStreetNumber: z.string(),
  ShippingAddressUnit: z.string(),
  ShippingAddressPostalCode: z.number().int(),
  ShippingAddressCity: z.string(),
  ShippingAddressState: z.string(),
  ShippingAddressCountry: z.string(),
});

export const AddressFormSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name is too long'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name is too long'),
  streetName: z.string().min(1, 'Street name is required'),
  streetNumber: z.string().min(1, 'Street number is required'),
  unitNumber: z.string().min(1, 'Unit number is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid postal code'),
  country: z.string().min(1, 'Country is required'),
});

export type AddressFormTypes = z.infer<typeof AddressFormSchema>;

export const createCampaignSchema = z.object({
  Title: z.string().min(1, 'Title is required'),
  Summary: z.string().min(1, 'Summary is required'),
  Duration: z.date({
    required_error: 'Duration is required',
    invalid_type_error: 'Duration must be a valid date',
  }),
  Goal: z.number().positive('Goal must be a positive number'),
  BackgroundImage: z.string().min(1, 'Background image is required'),
  Purpose: z.string().min(1, 'Purpose is required'),
  YoutubeLink: z.string().url('Invalid YouTube link').optional(),
  LinkedInLink: z.string().url('Invalid LinkedIn link').optional(),
  BlueSkyLink: z.string().url('Invalid BlueSky link').optional(),
  FacebookLink: z.string().url('Invalid Facebook link').optional(),
  InstagramLink: z.string().url('Invalid Instagram link').optional(),
  Pictures: z.array(z.string()).optional(),
  Video: z.string().optional(),
  CampaignDetails: z.string().min(400, 'Minimum 400 characters '),
  Rewards: z.array(rewardSchema).optional(),
  Industry: z.string().min(1, 'Industry is required'),
});

export const createSponsor = z
  .object({
    Picture: z.string().min(1, 'Picture is required'),
    Name: z.string().min(1, 'Sponsor Name is required'),
    Slogan: z.string().min(1, 'Slogan is required'),
    Website: z
      .string()
      .url('Please enter a valid URL')
      .min(1, "Sponsor's website is required"),
    DurationStatus: z.string().optional(), // Optional initially
    Duration: z
      .date()
      .refine((date) => date >= new Date(), {
        message: 'Date must not be in the past',
      })
      .optional(), // Optional initially
    MaximumGift: z
      .number()
      .int()
      .min(10, 'Minimum gift should be at least $10'),
    Impact: z.string().min(1, 'Impact is required'),
    MinimumSupportAmount: z
      .number()
      .int()
      .min(1, 'Minimum Support Amount should be at least $1'),
    ShortMessage: z
      .string()
      .min(1, 'Short Message is required')
      .max(70, 'Maximum 70 characters'),
    PaymentMethodeStripeId: z.string().min(1, 'Pyament Method is required'),
    PaymentMethodType: z.string().min(1, 'Pyament Method Type is required'),
  })
  .refine((data) => data.Duration || data.DurationStatus, {
    message: 'Either Duration or DurationStatus must be provided',
    path: ['Duration'], // Attach error to Duration field
  });

export type CreateSponsorSchema = z.infer<typeof createSponsor>;

export type CampaignSchema = z.infer<typeof createCampaignSchema>;

export type UserRewradSchema = z.infer<typeof createUserRewardsSchema>;

export type SignupUserData = z.infer<typeof profileSchema>;

export type CreateBusinessMemberOpportunityData = z.infer<
  typeof createBusinessMemberOpportunitySchema
>;

export type CreateCompnayInformationData = z.infer<
  typeof companyInformationSchema
>;

export type SignupFormData = z.infer<typeof signupSchema>;

export type SigninFormData = z.infer<typeof signinSchema>;

export type ProfileBasicFormData = z.infer<typeof profileBasicInfoSchema>;
export type ProfileSkillFormData = z.infer<typeof profileSkillFormSchema>;

export type ProfileExpertBasicFormData = z.infer<
  typeof profileExpertBasicInfoSchema
>;

export type ProfileQualificationsInfoSchema = z.infer<
  typeof profileQualificationsInfoSchema
>;

export type ProfileSkillsChartsInfoSchema = z.infer<
  typeof profileSkillsChartsInfoSchema
>;

export type VerificationOnlinePresenceData = z.infer<
  typeof verificationOnlinePresenceSchema
>;

export type VerificationBusinessData = z.infer<
  typeof verificationBusinesseSchema
>;
export type VerificationOwnershipData = z.infer<
  typeof verificationOwnershipeSchema
>;

export type PersonalIdentificationData = z.infer<
  typeof personalIdentificationPresenceSchema
>;

export type VerficationStatementsData = z.infer<
  typeof verficationStatementsSchema
>;

export type BusinessOpportunitiesData = z.infer<
  typeof businessOpportunitySchema
>;

export type BDFacilateData = z.infer<typeof bDFacilateModelSchema>;

export type BDOpportinutyMatchedData = z.infer<
  typeof bDOpportinutyMatchedModelSchema
>;

export type ContractCreateData = z.infer<typeof contractCreateSchema>;

export type ProfileBusinessFormData = z.infer<typeof profileBusinessInfoSchema>;

export type PaymentSchemaFormData = z.infer<typeof paymentSchema>;
