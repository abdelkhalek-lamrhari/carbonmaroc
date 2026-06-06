import { Suspense } from "react"
import { AuthCard } from "@/components/auth/auth-card"

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen gradient-bg" />}>
      <AuthCard mode="login" />
    </Suspense>
  )
}
