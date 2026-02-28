'use client'

import { useState, useMemo } from 'react'
import { calculateFinance } from '@/lib/utils/finance'
import { FINANCE_DEFAULTS } from '@/config/constants'

export function useFinanceCalculator(vehiclePrice: number) {
  const [deposit, setDeposit] = useState(FINANCE_DEFAULTS.depositPercent)
  const [rate, setRate] = useState(FINANCE_DEFAULTS.interestRate)
  const [term, setTerm] = useState(FINANCE_DEFAULTS.termMonths)
  const [balloon, setBalloon] = useState(FINANCE_DEFAULTS.balloonPercent)

  const result = useMemo(
    () => calculateFinance(vehiclePrice, deposit, rate, term, balloon),
    [vehiclePrice, deposit, rate, term, balloon]
  )

  return {
    result,
    deposit, setDeposit,
    rate, setRate,
    term, setTerm,
    balloon, setBalloon,
  }
}
