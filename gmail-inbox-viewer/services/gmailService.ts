import type { Email } from '../types';

class GmailService {
  private GMAIL_API_BASE_URL = 'https://www.googleapis.com/gmail/v1/users/me';

  public async listEmails(accessToken: string): Promise<Email[]> {
    console.log('Gmail Service: Fetching emails...');
    if (!accessToken) {
        throw new Error("Gmail Service: Access token is required.");
    }

    const headers = new Headers({
        'Authorization': `Bearer ${accessToken}`
    });

    // 1. Fetch list of message IDs
    const listResponse = await fetch(`${this.GMAIL_API_BASE_URL}/messages?maxResults=15`, { headers });
    if (!listResponse.ok) {
        const errorData = await listResponse.json().catch(() => ({ error: { message: 'Unknown API error' } }));
        console.error('Gmail API error (list messages):', errorData);
        throw new Error(`Failed to list emails: ${errorData.error.message}`);
    }
    const listResult = await listResponse.json();
    const messageMetas = listResult.messages || [];

    if (messageMetas.length === 0) {
        return [];
    }

    // 2. Fetch full details for each message
    const detailPromises = messageMetas.map((meta: { id: string }) => 
        fetch(`${this.GMAIL_API_BASE_URL}/messages/${meta.id}?format=full`, { headers })
            .then(res => res.ok ? res.json() : Promise.reject(new Error(`Failed to fetch email ${meta.id}`)))
    );

    const messageDetails = await Promise.all(detailPromises);
    
    // 3. Parse details into Email objects
    const emails = messageDetails.map(this.parseEmail);
    console.log(`Gmail Service: ${emails.length} emails fetched and parsed.`);
    return emails;
  }

  private parseEmail(message: any): Email {
    const headers = message.payload.headers;
    const fromHeader = headers.find((h: any) => h.name === 'From')?.value || 'Unknown Sender';
    const fromParts = fromHeader.match(/(.*) <(.*)>/);
    const from = fromParts ? fromParts[1].replace(/"/g, '') : fromHeader;
    const fromEmail = fromParts ? fromParts[2] : fromHeader;

    const getHeader = (name: string) => headers.find((h: any) => h.name === name)?.value || '';

    const bodyData = this.findHtmlPart(message.payload)?.body.data;
    let body = '<p>No viewable content.</p>';
    if (bodyData) {
        const base64 = bodyData.replace(/-/g, '+').replace(/_/g, '/');
        try {
            body = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        } catch(e) {
            console.warn("Could not decode email body for message:", message.id, e);
            body = "<p>Content could not be decoded.</p>"
        }
    }

    return {
        id: message.id,
        snippet: message.snippet,
        subject: getHeader('Subject'),
        from,
        fromEmail,
        date: new Date(getHeader('Date')).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        body,
    };
  }

  private findHtmlPart(payload: any): any {
    if (!payload) return null;
    if (payload.mimeType === 'text/html' && payload.body?.data) {
        return payload;
    }
    
    // Look in multipart/alternative for text/html part
    if (payload.mimeType === 'multipart/alternative' && payload.parts) {
        const htmlPart = payload.parts.find((p: any) => p.mimeType === 'text/html');
        if (htmlPart) return htmlPart;
    }
    
    // Recursively search in other parts
    if (payload.parts) {
        for (const part of payload.parts) {
            const found = this.findHtmlPart(part);
            if (found) return found;
        }
    }
    
    return null;
  }
}

export const gmailService = new GmailService();
