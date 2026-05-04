"use client"

import { useAppStore } from "@/store/useAppStore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export default function RoleSelectionPage() {
  const { users, setCurrentUser } = useAppStore()
  const router = useRouter()

  const handleLogin = (userId: string) => {
    setCurrentUser(userId)
    router.push('/organization')
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to SmartMoney</h1>
        <p className="text-muted-foreground">Select a user role to simulate the experience</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="w-[300px] cursor-pointer hover:border-primary transition-colors" onClick={() => handleLogin(user.id)}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-base">{user.name}</CardTitle>
                <CardDescription className="text-xs">{user.role}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                Manage members, transactions and class settings
              </div>
              <Button className="w-full mt-4" variant="secondary">Login as {user.username}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
