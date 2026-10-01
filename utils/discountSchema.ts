import { z } from 'zod';

export const companyInformationSchema = z.object({
    CompanyLogo: z.string().min(1, 'Company Logo is required'),
    logo: z.any(),
    CompanyName: z.string().min(1, 'Company Name is required'),
    CompanyWebsite: z.string(),
    CompanySlogan: z.string().min(1, 'Company Slogan is required'),
    CompanyIndustry: z.string().min(1, 'Industry is required'),
    CompanyType: z.string().min(1, 'Company Type is required'),
    CompanyDescription: z.string().min(10, 'Description must be at least 10 characters long'),
});

const discountInformationSchema = z.object({
    DiscountDescription: z.string().min(1, 'Discount Description is required'),
    DiscountActivation: z.string().min(1, 'Discount Activation is required'),
    DiscountType: z.string().min(1, 'Discount type is required'),
    DiscountFor: z.string().min(1, 'Discount for is required'),
    ActiveDiscount: z.string().min(1, 'Active Discount is required'),
    ProposalDuration: z.string().min(1, 'Proposal Duration is required'),
    TermsOfUsing: z.string().min(1, 'Terms of using is required'),
    IsStartUps: z.boolean()
});

const expirySchema = z.object({
    ExpiryDate: z.string().min(1, 'Expiry Date is required'),
});

export const noOfDiscountsSchema = z.object({
    NumberOfDiscount: z.union([
        z.string().refine(val => !isNaN(Number(val)), {
            message: 'Enter a valid number',
        }),
        z.literal('Custom'),
    ]).refine(val => val !== '', {
        message: 'Number of discounts per user is required',
    }),

    DiscountCode: z.any().optional(),

    DiscountCodeString: z.string().optional(),

    SingleDiscountCode: z.string().optional(),

    DiscountOff: z.string().optional().nullable(),
}).superRefine((values, ctx) => {
    const { DiscountCode, DiscountCodeString, SingleDiscountCode } = values;
    const hasSharedCode = Boolean(SingleDiscountCode && SingleDiscountCode.trim().length > 0);

    // Check if both fields are empty or if both are provided
    if (!DiscountCode && !DiscountCodeString && !hasSharedCode) {
        ctx.addIssue({
            path: ['DiscountCodeString'], // Path to the problematic field
            message: 'Either a discount code file or string is required',
            code: z.ZodIssueCode.custom,
        });

        ctx.addIssue({
            path: ['DiscountCode'],
            message: 'Either a discount code file or string is required',
            code: z.ZodIssueCode.custom,
        });
    } else if ((DiscountCode && DiscountCodeString) || (DiscountCode && hasSharedCode)) {
        ctx.addIssue({
            path: ['DiscountCodeString'], // Path to the problematic field
            message: 'Please provide either Discount Code file or Discount Code String, not both.',
            code: z.ZodIssueCode.custom,
        });

        ctx.addIssue({
            path: ['DiscountCode'],
            message: 'Please provide either Discount Code file or Discount Code String, not both.',
            code: z.ZodIssueCode.custom,
        });
    }
});


// Combine schemas for each step
export const stepSchemas = [
    companyInformationSchema,
    discountInformationSchema,
    expirySchema,
    noOfDiscountsSchema,
];
