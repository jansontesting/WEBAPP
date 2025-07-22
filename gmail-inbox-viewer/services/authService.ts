/* global google */
import type { UserProfile, AuthResult } from '../types';
import { GOOGLE_CLIENT_ID, GMAIL_API_SCOPES } from '../config';

// Augment the Window interface to declare the 'google' property
declare global {
  interface Window {
    google: any;
  }
}

class AuthService {
  private tokenClient: any = null;
  private onSignInCallback: ((result: AuthResult) => void) | null = null;
  private onSignInFailCallback: ((error: Error) => void) | null = null;

  public initClient(): Promise<void> {
    return new Promise((resolve, reject) => {
      const checkGsi = () => {
        if (window.google && window.google.accounts) {
          try {
            this.tokenClient = window.google.accounts.oauth2.initTokenClient({
              client_id: GOOGLE_CLIENT_ID,
              scope: GMAIL_API_SCOPES,
              callback: this.handleTokenResponse.bind(this),
              error_callback: this.handleTokenError.bind(this),
            });
            console.log("Auth Service: Google Identity Services client initialized.");
            resolve();
          } catch (err) {
            console.error("Auth Service: Error initializing token client.", err);
            reject(new Error("Failed to initialize Google authentication. Please check your Client ID and ensure you've configured your OAuth consent screen correctly in Google Cloud Console."));
          }
        } else {
          setTimeout(checkGsi, 100);
        }
      };
      checkGsi();
    });
  }
  
  private async handleTokenResponse(tokenResponse: any) {
    if (tokenResponse.error || !tokenResponse.access_token) {
        this.handleTokenError(new Error(tokenResponse.error || 'Unknown token response error. The user may have closed the popup.'));
        return;
    }
    const accessToken = tokenResponse.access_token;
    console.log("Auth Service: Access Token received.");
    try {
      const profile = await this.fetchUserProfile(accessToken);
      if (this.onSignInCallback) {
        this.onSignInCallback({ profile, accessToken });
      }
    } catch(error) {
       console.error("Auth Service: Failed to fetch user profile.", error);
       this.handleTokenError(error as Error);
    } finally {
        this.onSignInCallback = null;
        this.onSignInFailCallback = null;
    }
  }

  private handleTokenError(error: Error) {
      console.error("Auth Service: Sign-in flow error:", error);
      if (this.onSignInFailCallback) {
          this.onSignInFailCallback(error);
      }
      this.onSignInCallback = null;
      this.onSignInFailCallback = null;
  }
  
  public signIn(): Promise<AuthResult> {
    return new Promise((resolve, reject) => {
      if (!this.tokenClient) {
        return reject(new Error("Authentication client not initialized."));
      }
      
      this.onSignInCallback = resolve;
      this.onSignInFailCallback = reject;
      
      this.tokenClient.requestAccessToken({ prompt: '' });
    });
  }

  private async fetchUserProfile(accessToken: string): Promise<UserProfile> {
    console.log("Auth Service: Fetching user profile...");
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    console.log("Auth Service: User profile fetched.", data);
    return {
      name: data.name,
      email: data.email,
      picture: data.picture,
    };
  }

  public signOut(accessToken: string): void {
    if (accessToken) {
      window.google.accounts.oauth2.revoke(accessToken, () => {
        console.log('Auth Service: Access token revoked.');
      });
    }
  }
}

export const authService = new AuthService();
