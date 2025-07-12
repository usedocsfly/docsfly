// Test the built package
try {
  const docsfly = require('./dist/index.js');
  console.log('Available exports:', Object.keys(docsfly));
  console.log('MainLayout:', typeof docsfly.MainLayout);
} catch (error) {
  console.error('Error loading package:', error.message);
}