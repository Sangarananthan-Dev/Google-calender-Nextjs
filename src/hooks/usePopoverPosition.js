"use client"

import { useState, useEffect, useCallback, useMemo } from "react"


export function usePopoverPosition({ isOpen, triggerRect, popoverWidth, popoverHeight }) {
  const [position, setPosition] = useState({ x: 0, y: 0, placement: "bottom" })
  const [isReady, setIsReady] = useState(false)

  const calculatePosition = useCallback(
    (rect) => {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      }

      const spacing = 8 // Gap between trigger and popover

      // Try different placements in order of preference
      const placements = [
        {
          name: "bottom",
          x: rect.left + rect.width / 2 - popoverWidth / 2,
          y: rect.bottom + spacing,
        },
        {
          name: "top",
          x: rect.left + rect.width / 2 - popoverWidth / 2,
          y: rect.top - popoverHeight - spacing,
        },
        {
          name: "right",
          x: rect.right + spacing,
          y: rect.top + rect.height / 2 - popoverHeight / 2,
        },
        {
          name: "left",
          x: rect.left - popoverWidth - spacing,
          y: rect.top + rect.height / 2 - popoverHeight / 2,
        },
      ]

      // Find the best placement that fits in viewport
      for (const placement of placements) {
        const fitsHorizontally = placement.x >= 0 && placement.x + popoverWidth <= viewport.width
        const fitsVertically = placement.y >= 0 && placement.y + popoverHeight <= viewport.height

        if (fitsHorizontally && fitsVertically) {
          return {
            x: placement.x,
            y: placement.y,
            placement: placement.name,
          }
        }
      }

      // Fallback: position with constraints
      let finalX = rect.left + rect.width / 2 - popoverWidth / 2
      let finalY = rect.bottom + spacing

      // Constrain to viewport
      finalX = Math.max(8, Math.min(finalX, viewport.width - popoverWidth - 8))
      finalY = Math.max(8, Math.min(finalY, viewport.height - popoverHeight - 8))

      return {
        x: finalX,
        y: finalY,
        placement: "bottom" ,
      }
    },
    [popoverWidth, popoverHeight],
  )

  // Calculate position immediately when triggerRect is available
  const initialPosition = useMemo(() => {
    if (triggerRect && popoverWidth > 0 && popoverHeight > 0) {
      return calculatePosition(triggerRect)
    }
    return { x: 0, y: 0, placement: "bottom" }
  }, [triggerRect, popoverWidth, popoverHeight, calculatePosition])

  useEffect(() => {
    if (isOpen && triggerRect && popoverWidth > 0 && popoverHeight > 0) {
      const newPosition = calculatePosition(triggerRect)
      setPosition(newPosition)
      setIsReady(true)

      const handleResize = () => {
        const updatedPosition = calculatePosition(triggerRect)
        setPosition(updatedPosition)
      }

      const handleScroll = () => {
        const updatedPosition = calculatePosition(triggerRect)
        setPosition(updatedPosition)
      }

      window.addEventListener("resize", handleResize)
      window.addEventListener("scroll", handleScroll)

      return () => {
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("scroll", handleScroll)
      }
    } else {
      setIsReady(false)
    }
  }, [isOpen, triggerRect, popoverWidth, popoverHeight, calculatePosition])

  return { position: initialPosition, isReady }
}
