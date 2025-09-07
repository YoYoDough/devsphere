"use client"
import React, { useEffect } from 'react'
import { createContext, useContext, useState, ReactNode } from "react"

type MobileOpenContextType = {
  isMenuOpen: boolean
  setIsMenuOpen: (open: boolean) => void
  isMobile: boolean
}

const MobileOpenContext = createContext<MobileOpenContextType | undefined>(undefined)
export function MobileOpenProvider({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

   useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize() // initial check
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  
  return (
    <MobileOpenContext.Provider value={{ isMenuOpen, setIsMenuOpen, isMobile }}>
      {children}
    </MobileOpenContext.Provider>
  )
}

// Hook for easier consumption
export function useMobileOpen() {
  const context = useContext(MobileOpenContext)
  if (!context) throw new Error("useMobileOpen must be used within MobileOpenProvider")
  return context
}
export default MobileOpenProvider