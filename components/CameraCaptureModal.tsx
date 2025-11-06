import React, { useRef, useEffect, useState, useCallback } from 'react';
import { XMarkIcon, CameraIcon } from './icons/Icons';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access the camera. Please check permissions and try again.");
      if (err instanceof Error && err.name === 'NotAllowedError') {
        setError("Camera access was denied. Please allow camera access in your browser settings.");
      }
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onCapture(dataUrl);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-gray-900 w-full max-w-2xl relative animate-fade-in-down overflow-hidden rounded-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Capture Photo</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="relative">
          {error && (
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center p-4 text-center">
              <p className="text-red-400">{error}</p>
              <button onClick={startCamera} className="mt-4 bg-primary text-white font-bold py-2 px-4 rounded-lg">Try Again</button>
            </div>
          )}
          <video ref={videoRef} autoPlay playsInline className="w-full h-auto aspect-video" />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        <div className="p-4 bg-gray-800 flex justify-center">
          <button
            onClick={handleCapture}
            disabled={!stream || !!error}
            className="p-4 bg-white rounded-full disabled:bg-gray-500 disabled:cursor-not-allowed group"
            aria-label="Take picture"
          >
            <CameraIcon className="h-8 w-8 text-primary group-disabled:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
