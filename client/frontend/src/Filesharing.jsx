import React, { useState } from 'react';
import { Upload, Share, X, Copy, QrCode } from 'lucide-react';

function App() {
  const [filePath, setFilePath] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
  const [message, setMessage] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const startSharing = async () => {
    if (!filePath.trim()) {
      setMessage('Please enter a file path');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath })
      });
      const data = await response.json();
      if (response.ok) {
        setPublicUrl(data.publicUrl);
        setQrCodeData(data.qrCodeData);
        setMessage(data.message);
        setIsSharing(true);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error starting sharing');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopSharing = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setIsSharing(false);
        setPublicUrl('');
        setQrCodeData('');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error stopping sharing');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyUrlToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setMessage('URL copied to clipboard!');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #e6eeff 100%)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
          padding: '1.5rem',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Share size={24} />
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600' }}>Omni Share</h1>
          </div>
          {isSharing && (
            <span style={{
              background: '#22c55e',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}>Active</span>
          )}
        </div>

        <div style={{ padding: '1.5rem' }}>
          {!isSharing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  File or Directory Path
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={filePath}
                    onChange={(e) => setFilePath(e.target.value)}
                    placeholder="Enter path to share"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '0.875rem',
                      outline: 'none',
                      transition: 'border-color 0.15s ease',
                    }}
                  />
                  <Upload style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af'
                  }} size={18} />
                </div>
              </div>

              <button
                onClick={startSharing}
                disabled={isLoading}
                style={{
                  background: '#4f46e5',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.15s ease',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <>
                    <Share size={16} />
                    Start Sharing
                  </>
                )}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <QrCode size={16} style={{ color: '#3b82f6' }} />
                <p style={{ margin: 0, color: '#1e40af', fontSize: '0.875rem' }}>
                  Your file is being shared! Others can access it using the link below.
                </p>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Public URL
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={publicUrl}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      background: '#f9fafb',
                      fontSize: '0.875rem'
                    }}
                  />
                  <button
                    onClick={copyUrlToClipboard}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      background: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Copy size={16} style={{ color: '#6b7280' }} />
                  </button>
                </div>
              </div>

              {qrCodeData && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    background: 'white',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <img src={qrCodeData} alt="QR Code" style={{ width: '160px', height: '160px' }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Scan to access on mobile devices
                  </span>
                </div>
              )}

              <button
                onClick={stopSharing}
                disabled={isLoading}
                style={{
                  background: '#ef4444',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.15s ease',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <>
                    <X size={16} />
                    Stop Sharing
                  </>
                )}
              </button>
            </div>
          )}

          {message && (
            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: '8px',
              background: message.includes('Error') ? '#fef2f2' : '#f0fdf4',
              border: `1px solid ${message.includes('Error') ? '#fecaca' : '#bbf7d0'}`,
              color: message.includes('Error') ? '#991b1b' : '#166534',
              fontSize: '0.875rem'
            }}>
              {message}
            </div>
          )}
        </div>
      </div>
      
      <p style={{
        marginTop: '2rem',
        fontSize: '0.75rem',
        color: '#6b7280',
        textAlign: 'center'
      }}>
        Omni Share • Secure File Sharing
      </p>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          input:focus {
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
          }
          
          button:hover:not(:disabled) {
            opacity: 0.9;
          }
          
          button:disabled {
            cursor: not-allowed;
          }
        `}
      </style>
    </div>
  );
}

export default App;