import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const key = new TextEncoder().encode(process.env.SECRET_KEY |

| 'default-secret-key')

export async function encrypt(payload: any) {
  return new SignJWT(payload)
   .setProtectedHeader({ alg: 'HS256' })
   .setIssuedAt()
   .setExpirationTime('24h') // Sesja trwa 24h
   .sign(key)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, { algorithms: })
    return payload
  } catch (error) {
    return null
  }
}

export async function createSession(userId: string, role: string) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, role, expires })

  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires,
    sameSite: 'lax',
    path: '/',
  })
}

export async function verifySession() {
  const cookie = cookies().get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/login')
  }

  return { isAuth: true, userId: session.userId, role: session.role }
}

export async function logout() {
  cookies().delete('session')
  redirect('/login')
}