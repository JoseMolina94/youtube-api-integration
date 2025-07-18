"use client";

export default function ClockIcon({ filled = false, className = "w-6 h-6" }: { filled?: boolean, className?: string }) {
  return filled ? (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 9H9a1 1 0 01-1-1V7a1 1 0 112 0v2h1a1 1 0 110 2z" />
    </svg>
  ) : (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6v4l2 2" />
    </svg>
  );
} 