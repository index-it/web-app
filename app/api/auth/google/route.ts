import { GoogleOAuthClient } from '@/lib/services/GoogleOAuthClient'
import { NextRequest } from 'next/server'
 
export type GoogleOAuthCodeExchangeApiResponse = {
  id_token: string
}
 
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (code !== null) {
     const googleOAuthClient = new GoogleOAuthClient()
     const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

     if (googleClientId === undefined) {
      console.error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID env variable')
      return new Response('Something went wrong', {
        status: 500
      })
     }

     const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
     if (googleClientSecret === undefined) {
      console.error('Missing GOOGLE_CLIENT_SECRET env variable')
      return new Response('Something went wrong', {
        status: 500
      })
     }

     try {
      const idToken = await googleOAuthClient.exchangeCodeForIdToken(code, googleClientId, googleClientSecret, 'https://index-it.app/login/callback')
      return Response.json({ id_token: idToken })
    } catch(e) {
      console.error(e)
      return new Response('Something went wrong', {
        status: 500
      })
    }
  } else {
    return new Response('Missing code query parameter', {
      status: 400
    })
  }
}