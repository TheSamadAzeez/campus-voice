import { Header } from '@/components/custom/header'
import { Sidebar } from '@/components/custom/sidebar'

export default function layout({ children }: { children: React.ReactNode }) {
  interface UserData {
    name: string
    email: string
    avatar: string
    role: 'student' | 'admin'
  }

  const userData: UserData = {
    name: 'Azeez Samad',
    email: 'azeezsamad2004@gmail.com',
    avatar: '',
    role: 'admin',
  }
  return (
    <div className="flex h-screen w-screen">
      <Sidebar admin />
      <div className="flex flex-1 flex-col gap-4 rounded-l-[3rem] bg-[#f1f5f9] p-10">
        <Header userData={userData} />
        {children}
      </div>
    </div>
  )
}
