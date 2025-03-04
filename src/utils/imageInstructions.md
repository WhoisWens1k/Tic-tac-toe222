# How to Use Your Canva Images in the Game

## Option 1: Convert Images to Base64 (Recommended)

1. **Download your images from Canva**:
   - Make sure to download them as PNG or JPG format
   - Keep the file size small (ideally under 100KB each)

2. **Convert the images to Base64**:
   - Go to a Base64 converter website like [Base64-image.de](https://www.base64-image.de/) or [Base64Encoder](https://www.base64encoder.io/image-to-base64-converter/)
   - Upload your image
   - Copy the generated Base64 string (it will start with `data:image/png;base64,` or `data:image/jpeg;base64,`)

3. **Update the avatarImages.ts file**:
   - Replace the existing SVG Base64 strings with your new image Base64 strings
   - For example:
   ```typescript
   // Avatar images as Base64 strings
   export const avatarImages = {
     // Replace this with your first Canva image Base64 string
     avatar1: `data:image/png;base64,YOUR_BASE64_STRING_HERE`,
     
     // Replace this with your second Canva image Base64 string
     avatar2: `data:image/png;base64,YOUR_BASE64_STRING_HERE`,
     
     // Replace this with your third Canva image Base64 string
     avatar3: `data:image/png;base64,YOUR_BASE64_STRING_HERE`
   };
   ```

## Option 2: Save Images to Public Folder

If you prefer not to use Base64:

1. **Download your images from Canva**:
   - Download as PNG format
   - Name them exactly: `avatar1.png`, `avatar2.png`, and `avatar3.png`

2. **Save to the correct location**:
   - Save them in the `public/avatars/` folder in your project
   - Create this folder if it doesn't exist

3. **Update the code**:
   - You would need to modify the code to use file paths instead of Base64

## Tips for Downloading from Canva

- When downloading from Canva, choose "PNG format" with "transparent background" if available
- If your images are too large, they might cause performance issues when converted to Base64
- Make sure the images are square for best results in the circular frames 