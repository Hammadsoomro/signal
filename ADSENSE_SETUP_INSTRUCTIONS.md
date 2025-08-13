# Google AdSense Setup Instructions

## Current Issue
The TagError occurs because the ad slot IDs in the code don't exist in your AdSense account yet.

## Publisher Information
- **Publisher ID:** `ca-pub-8199077937393778`
- **Customer ID:** `6543893532`

## How to Fix the TagError

### Step 1: Create Ad Units in AdSense Console
1. Go to [Google AdSense Console](https://www.google.com/adsense/)
2. Navigate to **Ads** > **Ad units**
3. Click **Create ad unit**
4. Create the following ad units:

#### Header Banner Ad
- **Name:** `Connectlify Header Banner`
- **Type:** `Display ads`
- **Size:** `Responsive` or `728x90 - Leaderboard`
- **Copy the Ad Slot ID** (will look like: `1234567890`)

#### Sidebar Rectangle Ad  
- **Name:** `Connectlify Sidebar Rectangle`
- **Type:** `Display ads`
- **Size:** `Responsive` or `300x250 - Medium Rectangle`
- **Copy the Ad Slot ID**

#### Content Auto Ad
- **Name:** `Connectlify Content Auto`
- **Type:** `Display ads`
- **Size:** `Responsive`
- **Copy the Ad Slot ID**

#### Footer Leaderboard Ad
- **Name:** `Connectlify Footer Leaderboard`
- **Type:** `Display ads`
- **Size:** `Responsive` or `728x90 - Leaderboard`
- **Copy the Ad Slot ID**

### Step 2: Update AdSense Configuration
Replace the `undefined` values in `client/components/AdSense.tsx`:

```typescript
export const AdSenseConfigs = {
  sidebar: {
    adSlot: "YOUR_SIDEBAR_AD_SLOT_ID", // Replace with actual slot ID
    adFormat: "rectangle" as const,
    style: { width: "250px", height: "250px" },
  },
  header: {
    adSlot: "YOUR_HEADER_AD_SLOT_ID", // Replace with actual slot ID
    adFormat: "banner" as const,
    style: { width: "728px", height: "90px" },
  },
  footer: {
    adSlot: "YOUR_FOOTER_AD_SLOT_ID", // Replace with actual slot ID
    adFormat: "leaderboard" as const,
    style: { width: "728px", height: "90px" },
  },
  content: {
    adSlot: "YOUR_CONTENT_AD_SLOT_ID", // Replace with actual slot ID
    adFormat: "auto" as const,
    style: { minHeight: "280px" },
  },
};
```

### Step 3: Verify ads.txt File
Ensure `/public/ads.txt` contains:
```
google.com, pub-8199077937393778, DIRECT, f08c47fec0942fa0
```

### Step 4: Deploy and Test
1. Deploy the updated code
2. Visit your website
3. Check browser console for any remaining errors
4. Ads may take 24-48 hours to start showing

## Alternative: Use Auto Ads Only
If you prefer to use only Auto Ads (no manual placements):

1. **Remove all manual ad components** from the code
2. **Add back the auto ads script** in `index.html`:
```html
<script>
  (adsbygoogle = window.adsbygoogle || []).push({
    google_ad_client: "ca-pub-8199077937393778",
    enable_page_level_ads: true
  });
</script>
```
3. **Enable Auto Ads** in your AdSense console under **Ads** > **Auto ads**

## Current Status
- ✅ AdSense script properly loaded
- ✅ Publisher ID configured
- ✅ ads.txt file created
- ✅ Error handling implemented
- ⚠️ **Action Required:** Create ad units and update slot IDs

## Test Mode
Currently, the ads show as placeholders in development mode and will only attempt to load real ads in production with valid slot IDs.
