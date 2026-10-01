import SignUpSuperAdmin from "./components/SignupSuperAdmin";

export const metadata = {
    title: 'Orisuun | Sign Up',
    description:
        'Sign up for an account on Orisuun. Share your experience with Orisuun.com. Let us know how to make the platform better for you.',
    // keywords:
        // 'Black-Owned Business, Black Business, Black Business Network, Black Business Directory, Black Business Database, Black Startups, Business Development, Investment, Opportunities, Fundraising, Networking, Platform, Global, US, Co-founders, Board Member Search, Co-founder search, Chat, Search, Business Development Opportunity Matching',
};

export default function AddUser() {
    return (
        <div>
            <SignUpSuperAdmin />
        </div>
    );
}
