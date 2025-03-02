import { cookies } from 'next/headers'

import { Chat } from '@/components/chat'
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models'
import { generateUUID } from '@/lib/utils'
import { DataStreamHandler } from '@/components/data-stream-handler'
import { auth } from '../(auth)/auth'

export default async function Page() {
  const id = generateUUID()

  const [session, cookieStore] = await Promise.all([auth(), cookies()])
  const modelIdFromCookie = cookieStore.get('chat-model')
  const userName = session?.user?.email ?? undefined
  console.log(session)

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat
          key={id}
          id={id}
          initialMessages={[]}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          selectedVisibilityType="private"
          isReadonly={false}
        />
        <DataStreamHandler id={id} />
      </>
    )
  }

  return (
    <>
      <Chat
        key={id}
        id={id}
        userName={userName}
        initialMessages={[]}
        selectedChatModel={modelIdFromCookie.value}
        selectedVisibilityType="private"
        isReadonly={false}
      />
      <DataStreamHandler id={id} />
    </>
  )
}
