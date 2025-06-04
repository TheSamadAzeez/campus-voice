import { Sidebar } from '@/components/custom/sidebar'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex-1 rounded-l-[3rem] bg-[#f1f5f9] p-10">{children}</div>
    </div>
  )
}
