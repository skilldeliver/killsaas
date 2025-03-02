import PocketBase from 'pocketbase';

// Initialize PocketBase
const pb = new PocketBase('http://127.0.0.1:8090');

// Disable auto cancellation by default to prevent the errors
pb.autoCancellation(false);

export default pb;
