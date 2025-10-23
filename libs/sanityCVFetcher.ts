/**
 * Reusable Sanity.io CV Fetcher (TypeScript Version)
 * 
 * This module fetches the homepage resume slug from Sanity.io and generates
 * the PDF download URL for george.barbu.es
 * 
 * Usage:
 * import { getHomepageSlug, getHomepagePDFUrl, getHomepagePDFBlobUrl, downloadHomepagePDF } from './sanityCVFetcher';
 * 
 * // Get just the slug
 * const slug = await getHomepageSlug();
 * 
 * // Get the PDF URL
 * const pdfUrl = await getHomepagePDFUrl();
 * 
 * // Get the direct blob URL
 * const blobUrl = await getHomepagePDFBlobUrl();
 * 
 * // Download the PDF
 * await downloadHomepagePDF('george-barbu-cv.pdf');
 */

// Configuration
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const API_BASE_URL = process.env.NEXT_PUBLIC_CV_API_URL || 'https://george.barbu.es';

interface SanityGraphQLResponse {
  data?: {
    allResume?: Array<{
      slug: {
        current: string;
      };
    }>;
  };
  errors?: Array<{ message: string }>;
}

interface PDFApiResponse {
  url: string;
}

/**
 * Fetches the homepage resume slug from Sanity.io
 * @returns {Promise<string>} The slug for the homepage (usually "/")
 */
export async function getHomepageSlug(): Promise<string> {
  const SANITY_GRAPHQL_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v1/graphql/${SANITY_DATASET}/default`;
  
  const query = `
    query GetHomepageResume {
      allResume(where: { homepage: { eq: true } }) {
        slug {
          current
        }
      }
    }
  `;

  try {
    const response = await fetch(SANITY_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Sanity GraphQL Error: ${response.status} ${response.statusText}`);
    }

    const data: SanityGraphQLResponse = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL Errors: ${JSON.stringify(data.errors)}`);
    }

    const slug = data.data?.allResume?.[0]?.slug?.current;
    
    if (!slug) {
      console.warn('No homepage resume found, defaulting to "/"');
      return '/';
    }

    return slug;
  } catch (error) {
    console.error('Error fetching homepage slug from Sanity:', error);
    throw error;
  }
}

/**
 * Gets the API endpoint URL for the homepage CV
 * @returns {Promise<string>} The API URL (e.g., "https://george.barbu.es/api/pdf//?role=/")
 */
export async function getHomepagePDFUrl(): Promise<string> {
  const slug = await getHomepageSlug();
  return `${API_BASE_URL}/api/pdf/${slug}?role=${slug}`;
}

/**
 * Fetches the actual PDF blob URL from the API
 * @returns {Promise<string>} The Vercel Blob Storage URL for the PDF
 */
export async function getHomepagePDFBlobUrl(): Promise<string> {
  const apiUrl = await getHomepagePDFUrl();
  
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: PDFApiResponse = await response.json();
    
    if (!data.url) {
      throw new Error('No PDF URL found in API response');
    }

    return data.url;
  } catch (error) {
    console.error('Error fetching PDF blob URL:', error);
    throw error;
  }
}

/**
 * Downloads the homepage CV PDF (Browser only)
 * @param {string} filename - Optional filename for download
 */
export async function downloadHomepagePDF(filename: string = 'george-barbu-cv.pdf'): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('downloadHomepagePDF only works in browser environment');
  }

  try {
    const blobUrl = await getHomepagePDFBlobUrl();
    
    // Fetch the actual PDF
    const pdfResponse = await fetch(blobUrl);
    if (!pdfResponse.ok) {
      throw new Error('Failed to fetch PDF file');
    }

    const blob = await pdfResponse.blob();
    const url = window.URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('PDF downloaded successfully');
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
}

