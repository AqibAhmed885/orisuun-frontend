This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Managing Staging and Production Environments in Next.js

When working with Next.js, managing separate environments for staging and production is essential for a streamlined deployment process and environment-specific configurations. Below are steps and best practices to handle multiple environments in a Next.js project.

### 1. Using Environment Variables

Next.js allows you to define environment variables specific to each environment. You can create files like `.env.local`, `.env.development`, `.env.staging`, and `.env.production` in the root directory.

- **.env.local** - Used for local development and is ignored by Git by default.
- **.env.development** - Used for development settings, applicable when running `next dev`.
- **.env.staging** - Used for staging configurations, often when simulating production settings.
- **.env.production** - Used for production-specific configurations, only accessed during production builds (`next build`).

Example variables:

```dotenv
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_STAGING_API_URL=https://staging-api.yourdomain.com
```

### 2. Accessing Environment Variables

To use these variables in your code, you can access them with `process.env.VARIABLE_NAME`. Example:

```javascript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### 3. Customizing `next.config.js`

In `next.config.js`, you can define custom logic to handle different configurations based on the environment:

```javascript
// next.config.js
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  env: {
    API_URL: isProd ? process.env.NEXT_PUBLIC_API_URL : process.env.NEXT_PUBLIC_STAGING_API_URL,
  },
};
```

### 4. Deploying to Vercel (or other platforms)

When deploying, platforms like Vercel allow you to define environment variables for each environment (Development, Preview, Production). Navigate to your project settings to configure these.

1. **Development** - Used locally.
2. **Preview** - Used for staging builds on feature branches.
3. **Production** - Used for the main branch in production.

This approach helps you run staging and production environments independently and test thoroughly.

---

## General Project Management Tips for Next.js

To manage a Next.js project effectively, consider the following tips:

- **Use TypeScript**: Enhances type safety and reduces errors.
- **Optimize Images**: Use Next.js `Image` component to optimize images.
- **Set Up Linting and Prettier**: Ensures consistent code style and catches potential errors early.
- **Use Incremental Static Regeneration (ISR)**: Updates specific pages without requiring a full build.
- **Organize API Routes**: Place API routes in the `pages/api` directory for serverless functions.
- **Implement Custom Error Handling**: Improve user experience by adding custom error pages.
- **Utilize Code Splitting**: Only load the necessary JavaScript for each page to improve performance.

# orisuun-frontend
