// Test script để kiểm tra seeding symbols
const { exec } = require('child_process');

console.log('Testing symbols seeding...');

exec('npm run seed:symbols', (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  if (stderr) {
    console.error('Stderr:', stderr);
  }
  console.log('Output:', stdout);
});
