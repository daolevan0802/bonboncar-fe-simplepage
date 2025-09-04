import { LoginForm } from '@/components/login-form'
import { AuroraBackground } from '@/components/ui/aurora-background'
import { guestGuard } from '@/lib/auth-guard.tsx'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: guestGuard,
  component: App,
})

function App() {
  return (
    <AuroraBackground>
      <div className="flex min-h-svh min-w-svw flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
    </AuroraBackground>
  )
}
