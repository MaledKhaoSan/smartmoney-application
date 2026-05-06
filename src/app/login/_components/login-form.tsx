"use client"

import { cn } from "@/lib/utils"
import {
  IconLoader2,
  IconEye,
  IconEyeOff
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { loginAction } from "@/api/authService"
import { useState } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
    // ถ้าสำเร็จ จะ redirect จาก server action โดยอัตโนมัติ
  }

  return (
    <div className={cn("w-full bg-white min-h-svh md:min-h-min md:max-w-md md:rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col relative", className)} {...props}>
      {/* Top Header with Wave */}
      <div className="relative h-[30svh] min-h-[200px] md:h-48 md:min-h-[192px] bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white pb-8">
          {/* Logo */}
          <div className="mb-2">
            <svg width="48" height="42" viewBox="0 0 50 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 40C25 40 5 25 15 5C15 5 22 18 25 25C28 18 35 5 35 5C45 25 25 40 25 40Z" fill="white" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-widest uppercase mt-1">SmartMoney</h1>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none translate-y-[1px]">
          <svg className="relative block w-full h-[50px] md:h-[40px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C52.16,104.74,106.67,110.15,162.77,105.7,216.58,101.44,269.4,85.22,321.39,56.44Z" className="fill-white"></path>
          </svg>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-8 pb-8 md:pb-10 flex flex-col items-center">
        <h2 className="text-2xl font-medium text-gray-800 mb-6 md:mb-8 mt-2">ยินดีต้อนรับกลับมา !</h2>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 md:gap-5">
          {error && (
            <div className="rounded-2xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive text-center">
              {error}
            </div>
          )}

          <div className="relative w-full">
            <Input
              id="identifier"
              name="identifier"
              type="text"
              placeholder="ชื่อผู้ใช้ / อีเมล / เบอร์โทร"
              required
              disabled={loading}
              className="rounded-full bg-gray-50/80 border-gray-100 h-14 px-6 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:bg-white shadow-inner"
            />
          </div>

          <div className="relative w-full">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่าน"
              required
              disabled={loading}
              className="rounded-full bg-gray-50/80 border-gray-100 h-14 pl-6 pr-12 text-sm placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:bg-white shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center justify-between px-3 mt-1 mb-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-500">
              <input type="checkbox" className="rounded-full border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
              จดจำฉันไว้
            </label>
            <a href="#" className="text-sm text-gray-500 hover:text-blue-600">
              ลืมรหัสผ่าน?
            </a>
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="outline"
            className="w-full rounded-full h-14 text-lg font-medium border-2 border-blue-500 text-blue-600 hover:bg-blue-50 bg-white"
          >
            {loading && <IconLoader2 className="size-5 animate-spin mr-2" />}
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </Button>

          <div className="text-center mt-3 text-sm text-gray-500">
            ยังไม่มีบัญชีใช่ไหม? <a href="#" className="text-blue-600 hover:underline font-medium">สมัครสมาชิก</a>
          </div>
        </form>
      </div>
    </div>
  )
}
