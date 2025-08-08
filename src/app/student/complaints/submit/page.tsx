import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ComplaintForm } from './components/form'

export default function SubmitComplaintPage() {
  return (
    <Card className="mx-auto w-[70%] border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Submit a Complaint</CardTitle>
        <CardDescription>
          Fill out the form below to submit your complaint. All fields marked with * are required.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        <ComplaintForm />
      </CardContent>
    </Card>
  )
}
