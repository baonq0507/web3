const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testResetPassword() {
  try {
    console.log('Testing Reset Password API...');
    
    // Test with a valid user ID (you'll need to replace this with a real user ID from your database)
    const userId = '507f1f77bcf86cd799439011'; // Example ObjectId
    
    const response = await axios.post(`${BASE_URL}/users/${userId}/reset-password`, {
      newPassword: 'ignored', // This will be ignored by backend
      reason: 'Test reset password by admin'
    });
    
    console.log('✅ Reset Password Success:');
    console.log('New Password:', response.data.newPassword);
    console.log('User Updated:', response.data.user);
    
  } catch (error) {
    console.error('❌ Reset Password Failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run the test
testResetPassword();
