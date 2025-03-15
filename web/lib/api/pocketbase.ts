import PocketBase from 'pocketbase';

// Get the server URL from environment variables with fallback for development
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://pb.kill-saas.com';

// Initialize PocketBase with the environment-specific URL
const pb = new PocketBase(SERVER_URL);

// Disable auto cancellation by default to prevent the errors
pb.autoCancellation(false);

export default pb;

export { SERVER_URL };
