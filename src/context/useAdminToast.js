import { useContext } from 'react'
import { AdminToastContext } from './AdminToastContext'

export function useAdminToast() {
  const context = useContext(AdminToastContext)

  if (!context) {
    throw new Error('useAdminToast harus dipakai di dalam AdminToastProvider.')
  }

  return context
}
