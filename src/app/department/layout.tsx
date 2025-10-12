import { Header } from '@/components/custom/header'
import { Sidebar } from '@/components/custom/sidebar'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="">
      <div className="container mx-auto flex h-screen max-w-450">
        <Sidebar departmentAdmin />
        <div className="flex flex-1 flex-col gap-4 rounded-l-[3rem] bg-[#f1f5f9] p-10">
          <Header />
          {children}
        </div>
      </div>
    </main>
  )
}
