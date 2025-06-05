export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-orange-500/20 text-orange-500'
    case 'resolved':
      return 'bg-blue-500/20 text-blue-500'
    case 'in-review':
      return 'bg-purple-500/20 text-purple-500'
  }
}
