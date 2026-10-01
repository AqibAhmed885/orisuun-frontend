import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import LinkedInProvider from 'next-auth/providers/linkedin';
import AzureADProvider from 'next-auth/providers/azure-ad';
import AppleProvider from 'next-auth/providers/apple';

async function generateAppleSecret() {
    // Lazy-import jsonwebtoken to avoid loading it during build-time (some environments
    // have incompatible native bindings that throw when jsonwebtoken loads). This ensures
    // the library is only required at runtime when a secret is actually needed.
    const jwtModule = await import('jsonwebtoken');
    const jwt = jwtModule && jwtModule.default ? jwtModule.default : jwtModule;

    const config = {
        appleId: 'io.orisuun.auth',
        teamId: '6ZG9VP7R9R',
        privateKey: `-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgG7xJmL9bxYSJIjEK
QtGbB5deSU0oAmhomagytKEKbdmgCgYIKoZIzj0DAQehRANCAATPPfY03hxaZqgS
x61Wvln1FAjELkHIzstXyf2P/DHMU33K5E+zVuE1TNkRJWtefKnoLGj//QbG/mJt
XcKiUNkK
-----END PRIVATE KEY-----`,
        keyId: '9534K553H4',
    };

    const token = {
        iss: config.teamId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400 * 180, // 6 months
        aud: 'https://appleid.apple.com',
        sub: config.appleId,
    };

    const signOptions = {
        algorithm: 'ES256',
        header: {
            alg: 'ES256',
            kid: config.keyId,
        },
    };

    return jwt.sign(token, config.privateKey, signOptions);
}

const authOptions = {
    debug: true, // Enable debug logs
    secret: process.env.NEXT_AUTH_SECRET,
    trustHost: true,
    useSecureCookies: true, // Force secure cookies for Cloudflare/HTTPS
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    cookies: {
        pkceCodeVerifier: {
            name: 'next-auth.pkce.code_verifier',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true, // Always secure for live site
            },
        },
        callbackUrl: {
            name: `__Secure-next-auth.callback-url`,
            options: {
                httpOnly: false,
                sameSite: 'lax',
                path: '/',
                secure: true, // Always secure for live site
            },
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_GOOGLE_CLIENT_ID || process.env.NEXT_GOOGLECLIENT_ID,
            clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET || process.env.NEXT_GOOGLECLIENT_SECRET,
            authorization: {
                params: {
                    prompt: 'select_account',
                },
            },
        }),
        LinkedInProvider({
            clientId: process.env.NEXT_LINKEDIN_CLIENT_ID || '',
            clientSecret: process.env.NEXT_LINKEDIN_CLIENT_SECRET || '',
            client: { token_endpoint_auth_method: 'client_secret_post' },
            issuer: 'https://www.linkedin.com',
            profile: (profile) => ({
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
            }),
            wellKnown:
                'https://www.linkedin.com/oauth/.well-known/openid-configuration',
            authorization: {
                params: {
                    scope: 'openid profile email',
                    prompt: 'login',
                },
            },
        }),
        AzureADProvider({
            clientId: process.env.NEXT_AZURE_APP_ID,
            clientSecret: process.env.NEXT_AZURE_SECRET_ID,
            tenantId: process.env.NEXT_AZURE_TENANT_ID,
            authorization: {
                params: {
                    scope: 'openid profile email',
                    prompt: 'select_account',
                },
            },
        }),
        AppleProvider({
            clientId: 'io.orisuun.auth',
            // Provide clientSecret as a function so secret generation is deferred to runtime
            // and does not run during build-time where importing crypto-linked dependencies
            // can fail in some Node environments.
            clientSecret: async () => await generateAppleSecret(),
            checks: ['pkce'],
            authorization: {
                params: {
                    scope: 'name email',
                },
            },
        }),
    ],
    callbacks: {
        async signIn(req) {
            return true;
        },
        async jwt({ token, account, profile }) {
            if (account && profile) {
                token.accessToken = account.access_token;
                token.email = profile.email || profile.preferred_username;
                token.name = profile.name;
                token.picture = profile.picture;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.user.email = token.email;
            session.user.name = token.name;
            session.user.image = token.picture;
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Allow redirects to any page within the same origin
            // This ensures OAuth callbacks can redirect to the correct page
            // (e.g., /signup for new users, /signin for existing users, /payment after registration)

            // If URL is relative, make it absolute
            if (url.startsWith('/')) {
                return `${baseUrl}${url}`;
            }
            // If URL is from the same origin, allow it
            if (new URL(url).origin === baseUrl) {
                return url;
            }
            // Default to base URL for external URLs
            return baseUrl;
        },
    },
    secret: process.env.NEXT_AUTH_SECRET,
    pages: {
        signIn: '/signin',
        // Don't redirect errors to signin - this was causing signup OAuth flows to fail
        // Instead, let errors redirect back to the callbackUrl so the user can retry
        verifyRequest: '/settings',
        newUser: '/signup'
    },
};

const handler = NextAuth(authOptions);

// DIAGNOSTIC LOGGING
console.log("--- AUTH DIAGNOSTICS ---");
console.log("GOOGLE_ID:", !!(process.env.NEXT_GOOGLE_CLIENT_ID || process.env.NEXT_GOOGLECLIENT_ID));
console.log("GOOGLE_SECRET:", !!(process.env.NEXT_GOOGLE_CLIENT_SECRET || process.env.NEXT_GOOGLECLIENT_SECRET));
console.log("LINKEDIN_ID:", !!process.env.NEXT_LINKEDIN_CLIENT_ID);
console.log("AZURE_ID:", !!process.env.NEXT_AZURE_APP_ID);
console.log("APPLE_ID:", !!process.env.NEXT_APPLE_CLIENT_ID);
console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
console.log("------------------------");

export const dynamic = 'force-dynamic';
export { handler as GET, handler as POST };