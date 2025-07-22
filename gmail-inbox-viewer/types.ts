export interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  snippet: string;
  date: string;
  body: string;
}

export interface AuthResult {
  profile: UserProfile;
  accessToken: string;
}
