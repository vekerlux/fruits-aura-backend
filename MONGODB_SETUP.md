# MongoDB Atlas Setup Guide

Follow these steps to set up your free MongoDB Atlas cluster:

## Step 1: Create Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with your email or Google account
3. Verify your email address

## Step 2: Create a Cluster

1. After logging in, click **"Build a Database"**
2. Choose **"M0 Free"** tier (completely free, no credit card required)
3. Select a cloud provider and region (choose closest to you):
   - Provider: AWS, Google Cloud, or Azure
   - Region: Choose nearest location
4. Cluster Name: Can leave as default or name it "fruits-aura"
5. Click **"Create"**

⏱️ Wait 1-3 minutes for cluster creation...

## Step 3: Set Up Database Access

1. Click **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Create credentials:
   - Username: `fruits_aura_user` (or any name)
   - Password: Click "Autogenerate Secure Password" and **COPY IT**
   - Or create your own strong password and **SAVE IT**
5. Database User Privileges: Select **"Atlas admin"**
6. Click **"Add User"**

## Step 4: Set Up Network Access

1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0` which allows connections from any IP
   - For production, you'd want to restrict this
4. Click **"Confirm"**

## Step 5: Get Connection String

1. Click **"Database"** in the left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string, it looks like:
   ```
   mongodb+srv://fruits_aura_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **IMPORTANT**: Replace `<password>` with your actual password from Step 3

## Step 6: Update Backend Configuration

1. Open `.env` file in `fruits-aura-backend` folder
2. Update the `MONGODB_URI` line with your connection string:
   ```env
   MONGODB_URI=mongodb+srv://fruits_aura_user:YourActualPassword@cluster0.xxxxx.mongodb.net/fruits-aura?retryWrites=true&w=majority
   ```
   Note: I added `/fruits-aura` before the `?` to specify the database name

3. Save the file

## Step 7: Test Connection

Run these commands in the backend directory:

```bash
# Seed the database
npm run seed
```

If successful, you'll see:
```
✅ Connected to MongoDB
✅ Admin user created
✅ 8 products created
✨ Database seeding completed successfully!
```

## Step 8: Start Backend Server

```bash
# Start development server
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

## Troubleshooting

### Connection Error: "MongoServerError: bad auth"
- Double-check your password is correct in the connection string
- Make sure you replaced `<password>` with actual password (no brackets)

### Connection Error: "connection timed out"
- Check Network Access settings in Atlas
- Make sure `0.0.0.0/0` is added

### "Database user not found"
- Go back to Database Access and verify user was created
- Username and password match what's in your connection string

## Next Steps

Once MongoDB is connected and seeded:
1. Test API endpoints with Postman or curl
2. Integrate frontend with backend
3. Add authentication to frontend
4. Build admin panel UI

---

**Need help?** Let me know at which step you're stuck!
