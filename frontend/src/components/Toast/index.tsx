"use client"

import { useEffect, useState } from "react"

export type ToastType = "success" | "error" | "warning" | "info"
export type ToastPosition = "top-center" | "top-left" | "top-right" | "bottom-center" | "bottom-left" | "bottom-right"

interface ToastProps {
  message: string
  type: ToastType
  position?: ToastPosition
  duration?: number
  isVisible: boolean
  onClose: () => void
}

const toastStyles = {
  success: {
    bg: "bg-green-600",
    border: "border-green-700",
    text: "text-white"
  },
  error: {
    bg: "bg-red-600",
    border: "border-red-700",
    text: "text-white"
  },
  warning: {
    bg: "bg-yellow-600",
    border: "border-yellow-700",
    text: "text-white"
  },
  info: {
    bg: "bg-blue-600",
    border: "border-blue-700",
    text: "text-white"
  }
}

const positionStyles = {
  "top-center": "top-4 left-1/2 transform -translate-x-1/2",
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4"
}

export default function Toast({ 
  message, 
  type, 
  position = "top-center", 
  duration = 3000, 
  isVisible, 
  onClose 
}: ToastProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setTimeout(onClose, 300) // Wait for exit animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible && !isAnimating) return null

  const styles = toastStyles[type]
  const positionStyle = positionStyles[position]

  return (
    <div className={`fixed z-50 ${positionStyle} transition-opacity duration-500 ease-in-out ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className={`
        ${styles.bg} 
        ${styles.border} 
        ${styles.text} 
        border-2 
        px-6 
        py-3 
        rounded-lg 
        shadow-lg 
        max-w-sm 
        break-words
        flex 
        items-center 
        justify-between
        gap-3
      `}>
        <span className="font-medium">{message}</span>
        <button
          onClick={() => {
            setIsAnimating(false)
            setTimeout(onClose, 300)
          }}
          className="text-white hover:text-gray-200 transition-colors ml-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
} 