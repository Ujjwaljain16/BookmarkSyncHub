// Mock function to simulate receiving data from the extension
export const mockReceiveFromExtension = async () => {
  // Simulate a delay like a real API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return {
    bookmarks: [
      {
        id: '1',
        url: 'https://example.com',
        title: 'Example Bookmark',
        description: 'A sample bookmark from the extension',
        category: 'other',
        tags: ['sample', 'test'],
        createdAt: new Date().toISOString()
      }
    ]
  };
};

// Real function to receive data from the extension (to be implemented)
export const receiveFromExtension = async (data) => {
  try {
    // Here you would implement the actual API endpoint
    // For now, we'll just log the data
    console.log('Received data from extension:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error receiving data from extension:', error);
    throw error;
  }
}; 