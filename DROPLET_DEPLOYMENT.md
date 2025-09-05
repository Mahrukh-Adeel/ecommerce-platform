# Alternative: Deploy on DigitalOcean Droplet (VPS)

## Step 1: Create a Droplet
1. Go to DigitalOcean Control Panel
2. Click "Create" → "Droplet"
3. Choose Ubuntu 22.04 LTS
4. Choose Basic plan ($6/month minimum)
5. Add your SSH key
6. Create droplet

## Step 2: Connect and Setup
```bash
# Connect to your droplet
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Install Git
apt install git -y
```

## Step 3: Deploy Your App
```bash
# Clone your repository
git clone https://github.com/Mahrukh-Adeel/ecommerce-platform.git
cd ecommerce-platform/backend

# Install dependencies
npm install

# Build the app
npm run build

# Create environment file
nano .env
# Paste your environment variables

# Start with PM2
pm2 start dist/server.js --name "ecommerce-backend"
pm2 startup
pm2 save
```

## Step 4: Setup Nginx (Optional)
```bash
# Install Nginx
apt install nginx -y

# Create Nginx config
nano /etc/nginx/sites-available/ecommerce-backend

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable the site
ln -s /etc/nginx/sites-available/ecommerce-backend /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## Step 5: Setup SSL with Let's Encrypt
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d your-domain.com
```
