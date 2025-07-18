"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'
import Toast, { ToastType, ToastPosition } from '@/components/Toast'

interface ToastContextType {
  showToast: (message: string, type: ToastType, position?: ToastPosition, duration?: number) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState<ToastType>('info')
  const [position, setPosition] = useState<ToastPosition>('top-center')
  const [duration, setDuration] = useState(3000)

  const showToast = (
    newMessage: string, 
    newType: ToastType, 
    newPosition: ToastPosition = 'top-center', 
    newDuration: number = 3000
  ) => {
    setMessage(newMessage)
    setType(newType)
    setPosition(newPosition)
    setDuration(newDuration)
    setIsVisible(true)
  }

  const hideToast = () => {
    setIsVisible(false)
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast
        message={message}
        type={type}
        position={position}
        duration={duration}
        isVisible={isVisible}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  )
} 