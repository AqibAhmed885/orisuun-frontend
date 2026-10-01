export interface Chat {
    UserProfileType: any;
    Id: string;
    HubId: string;
    FullName: string;
    Message: string;
    ReceiverProfileImage: string;
    UnReadCount: number;
    CreatedDate: string;
    ProfileId: number;
    isVerified: number;
    LastActive: Date;
  }
  
  export interface User {
    Id: string;
    FullName: string;
    ProfilePicture: string;
  }
  
  export interface IAssets {
    Links: ILink[];
    Images: IFile[];
    Files: IFile[];
  }
  
  export interface IFile {
    Id: number;
    ChatId: number;
    Document: string;
    FileName: string;
    CreatedDate: Date;
    size: string;
  }
  
  export interface ILink {
    Id: number;
    Link: string;
    CreatedDate: Date;
    Title: string;
    Description: string;
    Image: string;
    Platform: string;
  }
  