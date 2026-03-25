import { useEffect, useMemo, useState } from 'react'
import { CheckoutContext } from './checkoutContextValue'
import { STORAGE_KEYS } from '../utils/constants'

function readStoredCheckout() {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.checkout)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function CheckoutProvider({ children }) {
  const [checkout, setCheckout] = useState(() => readStoredCheckout())

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (checkout) {
      window.localStorage.setItem(STORAGE_KEYS.checkout, JSON.stringify(checkout))
      return
    }
    window.localStorage.removeItem(STORAGE_KEYS.checkout)
  }, [checkout])

  const value = useMemo(
    () => ({
      checkout,
      setCheckout,
      clearCheckout() {
        setCheckout(null)
      },
    }),
    [checkout],
  )

  return (
    <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
  )
}
