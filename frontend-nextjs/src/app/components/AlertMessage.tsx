"use client";
import { useEffect } from "react";

interface AlertProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export default function AlertMessage({ message, type, onClose }: AlertProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Fecha automaticamente após 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600";

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded shadow-md mb-4 animate-fade-in`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white font-bold hover:opacity-80"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
