import { FINANCE_DEFAULTS } from '@/config/constants'

export interface FinanceCalculation {
  vehiclePrice: number
  deposit: number
  financeAmount: number
  monthlyInstalment: number
  totalRepayment: number
  totalInterest: number
  interestRate: number
  termMonths: number
  balloonAmount: number
}

/**
 * Calculate monthly vehicle finance instalment (SA market)
 */
export function calculateFinance(
  price: number,
  depositPercent: number = FINANCE_DEFAULTS.depositPercent,
  interestRate: number = FINANCE_DEFAULTS.interestRate,
  termMonths: number = FINANCE_DEFAULTS.termMonths,
  balloonPercent: number = FINANCE_DEFAULTS.balloonPercent,
): FinanceCalculation {
  const deposit = price * (depositPercent / 100)
  const financeAmount = price - deposit + FINANCE_DEFAULTS.initiationFee
  const balloonAmount = price * (balloonPercent / 100)
  const monthlyRate = interestRate / 100 / 12
  const adjustedFinance = financeAmount - (balloonAmount / Math.pow(1 + monthlyRate, termMonths))

  let monthlyInstalment: number
  if (monthlyRate === 0) {
    monthlyInstalment = adjustedFinance / termMonths
  } else {
    monthlyInstalment =
      (adjustedFinance * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1)
  }

  monthlyInstalment += FINANCE_DEFAULTS.monthlyServiceFee
  const totalRepayment = monthlyInstalment * termMonths + deposit + balloonAmount
  const totalInterest = totalRepayment - price

  return {
    vehiclePrice: price,
    deposit,
    financeAmount,
    monthlyInstalment: Math.round(monthlyInstalment),
    totalRepayment: Math.round(totalRepayment),
    totalInterest: Math.round(totalInterest),
    interestRate,
    termMonths,
    balloonAmount,
  }
}
