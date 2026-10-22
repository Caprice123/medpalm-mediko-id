import { untrustedHttp } from '#utils/untrustedHttp';

/**
 * Converts an image URL to base64 data URI
 * @param {string} imageUrl - The image URL to convert
 * @returns {Promise<string>} Base64 data URI
 */
export async function imageUrlToBase64(imageUrl) {
  try {
    console.log('Fetching image from URL:', imageUrl);
    // Caller-supplied URL (extracted from user HTML) -> untrustedHttp
    const response = await untrustedHttp.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000, // 10 second timeout
    });

    const contentType = response.headers['content-type'] || 'image/png';
    const base64 = Buffer.from(response.data, 'binary').toString('base64');

    console.log(`Image converted successfully. Type: ${contentType}, Size: ${base64.length} chars`);

    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.error('Error converting image to base64:', imageUrl, error.message);
    throw error;
  }
}

/**
 * Replaces all image URLs in HTML with base64 data URIs
 * @param {string} htmlContent - HTML content with image URLs
 * @returns {Promise<string>} HTML content with base64 images
 */
export async function convertImagesToBase64(htmlContent) {
  // Find all image tags with src attributes
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  let match;
  const imageUrls = [];

  // Extract all image URLs
  while ((match = imgRegex.exec(htmlContent)) !== null) {
    const url = match[1];
    // Only process HTTP/HTTPS URLs, skip data URIs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      imageUrls.push(url);
    }
  }

  console.log(`Found ${imageUrls.length} images to convert to base64`);

  // Convert all images to base64
  let updatedHtml = htmlContent;
  let successCount = 0;
  let failCount = 0;

  for (const url of imageUrls) {
    try {
      const base64 = await imageUrlToBase64(url);
      // Replace the URL with base64 data URI (escape special regex characters)
      const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      updatedHtml = updatedHtml.replace(new RegExp(escapedUrl, 'g'), base64);
      successCount++;
    } catch (error) {
      console.warn(`Failed to convert image ${url}:`, error.message);
      failCount++;
      // Continue with other images
    }
  }

  console.log(`Image conversion complete: ${successCount} successful, ${failCount} failed`);

  return updatedHtml;
}

export default {
  imageUrlToBase64,
  convertImagesToBase64,
};
