import { Header } from '@/components/custom/header'
import { Sidebar } from '@/components/custom/sidebar'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar admin />
      <div className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto rounded-t-2xl bg-[#f1f5f9] p-4 pb-20 md:rounded-l-[3rem] md:rounded-tr-none md:p-10 md:pb-10">
        <Header />
        {children}
      </div>
    </div>
  )
}
