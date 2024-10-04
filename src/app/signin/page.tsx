// src/app/signin/page.tsx
'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function Signin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    const data = await res.json()

    if (data.token) {
      localStorage.setItem('token', data.token)
      setMessage('Login successful!')
      // Redirect or take any other action after successful login
    } else {
      setMessage(data.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <h2 className="text-3xl font-semibold mb-4 text-center">Sign in to Admit Compass</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">UMBC Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="UMBC Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
          {message && <p className={`text-${message === 'Login successful!' ? 'green' : 'red'}-500`}>{message}</p>}
        </form>
      </Card>
    </div>
  )
}
