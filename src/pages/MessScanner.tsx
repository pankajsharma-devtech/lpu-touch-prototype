import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { X, ScanLine, CameraOff, TriangleAlert } from 'lucide-react';
import { useMeal } from '../context/MealContext';
import './MessScanner.css';

const SCANNER_ELEMENT_ID = 'qr-reader';
const SCAN_CONFIG = { fps: 10, qrbox: { width: 250, height: 250 } };

type ScannerState =
  | 'initializing'
  | 'scanning'
  | 'success'
  | 'permission-denied'
  | 'unsupported'
  | 'error';

export default function MessScanner() {
  const navigate = useNavigate();
  const { selectedMeal, setScanTimestamp } = useMeal();
  const [state, setState] = useState<ScannerState>('initializing');
  const [errorDetail, setErrorDetail] = useState('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false);
  const hasScannedRef = useRef(false);

  useEffect(() => {
    if (!selectedMeal) {
      navigate('/mess', { replace: true });
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setState('unsupported');
      return;
    }

    let cancelled = false;
    setState('initializing');
    hasScannedRef.current = false;

    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID, { verbose: false });
    scannerRef.current = scanner;

    function stopScanner(): Promise<void> {
      if (!isRunningRef.current) return Promise.resolve();
      isRunningRef.current = false;
      return scanner
        .stop()
        .then(() => scanner.clear())
        .catch(() => {
          // Already stopped/cleared — safe to ignore on teardown.
        });
    }

    function handleDecoded(decodedText: string) {
      // Synchronous, immediate guard — set BEFORE any async work, so a burst
      // of decode callbacks from the same or next frame can only ever act
      // once. (isRunningRef alone isn't enough here: it only flips to false
      // inside stopScanner(), which is async, leaving a window where a
      // second callback could slip through.)
      if (cancelled || hasScannedRef.current) return;
      hasScannedRef.current = true;

      // Any successfully decoded QR triggers the demo flow — decodedText is
      // a local trigger only and is never validated against or sent to LPU.
      void decodedText;
      setScanTimestamp(Date.now());
      setState('success');
      stopScanner().finally(() => {
        if (!cancelled) navigate('/mess/result');
      });
    }

    async function startScanning() {
      // Try the standard "rear camera" constraint first — this is the
      // single most reliable path across mobile browsers and doesn't
      // require an extra getUserMedia round-trip before the real one.
      try {
        await scanner.start({ facingMode: 'environment' }, SCAN_CONFIG, handleDecoded, () => {
          // Per-frame "no QR found in this frame" callback — fires
          // continuously while scanning is active, so intentionally a no-op.
        });
        return;
      } catch (firstErr) {
        if (cancelled) throw firstErr;
        // Some laptops/desktops (and a few Android WebViews) don't support
        // facingMode constraints at all. Fall back to enumerating actual
        // devices and starting the first one explicitly.
        const cameras = await Html5Qrcode.getCameras();
        if (!cameras.length) throw firstErr;
        await scanner.start({ deviceId: { exact: cameras[0].id } }, SCAN_CONFIG, handleDecoded, () => {});
      }
    }

    const startPromise = startScanning();

    startPromise
      .then(() => {
        isRunningRef.current = true;
        if (cancelled) {
          // Effect was torn down (e.g. React StrictMode's mount → unmount →
          // remount in dev) while the camera was still starting up — stop it
          // immediately instead of leaving a dangling stream.
          stopScanner();
        } else {
          setState('scanning');
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const name = err instanceof Error ? err.name : '';
        const message = err instanceof Error ? err.message : String(err);
        if (name === 'NotAllowedError' || /permission/i.test(message)) {
          setState('permission-denied');
        } else if (name === 'NotFoundError' || name === 'NotReadableError' || /NotFoundError|NotReadableError/i.test(message)) {
          setState('unsupported');
        } else {
          setState('error');
          setErrorDetail(message);
        }
      });

    return () => {
      cancelled = true;
      // Wait for the in-flight start() to settle one way or the other before
      // attempting to stop — calling stop() while start() is still pending is
      // what breaks html5-qrcode under React StrictMode's double-invoke.
      startPromise.catch(() => {}).finally(() => {
        stopScanner();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMeal]);

  function handleClose() {
    navigate('/mess');
  }

  // Dev-only manual trigger for testing the post-scan flow without a second
  // device handy. Clearly labeled, only rendered while actively scanning,
  // and safe to delete this block (and only this block) to remove it.
  function handleTestScan() {
    if (hasScannedRef.current) return;
    hasScannedRef.current = true;
    isRunningRef.current = false;
    const scanner = scannerRef.current;
    const finish = () => {
      setScanTimestamp(Date.now());
      navigate('/mess/result');
    };
    if (scanner) {
      scanner.stop().then(() => scanner.clear()).catch(() => {}).finally(finish);
    } else {
      finish();
    }
  }

  return (
    <div className="scanner-screen">
      <div className="scanner-topbar">
        <button className="scanner-close" onClick={handleClose} aria-label="Close scanner">
          <X size={24} color="#fff" />
        </button>
        <div className="scanner-topbar__title">Scan for {selectedMeal ?? 'Meal'}</div>
        <div style={{ width: 40 }} />
      </div>

      <div id={SCANNER_ELEMENT_ID} className="scanner-viewport" />

      {state === 'initializing' && (
        <div className="scanner-overlay">
          <ScanLine size={40} color="#fff" />
          <p>Starting camera…</p>
        </div>
      )}

      {state === 'scanning' && (
        <div className="scanner-hint">
          <div className="scanner-frame" />
          <p>Align the QR code within the frame</p>
          {import.meta.env.DEV && (
            <button className="scanner-test-btn" onClick={handleTestScan} style={{ pointerEvents: 'auto' }}>
              Test Scan (dev only)
            </button>
          )}
        </div>
      )}

      {state === 'permission-denied' && (
        <div className="scanner-overlay scanner-overlay--error">
          <CameraOff size={40} color="#fff" />
          <p>Camera access was denied.</p>
          <span>
            Enable camera permission for this site in your browser settings, then reopen the
            scanner. Camera access also requires a secure context (localhost or HTTPS).
          </span>
          <button className="scanner-retry" onClick={handleClose}>
            Go back
          </button>
        </div>
      )}

      {state === 'unsupported' && (
        <div className="scanner-overlay scanner-overlay--error">
          <CameraOff size={40} color="#fff" />
          <p>Camera unavailable</p>
          <span>
            No usable camera was found, or this browser doesn't support camera-based scanning.
          </span>
          <button className="scanner-retry" onClick={handleClose}>
            Go back
          </button>
        </div>
      )}

      {state === 'error' && (
        <div className="scanner-overlay scanner-overlay--error">
          <TriangleAlert size={40} color="#fff" />
          <p>Scanner couldn't start</p>
          <span>{errorDetail || 'An unexpected error occurred.'}</span>
          <button className="scanner-retry" onClick={handleClose}>
            Go back
          </button>
        </div>
      )}
    </div>
  );
}
