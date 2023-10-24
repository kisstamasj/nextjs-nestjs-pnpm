import {sayHello} from '@common'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {sayHello('Tomikaaaaaaa')}
    </main>
  )
}
