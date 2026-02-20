// Environment validation for production deployment
const requiredEnvVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
];

export function validateEnvironment() {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ All required environment variables are set');
  return true;
}

// Auto-validate in non-production environments
if (process.env.NODE_ENV !== 'production') {
  try {
    validateEnvironment();
  } catch (error) {
    console.warn('Environment validation failed:', error.message);
  }
}
