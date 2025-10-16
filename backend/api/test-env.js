import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 Environment Variables Check:');
console.log('================================');

// Check required environment variables
const requiredVars = {
  'MONGODB_URI': process.env.MONGODB_URI,
  'JWT_SECRET': process.env.JWT_SECRET,
  'NODE_ENV': process.env.NODE_ENV,
  'FRONTEND_URL': process.env.FRONTEND_URL
};

let hasAllRequired = true;

for (const [key, value] of Object.entries(requiredVars)) {
  if (value) {
    console.log(`✅ ${key}: ${key === 'MONGODB_URI' || key === 'JWT_SECRET' ? '[CONFIGURED]' : value}`);
  } else {
    console.log(`❌ ${key}: MISSING`);
    hasAllRequired = false;
  }
}

console.log('================================');

if (hasAllRequired) {
  console.log('✅ All required environment variables are configured!');
} else {
  console.log('❌ Some environment variables are missing!');
  console.log('Please check your .env file or Vercel environment settings.');
}

console.log('\n📝 To set environment variables in Vercel:');
console.log('1. Go to https://vercel.com/dashboard');
console.log('2. Select your project');
console.log('3. Go to Settings > Environment Variables');
console.log('4. Add each missing variable');
console.log('5. Redeploy your project');

export default function testEnv() {
  return {
    hasAllRequired,
    variables: requiredVars
  };
}
