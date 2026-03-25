import { useCallback, useMemo, useRef, useState } from 'react'
import { AdminToastContext } from '../../context/AdminToastContext'

function AdminToastItem({ toast, onDismiss }) {
  const toneClasses = {
    success: {
      wrapper: 'border-[#b8efcd] bg-[#f1fff6]',
      badge: 'bg-[#22a85a] text-white',
      title: 'text-[#106c38]',
      message: 'text-[#3a6e4f]',
    },
    error: {
      wrapper: 'border-[#ffd5d1] bg-[#fff5f4]',
      badge: 'bg-[#f06557] text-white',
      title: 'text-[#c53d31]',
      message: 'text-[#8f534d]',
    },
  }

  const tone = toneClasses[toast.tone] ?? toneClasses.success

  return (
    <div
      className={`pointer-events-auto w-full rounded-[22px] border px-4 py-4 shadow-[0_18px_40px_rgba(24,32,56,0.12)] backdrop-blur ${tone.wrapper}`}
    >
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${tone.badge}`}>
          {toast.tone === 'error' ? 'Error' : 'Sukses'}
        </span>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-bold ${tone.title}`}>{toast.title}</p>
          {toast.message ? (
            <p className={`mt-1 text-sm leading-6 ${tone.message}`}>{toast.message}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none text-nara-muted transition hover:bg-white/70 hover:text-nara-ink"
          aria-label="Tutup notifikasi"
        >
          ×
        </button>
      </div>
    </div>
  )
}

function AdminToastViewport({ toasts, onDismiss }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[90] flex w-[min(92vw,360px)] flex-col gap-3 md:right-6 md:top-6">
      {toasts.map((toast) => (
        <AdminToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function AdminToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timeoutIdsRef = useRef(new Map())

  const dismissToast = useCallback((toastId) => {
    const timeoutId = timeoutIdsRef.current.get(toastId)
    if (timeoutId) {
      window.clearTimeout(timeoutId)
      timeoutIdsRef.current.delete(toastId)
    }

    setToasts((current) => current.filter((toast) => toast.id !== toastId))
  }, [])

  const pushToast = useCallback(
    ({ title, message = '', tone = 'success', duration = 3200 }) => {
      const toastId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      setToasts((current) => [...current, { id: toastId, title, message, tone }])

      const timeoutId = window.setTimeout(() => {
        dismissToast(toastId)
      }, duration)

      timeoutIdsRef.current.set(toastId, timeoutId)
      return toastId
    },
    [dismissToast],
  )

  const value = useMemo(
    () => ({
      success(title, message = '') {
        return pushToast({ title, message, tone: 'success' })
      },
      error(title, message = '') {
        return pushToast({ title, message, tone: 'error', duration: 4200 })
      },
      dismissToast,
    }),
    [dismissToast, pushToast],
  )

  return (
    <AdminToastContext.Provider value={value}>
      {children}
      <AdminToastViewport toasts={toasts} onDismiss={dismissToast} />
    </AdminToastContext.Provider>
  )
}

export default AdminToastProvider
