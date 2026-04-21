# 🏰 Forts Tracker - Complete Feature Guide

## Getting Started

### 1. Registration & Login

**Register (First Time)**
- Tap "Don't have an account? Register" button
- Enter a username (unique identifier)
- Enter a password (recommended 6+ characters)
- Tap "Register" button
- You'll be logged in automatically after successful registration

**Login (Existing Users)**
- Enter your username
- Enter your password
- Tap "Login" button
- Session will be saved for next visit

### 2. Dashboard Overview

After logging in, you'll see:

- **Header**: Your username and logout button
- **Statistics Bar**: 
  - Total forts count
  - Visited forts count
  - Remaining forts count
- **Filter Bar**: Toggle between All/Visited/To Visit
- **Floating Action Button (+)**: Add new fort

### 3. Adding a Fort

#### Required Fields:
1. **Fort Name** - Name of the fort (e.g., "Raigad Fort")
2. **Location** - Location/area (e.g., "Raigad, Maharashtra, India")

#### Optional Fields:
3. **Height** - Elevation in meters (e.g., 2700)
4. **Description** - Detailed info about the fort
5. **Notes** - Personal notes or observations
6. **Photo Links** - URLs of fort photos (one per line)
   - Can be from Google Images, Flickr, Instagram (direct image URLs)
   - Example format:
   ```
   https://example.com/photo1.jpg
   https://example.com/photo2.jpg
   ```

#### Steps:
1. Tap the **+** (floating action button)
2. Fill in the form fields
3. Tap **"+ Add Fort"** button
4. Fort will appear in your list immediately

### 4. Managing Your Forts List

#### View Forts:
- All added forts appear as cards in the list
- Each card shows:
  - Fort name
  - Location with 📍 icon
  - Height with ⛰️ icon (if added)
  - First photo thumbnail (if photos added)
  - Checkbox for visited status

#### Filter Forts:
- **All**: Shows all forts
- **Visited ✅**: Shows only visited forts
- **To Visit 🚩**: Shows only unvisited forts

#### Mark as Visited:
- Tap the checkbox on any fort card
- Card will become slightly faded
- Statistics update automatically
- Tap again to mark as not visited

#### Delete Fort:
- Tap the 🗑️ (trash) button on any fort card
- Confirm deletion in the popup
- Fort is removed from your list

### 5. Fort Details Page

Tap **"View Details"** on any fort card to see:

**View Mode:**
- Complete fort information
- Full descriptions and notes
- Photo gallery with all images
- Visited status with date (if visited)
- Edit and delete options

**Edit Mode:**
- Click ✏️ button to enter edit mode
- Update any field:
  - Fort name
  - Location
  - Height
  - Description
  - Notes
  - Photo links
- Click **"Save Changes"** to save updates
- Click **"Cancel"** to discard changes

### 6. Photo Gallery Features

**Adding Photos:**
- In add or edit fort form, paste photo URLs in the "Photo Links" field
- One URL per line
- Accepted formats: jpg, jpeg, png, gif, webp
- Must be direct links to image files

**Viewing Photos:**
- Open fort details page
- Photos appear in a grid layout
- Tap any photo to view larger
- Photos load automatically from their source URLs

**Tips for Photo Links:**
- Use high-quality images
- Ensure URLs remain accessible (not temp links)
- You can use:
  - Imgur (direct image links)
  - Flickr (direct image links)
  - Google Drive (share publicly, get direct link)
  - Cloudinary, imgbb, or similar image hosting

### 7. User Statistics

The statistics bar shows:
- **Total**: All forts in your collection
- **Visited**: Forts you've marked as visited
- **Remaining**: Forts you plan to visit

## Tips & Tricks

### Organization Tips:

1. **Naming Convention**: Use consistent naming
   - Example: "[State] - Fort Name"
   - "Maharashtra - Raigad Fort"

2. **Location Format**: Include district/state/country
   - Example: "Raigad District, Maharashtra, India"

3. **Height Data**: Always add if available
   - Helps you identify challenging treks
   - Useful for planning trips

4. **Photo Quality**: Add at least one photo
   - Makes the list more visual
   - Helps identify forts at a glance

5. **Notes Usage**: Document your visits
   - Best time to visit
   - Difficulty level
   - Duration required
   - Nearby facilities

### Search Tips:

Use filters to:
- View only forts you haven't visited yet
- Check progress on visited forts
- Plan your next trip

### Backup Tips:

- Database is secure and backed up
- Your data is encrypted
- No automatic deletion (manual deletion only)
- Login same username/password to access

## Security & Privacy

✅ **Your Data is Protected:**
- Password is encrypted with bcryptjs
- JWT tokens secure your session
- Only you can see and modify your forts
- No data shared with others

🔒 **Best Practices:**
- Use a strong, unique password
- Don't share your login credentials
- Logout on shared devices
- Change password if compromised

## Troubleshooting

### Can't Login?
- Check username spelling (case-sensitive)
- Verify password is correct
- Clear browser cache and try again
- Check internet connection

### Photos Not Loading?
- Verify URL is correct and accessible
- Check image hosting site is not blocked
- Try a different image hosting service
- Reload the page

### Can't Add Fort?
- Ensure fort name and location are filled
- Check internet connection
- Try again or refresh page
- Check browser console for errors (F12)

### Lost my Password?
- Unfortunately, no automatic recovery
- Contact support for assistance
- Create new account if needed

## Data Backup

### Export Your Data:

**Manual Method:**
1. Note down all fort details
2. Take screenshots of your list
3. Export photos if needed

**Browser Storage:**
- Login token stored in localStorage
- Data stored in MongoDB (secure)

### Import Data:

If switching devices:
1. Login with same username/password
2. All your forts will appear
3. No manual import needed

## Performance

The app is optimized for:
- ✅ Mobile devices (primary)
- ✅ Tablets
- ✅ Desktop/Laptop
- ✅ Slow internet connections
- ✅ Low-bandwidth scenarios

**Features:**
- Lazy loading of images
- Minimal data usage
- Smooth animations
- Fast load times

## Keyboard Shortcuts (on Desktop)

- `Tab` - Navigate between fields
- `Enter` - Submit forms
- `Escape` - Close modals/cancel edit

## Contact & Support

For issues:
1. Check FAQ section
2. Review DEPLOYMENT.md
3. Check browser console (F12 → Console)
4. Verify backend is running
5. Check network tab for API errors

---

**Enjoy tracking your forts! Happy trekking! 🏰⛰️**
