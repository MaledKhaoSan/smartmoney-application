"use client"

import { cn } from "@/lib/utils"
import { IconCreditCard, IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { loginAction } from "@/api/authService"
import { useState } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex flex-col">
            <a href="#" className="flex items-center gap-2 self-center font-medium">
              <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <IconCreditCard className="size-4" />
              </div>
              SmartMoney
            </a>
          </CardTitle>
          <CardTitle>
            <h1 className="text-xl mt-4">
              ยินดีต้อนรับกลับมา
            </h1>
          </CardTitle>
          <CardDescription>
            เข้าสู่ระบบด้วยอีเมล หรือ ชื่อผู้ใช้งานของคุณ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              <Field>
                <FieldLabel htmlFor="identifier">อีเมล หรือ ชื่อผู้ใช้งาน</FieldLabel>
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="m@example.com หรือ username"
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">รหัสผ่าน</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    ลืมรหัสผ่าน?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={loading}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading && <IconLoader2 className="size-4 animate-spin" />}
                  {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </Button>
                <FieldDescription className="text-center">
                  ยังไม่มีบัญชีใช่ไหม? <a href="#">สมัครสมาชิก</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        การดำเนินการต่อถือว่าคุณยอมรับ <a href="#">ข้อกำหนดการให้บริการ</a>{" "}
        และ <a href="#">นโยบายความเป็นส่วนตัว</a> ของเรา
      </FieldDescription>
    </div>
  )
}
