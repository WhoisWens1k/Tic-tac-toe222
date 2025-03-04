# How to Use Your Canva Images in the Game

I've created a special utility to help you easily use your Canva images in the game. Follow these steps:

## Step 1: Access the Image Uploader Tool

1. Start your development server with `npm start` if it's not already running
2. Go to this URL in your browser: [http://localhost:3000/?imageUploader=true](http://localhost:3000/?imageUploader=true)

## Step 2: Upload Your Canva Images

1. In the Image Uploader tool, you'll see three sections for Avatar 1, Avatar 2, and Avatar 3
2. For each avatar:
   - Click the "Choose File" button
   - Select your Canva image from your computer
   - You'll see a preview of how it looks in the circular frame

## Step 3: Generate and Copy the Code

1. After uploading all three images, scroll down to see the generated code
2. Click the "Copy Full Code" button
3. The code is now copied to your clipboard

## Step 4: Update Your Game

1. Open the file `src/utils/avatarImages.ts` in your code editor
2. Delete all the existing content
3. Paste the copied code (Ctrl+V or Cmd+V)
4. Save the file

## Step 5: View Your Game with the New Avatars

1. Go back to [http://localhost:3000](http://localhost:3000) (without the query parameter)
2. You should now see your Canva images as the avatars in the game!

## Tips for Best Results

- Use square images from Canva for best results in the circular frames
- If your images are too large, they might cause performance issues - try to keep them under 100KB each
- PNG format with transparent backgrounds works best
- If you want to change the images later, just repeat these steps

Enjoy your game with your custom avatars! 