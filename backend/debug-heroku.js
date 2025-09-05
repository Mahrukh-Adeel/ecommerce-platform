const fs = require('fs');
const path = require('path');

console.log('=== Heroku Debug Information ===');
console.log('Current working directory:', process.cwd());
console.log('Node version:', process.version);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

// Check if dist directory exists
const distPath = path.join(__dirname, 'dist');
console.log('Dist directory exists:', fs.existsSync(distPath));

if (fs.existsSync(distPath)) {
  console.log('Dist contents:', fs.readdirSync(distPath));
  
  const serverPath = path.join(distPath, 'server.js');
  console.log('Server.js exists:', fs.existsSync(serverPath));
  
  if (fs.existsSync(serverPath)) {
    console.log('Server.js file size:', fs.statSync(serverPath).size, 'bytes');
  }
} else {
  console.log('ERROR: Dist directory not found!');
}

console.log('=== Environment Variables ===');
const envVars = ['MONGO_URI', 'JWT_SECRET', 'SESSION_SECRET', 'FRONTEND_URL'];
envVars.forEach(envVar => {
  console.log(`${envVar}:`, process.env[envVar] ? 'SET' : 'NOT SET');
});
