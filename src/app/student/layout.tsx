import { Sidebar } from '@/components/custom/sidebar'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      {children}
    </div>
  )
}
