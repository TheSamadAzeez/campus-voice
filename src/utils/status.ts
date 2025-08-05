// for status badge
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

// for status update
export const getStatusUpdateColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-orange-500'
    case 'resolved':
      return 'bg-blue-500'
    case 'in-review':
      return 'bg-purple-500'
  }
}

// for priority badge
export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low':
      return 'bg-green-500/20 text-green-500'
    case 'normal':
      return 'bg-blue-500/20 text-blue-500'
    case 'high':
      return 'bg-red-500/20 text-red-500'
  }
}
