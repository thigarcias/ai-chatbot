import { redirect } from 'next/navigation'
import { auth } from '@/app/(auth)/auth'
import { ProfileEditor } from '@/components/ProfilePicture'

export default async function ProfilePage() {
const session = await auth()
  
  if (!session?.user) {
    redirect('/signin')
  }

  return <ProfileEditor user={session.user} />
}

