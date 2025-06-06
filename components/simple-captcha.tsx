"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RefreshCw } from "lucide-react"

interface SimpleCaptchaProps {
  onVerify: (isValid: boolean) => void
  disabled?: boolean
}

export function SimpleCaptcha({ onVerify, disabled = false }: SimpleCaptchaProps) {
  const [captchaText, setCaptchaText] = useState("")
  const [userInput, setUserInput] = useState("")
  const [isVerified, setIsVerified] = useState(false)

  const generateCaptcha = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptchaText(result)
    setUserInput("")
    setIsVerified(false)
    onVerify(false)
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

  useEffect(() => {
    const isValid = userInput.toUpperCase() === captchaText && userInput.length > 0
    setIsVerified(isValid)
    onVerify(isValid)
  }, [userInput, captchaText, onVerify])

  const drawCaptcha = () => {
    return (
      <div className="relative bg-gradient-to-r from-blue-100 to-green-100 border-2 border-gray-300 rounded-lg p-4 h-16 flex items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          {/* Background noise lines */}
          <svg className="w-full h-full">
            <line x1="0" y1="20" x2="100%" y2="40" stroke="#666" strokeWidth="1" />
            <line x1="20%" y1="0" x2="80%" y2="100%" stroke="#666" strokeWidth="1" />
            <line x1="60%" y1="0" x2="40%" y2="100%" stroke="#666" strokeWidth="1" />
          </svg>
        </div>
        <span
          className="text-2xl font-bold text-gray-800 tracking-wider select-none"
          style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            transform: "rotate(-2deg) skew(5deg)",
            fontFamily: "monospace",
          }}
        >
          {captchaText}
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Security Verification</Label>

      <div className="flex gap-2">
        <div className="flex-1">{drawCaptcha()}</div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateCaptcha}
          disabled={disabled}
          className="px-3"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="sr-only">Refresh CAPTCHA</span>
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="captcha-input" className="text-sm">
          Enter the characters shown above
        </Label>
        <Input
          id="captcha-input"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value.toUpperCase())}
          placeholder="Enter CAPTCHA"
          disabled={disabled}
          className={isVerified ? "border-green-500 bg-green-50" : ""}
          maxLength={6}
        />
        {isVerified && <p className="text-sm text-green-600">✓ Verification successful</p>}
      </div>
    </div>
  )
}
