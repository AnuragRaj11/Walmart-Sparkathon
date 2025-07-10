import React, { useRef, useState, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { detectProduct, getAllProducts } from '../services/api';

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'environment'
};

const Camera = ({ onProductDetected }) => {
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [lastDetection, setLastDetection] = useState(null);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [cameraError, setCameraError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [permissionState, setPermissionState] = useState('checking');
  const [debugInfo, setDebugInfo] = useState([]);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);

  // Add debug logging
  const addDebugInfo = (message) => {
    console.log('Camera Debug:', message);
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Load products for fallback mode
  useEffect(() => {
    getAllProducts().then(result => {
      if (result.success) {
        setAvailableProducts(result.products);
      }
    });
  }, []);

  // Check camera permissions and availability
  useEffect(() => {
    addDebugInfo('Starting camera permission check');
    checkCameraPermissions();
  }, []);

  const checkCameraPermissions = async () => {
    try {
      addDebugInfo('Checking browser support');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera not supported in this browser. Using fallback mode.');
        setPermissionState('unsupported');
        setFallbackMode(true);
        addDebugInfo('getUserMedia not supported - enabling fallback mode');
        return;
      }

      addDebugInfo('Browser supports camera API');

      // Skip strict permission checking and try direct access
      // This is more reliable than permission.query which can be inconsistent
      try {
        addDebugInfo('Attempting direct camera access');
        const stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
        
        // Success! Camera is accessible
        addDebugInfo('Camera access successful');
        stream.getTracks().forEach(track => track.stop());
        setPermissionState('granted');
        setCameraError(null);
        setFallbackMode(false);
        addDebugInfo('Camera permissions verified');
        
      } catch (error) {
        addDebugInfo(`Camera access failed: ${error.name} - ${error.message}`);
        handleCameraError(error);
      }
    } catch (error) {
      console.error('Camera permission check failed:', error);
      addDebugInfo(`Permission check error: ${error.message}`);
      setCameraError('Failed to check camera permissions. Using fallback mode.');
      setPermissionState('error');
      setFallbackMode(true);
    }
  };

  const handleCameraError = (error) => {
    console.error('Camera error:', error);
    addDebugInfo(`Handling camera error: ${error.name}`);
    
    let errorMessage = 'Camera access failed';
    
    switch (error.name) {
      case 'NotAllowedError':
        errorMessage = 'Camera access denied. Using fallback mode.';
        setPermissionState('denied');
        setFallbackMode(true);
        break;
      case 'NotFoundError':
        errorMessage = 'No camera found on this device. Using fallback mode.';
        setPermissionState('error');
        setFallbackMode(true);
        break;
      case 'NotReadableError':
        errorMessage = 'Camera is being used by another application. Using fallback mode.';
        setPermissionState('error');
        setFallbackMode(true);
        break;
      case 'OverconstrainedError':
        errorMessage = 'Camera does not meet the required constraints. Trying with basic settings...';
        setPermissionState('error');
        // Try with simpler constraints
        setTimeout(() => trySimpleConstraints(), 1000);
        break;
      case 'SecurityError':
        errorMessage = 'Camera access blocked due to security restrictions. Using fallback mode.';
        setPermissionState('error');
        setFallbackMode(true);
        break;
      default:
        errorMessage = `Camera error: ${error.message || 'Unknown error'}. Using fallback mode.`;
        setPermissionState('error');
        setFallbackMode(true);
    }
    
    setCameraError(errorMessage);
    addDebugInfo(`Error set: ${errorMessage}`);
  };

  const trySimpleConstraints = async () => {
    try {
      addDebugInfo('Trying with basic camera constraints');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 } 
      });
      stream.getTracks().forEach(track => track.stop());
      setPermissionState('granted');
      setCameraError(null);
      setFallbackMode(false);
      addDebugInfo('Basic constraints successful');
    } catch (error) {
      addDebugInfo(`Basic constraints also failed: ${error.name}`);
      setCameraError('Camera not available. Using fallback mode.');
      setFallbackMode(true);
    }
  };

  const onUserMedia = () => {
    addDebugInfo('Webcam component ready');
    setCameraReady(true);
    setCameraError(null);
    console.log('Camera ready');
  };

  const onUserMediaError = (error) => {
    addDebugInfo(`Webcam component error: ${error.name}`);
    setCameraReady(false);
    handleCameraError(error);
  };

  const simulateProductScan = (product) => {
    setScanning(true);
    addDebugInfo(`Simulating scan for: ${product.name}`);
    
    // Simulate detection delay
    setTimeout(() => {
      const result = {
        success: true,
        product: product,
        confidence: 0.95,
        detectedAt: new Date().toISOString()
      };
      
      setLastDetection(result);
      setDetectionHistory(prev => [result, ...prev.slice(0, 4)]);
      onProductDetected(result.product);
      setScanning(false);
      
      // Show success animation
      setTimeout(() => {
        setLastDetection(null);
      }, 3000);
    }, 1000);
  };

  const capture = useCallback(async () => {
    if (!webcamRef.current || !cameraReady) {
      setCameraError('Camera not ready. Please wait or check camera permissions.');
      addDebugInfo('Capture failed - camera not ready');
      return;
    }

    try {
      addDebugInfo('Attempting to capture image');
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        setCameraError('Failed to capture image. Please try again.');
        addDebugInfo('Screenshot returned null');
        return;
      }

      addDebugInfo('Image captured successfully');
      setScanning(true);
      setCameraError(null);

      try {
        addDebugInfo('Sending image for detection');
        const result = await detectProduct(imageSrc);
        if (result.success) {
          addDebugInfo(`Product detected: ${result.product.name}`);
          setLastDetection(result);
          setDetectionHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 detections
          onProductDetected(result.product);
          
          // Show success animation
          setTimeout(() => {
            setLastDetection(null);
          }, 3000);
        } else {
          addDebugInfo('Detection API returned failure');
          setCameraError('Product detection failed. Please try again.');
        }
      } catch (error) {
        console.error('Detection failed:', error);
        addDebugInfo(`Detection error: ${error.message}`);
        setCameraError('Product detection failed. Please check your connection and try again.');
      } finally {
        setScanning(false);
      }
    } catch (error) {
      console.error('Capture failed:', error);
      addDebugInfo(`Capture error: ${error.message}`);
      setCameraError('Failed to capture image. Please try again.');
      setScanning(false);
    }
  }, [webcamRef, onProductDetected, cameraReady]);

  const retryCamera = () => {
    addDebugInfo('Retrying camera access');
    setCameraError(null);
    setCameraReady(false);
    setPermissionState('checking');
    setFallbackMode(false);
    setDebugInfo([]);
    checkCameraPermissions();
  };

  const forceStart = () => {
    addDebugInfo('Force starting camera (bypassing permission check)');
    setPermissionState('granted');
    setCameraError(null);
    setFallbackMode(false);
  };

  const enableFallbackMode = () => {
    addDebugInfo('User enabled fallback mode');
    setFallbackMode(true);
    setCameraError(null);
    setPermissionState('fallback');
  };

  // Render fallback mode (works without camera)
  if (fallbackMode) {
    return (
      <div className="camera-container">
        <div className="camera-header">
          <h2>📱 Product Scanner (Demo Mode)</h2>
          <p>Select products to simulate scanning</p>
        </div>
        
        <div className="fallback-scanner">
          <div className="fallback-info">
            <div className="info-icon">ℹ️</div>
            <p><strong>Camera not available.</strong> You can still test the app by selecting products below:</p>
          </div>
          
          {scanning && (
            <div className="scanning-simulation">
              <div className="scanning-animation">
                <div className="scan-line"></div>
              </div>
              <p>🔍 Scanning product...</p>
            </div>
          )}
          
          {lastDetection && (
            <div className="detection-overlay">
              <div className="detection-result">
                <div className="detection-icon">✅</div>
                <h4>Product Detected!</h4>
                <p>{lastDetection.product.name}</p>
                <p className="confidence">
                  Confidence: {(lastDetection.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          )}
          
          <div className="product-selector">
            <h4>👆 Choose a product to "scan":</h4>
            {availableProducts.length > 0 ? (
              <div className="product-grid">
                {availableProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="product-item"
                    onClick={() => !scanning && simulateProductScan(product)}
                    style={{ opacity: scanning ? 0.5 : 1 }}
                  >
                    <img src={product.image} alt={product.name} />
                    <div className="product-info">
                      <span className="product-name">{product.name}</span>
                      <span className="product-price">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>📦 No sample products available</p>
                <p>Demo mode is ready but no products are configured for testing.</p>
              </div>
            )}
          </div>
          
          <div className="fallback-actions">
            <button onClick={retryCamera} className="retry-btn">
              📹 Try Camera Again
            </button>
          </div>
        </div>
        
        {/* Recent detections */}
        {detectionHistory.length > 0 && (
          <div className="detection-history">
            <h4>Recent Scans</h4>
            <div className="history-items">
              {detectionHistory.map((detection, index) => (
                <div key={index} className="history-item">
                  <img 
                    src={detection.product.image} 
                    alt={detection.product.name}
                    className="history-image"
                  />
                  <div className="history-details">
                    <span className="history-name">{detection.product.name}</span>
                    <span className="history-time">
                      {new Date(detection.detectedAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <button 
                    onClick={() => onProductDetected(detection.product)}
                    className="add-again-btn"
                  >
                    + Add Again
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render error state with more options
  if (cameraError && permissionState !== 'granted') {
    return (
      <div className="camera-container">
        <div className="camera-header">
          <h2>📷 Product Scanner</h2>
          <p>Camera setup required</p>
        </div>
        
        <div className="camera-error">
          <div className="error-icon">⚠️</div>
          <h3>Camera Issue</h3>
          <p>{cameraError}</p>
          
          <div className="error-solutions">
            <h4>Solutions:</h4>
            <ul>
              <li><strong>Use Demo Mode:</strong> Click "Use Demo Mode" below to test without camera</li>
              <li><strong>Update Browser:</strong> Use latest Chrome, Firefox, Safari, or Edge</li>
              <li><strong>Check URL:</strong> Make sure you're using localhost or HTTPS</li>
              <li><strong>Allow Permissions:</strong> Click "Allow" when prompted</li>
            </ul>
          </div>
          
          <div className="error-actions">
            <button onClick={enableFallbackMode} className="demo-mode-btn">
              📱 Use Demo Mode (Works Without Camera)
            </button>
            <button onClick={forceStart} className="force-start-btn">
              🚀 Force Start Camera
            </button>
            <button onClick={retryCamera} className="retry-btn">
              🔄 Retry Detection
            </button>
          </div>

          {/* Debug information */}
          {debugInfo.length > 0 && (
            <details className="debug-info">
              <summary>🔧 Debug Information</summary>
              <div className="debug-log">
                {debugInfo.map((info, index) => (
                  <div key={index} className="debug-line">{info}</div>
                ))}
              </div>
            </details>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="camera-container">
      <div className="camera-header">
        <h2>📷 Product Scanner</h2>
        <p>Point camera at product and click scan</p>
        {!cameraReady && permissionState === 'granted' && (
          <p className="camera-loading">📹 Initializing camera...</p>
        )}
      </div>
      
      <div className="camera-feed">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="webcam"
          onUserMedia={onUserMedia}
          onUserMediaError={onUserMediaError}
        />
        
        {/* Camera loading overlay */}
        {!cameraReady && (
          <div className="camera-loading-overlay">
            <div className="loading-spinner">⏳</div>
            <p>Starting camera...</p>
          </div>
        )}
        
        {/* Scanning overlay */}
        {scanning && (
          <div className="scanning-overlay">
            <div className="scanning-animation">
              <div className="scan-line"></div>
            </div>
            <p>🔍 Scanning for products...</p>
          </div>
        )}
        
        {/* Detection result overlay */}
        {lastDetection && (
          <div className="detection-overlay">
            <div className="detection-result">
              <div className="detection-icon">✅</div>
              <h4>Product Detected!</h4>
              <p>{lastDetection.product.name}</p>
              <p className="confidence">
                Confidence: {(lastDetection.confidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        )}
        
        {/* Scan target guide */}
        {cameraReady && (
          <div className="scan-guide">
            <div className="scan-frame">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Error message for capture/detection errors */}
      {cameraError && cameraReady && (
        <div className="capture-error">
          <p>⚠️ {cameraError}</p>
        </div>
      )}
      
      <div className="camera-controls">
        <button 
          onClick={capture} 
          disabled={scanning || !cameraReady}
          className="scan-btn"
        >
          {scanning ? (
            <>
              <span className="loading-spinner">⏳</span>
              Scanning...
            </>
          ) : !cameraReady ? (
            <>
              📹 Camera Starting...
            </>
          ) : (
            <>
              🔍 Scan Product
            </>
          )}
        </button>
        
        <button onClick={enableFallbackMode} className="demo-btn">
          📱 Use Demo Mode
        </button>
      </div>
      
      {/* Recent detections */}
      {detectionHistory.length > 0 && (
        <div className="detection-history">
          <h4>Recent Scans</h4>
          <div className="history-items">
            {detectionHistory.map((detection, index) => (
              <div key={index} className="history-item">
                <img 
                  src={detection.product.image} 
                  alt={detection.product.name}
                  className="history-image"
                />
                <div className="history-details">
                  <span className="history-name">{detection.product.name}</span>
                  <span className="history-time">
                    {new Date(detection.detectedAt).toLocaleTimeString()}
                  </span>
                </div>
                <button 
                  onClick={() => onProductDetected(detection.product)}
                  className="add-again-btn"
                >
                  + Add Again
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Camera;
