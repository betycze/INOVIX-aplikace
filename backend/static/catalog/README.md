# INOVIX Catalog Images

## How to Add New Catalog Pages

To add new catalog pages to the INOVIX Customer Portal:

1. **Name your images with numbered prefix** (e.g., `06_new_page.png`, `07_another_page.png`)
   - The numbering ensures correct display order
   - Use format: `##_description.png`

2. **Place images in this directory**: `/app/backend/static/catalog/`

3. **The images will automatically appear** in the catalog viewer in numerical order

## Current Catalog Pages:
1. `01_titulni_strana.png` - Title Page
2. `02_uvod.png` - Introduction
3. `03_sluchatka.png` - Headphones
4. `04_reproduktory.png` - Speakers
5. `05_pocitace.png` - Computers & Laptops

## Future Images (to be added):
- `06_*.png` - Next page
- `07_*.png` - Next page
- `08_*.png` - Next page

## Technical Details:
- Supported formats: PNG, JPG, JPEG
- Recommended resolution: 1920x1080 or higher
- Files are served via `/api/static/catalog/` endpoint
- No server restart needed after adding images
- Images load dynamically on app start

## Testing:
After adding new images, test by:
1. Opening the catalog in the app
2. Swiping through pages
3. Verifying the page counter shows correct total
