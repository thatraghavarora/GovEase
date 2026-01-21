import { useEffect, useRef, useState } from "react";
import BottomNav from "../components/BottomNav";
import "./user-page.css";

const Scan = () => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [secureOk, setSecureOk] = useState(true);
  const [needsPlay, setNeedsPlay] = useState(false);

  const requestCamera = async () => {
    if (!secureOk) {
      setStatus("denied");
      setError("Camera needs HTTPS (or localhost). Open the site on https.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("unsupported");
      setError("Camera not supported in this browser.");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          const playPromise = videoRef.current.play();
          if (playPromise) {
            playPromise.catch(() => {
              setError("Tap the preview to start the camera.");
              setNeedsPlay(true);
            });
          }
        };
      }
      setStatus("active");
    } catch (err) {
      setStatus("denied");
      setError("Camera permission denied.");
    }
  };

  useEffect(() => {
    setSecureOk(window.isSecureContext);
    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handlePlayPreview = () => {
    if (!videoRef.current) {
      return;
    }

    const playPromise = videoRef.current.play();
    if (playPromise) {
      playPromise
        .then(() => {
          setNeedsPlay(false);
          setError("");
        })
        .catch(() => {
          setNeedsPlay(true);
        });
    }
  };

  return (
    <div className="user-page">
      <div className="user-shell">
        <header className="user-header">
          <h1>Scan QR</h1>
          <p>Scan center QR codes to book tokens</p>
        </header>
        <div className="scan-card">
          <div className="scan-preview">
            {status === "active" ? (
              <div className="scan-live" onClick={handlePlayPreview}>
                <video ref={videoRef} autoPlay playsInline muted controls={false} />
                {needsPlay && (
                  <button className="scan-start" type="button" onClick={handlePlayPreview}>
                    Tap to Start Preview
                  </button>
                )}
              </div>
            ) : (
              <div className="scan-placeholder">
                {!secureOk && "HTTPS required to access camera on mobile."}
                {status === "unsupported" && "Camera not supported."}
                {status === "denied" && "Permission denied."}
                {(status === "idle" || status === "loading") &&
                  "Allow camera to start scanning."}
              </div>
            )}
          </div>
          {error && <p className="scan-error">{error}</p>}
          <button className="primary" type="button" onClick={requestCamera}>
            {status === "active" ? "Camera Active" : "Allow Camera"}
          </button>
        </div>
        <BottomNav />
      </div>
    </div>
  );
};

export default Scan;
