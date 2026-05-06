"use client"

import { LoginForm } from "@/app/login/_components/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-w-full min-h-svh md:h-fit flex-col items-center justify-center bg-indigo-50/30 sm:p-6 md:p-10">

      <LoginForm />

    </div>
  )
}
