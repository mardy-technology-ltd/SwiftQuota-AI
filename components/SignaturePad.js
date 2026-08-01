"use client";

import { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";

const SignaturePad = forwardRef(function SignaturePad({ onDrawEnd }, ref) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas internal resolution based on container
    canvas.width = canvas.offsetWidth || 500;
    canvas.height = canvas.offsetHeight || 180;

    const ctx = canvas.getContext("2d");
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsEmpty(false);
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    if (onDrawEnd) onDrawEnd(toDataURL());
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
    if (onDrawEnd) onDrawEnd(null);
  };

  const toDataURL = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return null;
    return canvas.toDataURL("image/png");
  };

  useImperativeHandle(ref, () => ({
    clear,
    toDataURL,
    isEmpty,
  }));

  return (
    <div style={{ width: "100%", position: "relative" }}>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        style={{
          width: "100%",
          height: "180px",
          background: "#ffffff",
          border: "2px dashed #cbd5e1",
          borderRadius: "12px",
          cursor: "crosshair",
          touchAction: "none",
        }}
      />
      {isEmpty && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#94a3b8",
            fontSize: "0.85rem",
            pointerEvents: "none",
            fontWeight: "500",
          }}
        >
          Sign here using mouse or finger...
        </div>
      )}
    </div>
  );
});

export default SignaturePad;
