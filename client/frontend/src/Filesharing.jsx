import React, { useState } from 'react';
import { Upload, Share, X, Copy, QrCode } from 'lucide-react';

const transitions = {
  scale: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  fade: 'opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  slideDown: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
};

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
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'fixed',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        maxWidth: '550px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
        transform: 'translateY(0)',
        transition: transitions.slideDown,
        zIndex: 1
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
          padding: '1.75rem',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              transform: 'translateY(0)',
              transition: transitions.scale
            }}>
              <Share size={28} style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }} />
              <h1 style={{ 
                margin: 0, 
                fontSize: '1.75rem', 
                fontWeight: '700',
                letterSpacing: '-0.025em',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>Omni Share</h1>
            </div>
            {isSharing && (
              <span style={{
                background: 'rgba(34, 197, 94, 0.9)',
                color: 'white',
                padding: '0.35rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: transitions.scale
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: '#fff',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }} />
                Active
              </span>
            )}
          </div>
          
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1), transparent 70%)',
            zIndex: 1
          }} />
        </div>

        <div style={{ 
          padding: '2rem',
          position: 'relative'
        }}>
          <div style={{
            opacity: isSharing ? 0 : 1,
            transform: `translateY(${isSharing ? '10px' : '0'})`,
            transition: `${transitions.fade}, ${transitions.slideDown}`,
            position: isSharing ? 'absolute' : 'relative',
            width: '100%'
          }}>
            {!isSharing && (
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
            )}
          </div>

          <div style={{
            opacity: isSharing ? 1 : 0,
            transform: `translateY(${isSharing ? '0' : '10px'})`,
            transition: `${transitions.fade}, ${transitions.slideDown}`,
            position: isSharing ? 'relative' : 'absolute',
            width: '100%'
          }}>
            {isSharing && (
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
          </div>
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
          
          @keyframes pulse {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
          }

          input {
            transition: all 0.2s ease;
          }

          input:focus {
            border-color: #4f46e5;
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
            transform: translateY(-1px);
          }

          button {
            transition: all 0.2s ease;
          }

          button:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
          }

          button:active:not(:disabled) {
            transform: translateY(0);
          }

          .hover-scale {
            transition: transform 0.2s ease;
          }

          .hover-scale:hover {
            transform: scale(1.02);
          }
        `}
      </style>
    </div>
  );
}

export default App;