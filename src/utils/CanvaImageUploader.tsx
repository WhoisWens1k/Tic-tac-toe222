import React, { useState } from 'react';

/**
 * A utility component to help convert local images to Base64 strings
 * for use in the avatar system.
 */
const CanvaImageUploader: React.FC = () => {
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean[]>([false, false, false]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setBase64Images(prev => {
        const newImages = [...prev];
        newImages[index] = result;
        return newImages;
      });
      setCopied(prev => {
        const newCopied = [...prev];
        newCopied[index] = false;
        return newCopied;
      });
    };
    reader.readAsDataURL(file);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      const newCopied = [false, false, false];
      newCopied[index] = true;
      setCopied(newCopied);
      setTimeout(() => {
        setCopied(prev => {
          const newCopied = [...prev];
          newCopied[index] = false;
          return newCopied;
        });
      }, 2000);
    });
  };

  const generateCode = () => {
    return `// Avatar images as Base64 strings
export const avatarImages = {
  avatar1: \`${base64Images[0] || 'YOUR_BASE64_STRING_HERE'}\`,
  
  avatar2: \`${base64Images[1] || 'YOUR_BASE64_STRING_HERE'}\`,
  
  avatar3: \`${base64Images[2] || 'YOUR_BASE64_STRING_HERE'}\`
};`;
  };

  const copyFullCode = () => {
    navigator.clipboard.writeText(generateCode()).then(() => {
      alert('Full code copied to clipboard! Paste this into src/utils/avatarImages.ts');
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#00BFFF' }}>Canva Image Converter</h1>
      <p style={{ textAlign: 'center' }}>
        Upload your Canva images here to convert them to Base64 format for use in the game.
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
        {[0, 1, 2].map((index) => (
          <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px' }}>
            <h3>Avatar {index + 1}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                overflow: 'hidden',
                backgroundColor: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {base64Images[index] ? (
                  <img 
                    src={base64Images[index]} 
                    alt={`Avatar ${index + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span style={{ color: '#999' }}>No image</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, index)}
                  style={{ marginBottom: '10px' }}
                />
                {base64Images[index] && (
                  <button 
                    onClick={() => copyToClipboard(base64Images[index], index)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: copied[index] ? '#4CAF50' : '#00BFFF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {copied[index] ? 'Copied!' : 'Copy Base64'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {base64Images.some(img => img) && (
        <div style={{ marginTop: '30px' }}>
          <h3>Generated Code</h3>
          <div style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '8px',
            overflowX: 'auto',
            fontFamily: 'monospace',
            fontSize: '14px',
            whiteSpace: 'pre-wrap',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {generateCode()}
          </div>
          <button 
            onClick={copyFullCode}
            style={{
              marginTop: '15px',
              padding: '10px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Copy Full Code
          </button>
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h3>Instructions</h3>
        <ol style={{ lineHeight: '1.6' }}>
          <li>Upload your three Canva images using the file inputs above</li>
          <li>Preview how they look in the circular frames</li>
          <li>Click "Copy Full Code" when you're satisfied with all three images</li>
          <li>Open the file <code>src/utils/avatarImages.ts</code> in your code editor</li>
          <li>Replace the entire contents with the copied code</li>
          <li>Save the file and your game will use these images</li>
        </ol>
      </div>
    </div>
  );
};

export default CanvaImageUploader; 