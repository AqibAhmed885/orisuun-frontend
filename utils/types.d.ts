type ActionState = {
    error?: string;
    success?: string;
  };
  
  type LogoProps = React.SVGProps<SVGSVGElement>;
  
  type ProfileType = {
    Id: number;
    UserProfileName: string;
  };
  
  type UserInitialState = {
    user: any;
    currentUser: any;
    profileData: any;
    teamData: any;
    profileTypes: ProfileType[] | null;
    verificationData: any;
    feedbackData: any;
    favouriteProfiles: any[];
  };
  
  type User = {
    id: string;
    Id?: any;
    username: string;
    email: string;
  };
  
  type AuthState = {
    userDetails: any | null;
    isAuthenticated: boolean;
    selectedProfileType: number;
  };
  
  type Industry = {
    label: string;
    value: string;
    subIndustries?: Industry[];
  };
  
  type Option = {
    label: string;
    value: string;
  };
  
  type SignInWithSocials = {
    Username: string;
    SignedUpWith: string;
    Token: string;
    RememberPassword?: boolean;
  };
  