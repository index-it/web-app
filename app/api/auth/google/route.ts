import { GoogleOAuthClient } from '@/lib/services/GoogleOAuthClient'
import type { NextApiRequest, NextApiResponse } from 'next'
 
export type GoogleOAuthCodeExchangeApiResponse = {
  id_token: string
}
 
export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<GoogleOAuthCodeExchangeApiResponse>
) {
  console.info(`request query ${req.query}`)
  const code = req.query.code

  if (code !== undefined) {
     const googleOAuthClient = new GoogleOAuthClient()
     const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

     if (googleClientId === undefined) {
      console.error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID env variable')
      return res.status(500)
     }

     const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
     if (googleClientSecret === undefined) {
      console.error('Missing GOOGLE_CLIENT_SECRET env variable')
      return res.status(500)
     }

     try {
      const idToken = await googleOAuthClient.exchangeCodeForIdToken(code.toString(), googleClientId, googleClientSecret, 'https://index-it.app/login/callback')

      res.status(200).json({ id_token: idToken })
    } catch(e) {
      console.error(e)
      res.status(500)
    }
  } else {
    res.status(400)
  }
}