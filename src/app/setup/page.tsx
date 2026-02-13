import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { redirect } from 'next/navigation'

export default function SetupPage() {
  async function createAdmin(formData: FormData) {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email ||!password) return

    // Szyfrujemy hasło
    const hashedPassword = await hash(password, 10)

    try {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Super Admin',
          role: 'ADMIN',
          permissions: { master: true }
        }
      })
      console.log("Utworzono admina!")
    } catch (e) {
      console.error("Błąd (może admin już istnieje?):", e)
    }
    redirect('/')
  }

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>🛠️ Utwórz Admina</h1>
      <p>Użyj tego tylko raz, aby stworzyć główne konto.</p>
      <form action={createAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input name="email" type="email" placeholder="Twój Email (Login)" required style={{ padding: '10px' }} />
        <input name="password" type="password" placeholder="Bezpieczne Hasło" required style={{ padding: '10px' }} />
        <button type="submit" style={{ padding: '15px', background: 'black', color: 'white', border: 'none', cursor: 'pointer' }}>
          Stwórz Konto Admina
        </button>
      </form>
    </div>
  )
}