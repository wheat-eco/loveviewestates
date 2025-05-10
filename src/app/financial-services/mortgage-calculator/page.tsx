"use client"

import { useState } from "react"
import styles from "./mortgage-calculator.module.css"

export default function MortgageCalculatorPage() {
  const [propertyValue, setPropertyValue] = useState(200000)
  const [deposit, setDeposit] = useState(40000)
  const [interestRate, setInterestRate] = useState(3.5)
  const [term, setTerm] = useState(25)

  // Calculate loan amount
  const loanAmount = propertyValue - deposit

  // Calculate monthly payment
  const monthlyInterestRate = interestRate / 100 / 12
  const numberOfPayments = term * 12
  const monthlyPayment =
    (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)

  // Calculate total payment
  const totalPayment = monthlyPayment * numberOfPayments

  // Calculate total interest
  const totalInterest = totalPayment - loanAmount

  return (
    <div className={styles.calculatorContainer}>
      <div className={styles.calculatorContent}>
        <h1 className={styles.calculatorHeading}>Mortgage Calculator</h1>
        <p className={styles.calculatorIntro}>
          Use our mortgage calculator to estimate your monthly mortgage payments. Adjust the sliders to see how
          different property values, deposits, interest rates, and terms affect your payments.
        </p>

        <div className={styles.calculatorGrid}>
          <div className={styles.calculatorInputs}>
            <div className={styles.inputGroup}>
              <label htmlFor="propertyValue">Property Value: £{propertyValue.toLocaleString()}</label>
              <input
                type="range"
                id="propertyValue"
                min="50000"
                max="1000000"
                step="5000"
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className={styles.rangeInput}
              />
              <div className={styles.rangeLabels}>
                <span>£50,000</span>
                <span>£1,000,000</span>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="deposit">Deposit: £{deposit.toLocaleString()}</label>
              <input
                type="range"
                id="deposit"
                min="0"
                max={propertyValue * 0.5}
                step="5000"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className={styles.rangeInput}
              />
              <div className={styles.rangeLabels}>
                <span>£0</span>
                <span>£{(propertyValue * 0.5).toLocaleString()}</span>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="interestRate">Interest Rate: {interestRate}%</label>
              <input
                type="range"
                id="interestRate"
                min="0.5"
                max="10"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className={styles.rangeInput}
              />
              <div className={styles.rangeLabels}>
                <span>0.5%</span>
                <span>10%</span>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="term">Mortgage Term: {term} years</label>
              <input
                type="range"
                id="term"
                min="5"
                max="35"
                step="1"
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                className={styles.rangeInput}
              />
              <div className={styles.rangeLabels}>
                <span>5 years</span>
                <span>35 years</span>
              </div>
            </div>
          </div>

          <div className={styles.calculatorResults}>
            <div className={styles.resultCard}>
              <h3>Monthly Payment</h3>
              <p className={styles.resultValue}>£{isNaN(monthlyPayment) ? "0" : monthlyPayment.toFixed(2)}</p>
            </div>

            <div className={styles.resultDetails}>
              <div className={styles.resultItem}>
                <span>Loan Amount:</span>
                <span>£{loanAmount.toLocaleString()}</span>
              </div>
              <div className={styles.resultItem}>
                <span>Total Interest:</span>
                <span>£{isNaN(totalInterest) ? "0" : totalInterest.toFixed(2)}</span>
              </div>
              <div className={styles.resultItem}>
                <span>Total Payment:</span>
                <span>£{isNaN(totalPayment) ? "0" : totalPayment.toFixed(2)}</span>
              </div>
              <div className={styles.resultItem}>
                <span>Loan to Value:</span>
                <span>{((loanAmount / propertyValue) * 100).toFixed(1)}%</span>
              </div>
            </div>

            <div className={styles.disclaimer}>
              <p>
                This calculator provides an estimate only. Contact our financial advisors for a personalized mortgage
                assessment.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <h2>Ready to take the next step?</h2>
          <p>
            Our partners at Financial Services Scotland can help you find the best mortgage deal for your circumstances.
            Get in touch today for expert advice.
          </p>
          <div className={styles.ctaButtons}>
            <a href="tel:01294539267" className={styles.primaryButton}>
              Call Now: 01294 539267
            </a>
            <a href="mailto:info@fsscotlandltd.co.uk" className={styles.secondaryButton}>
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
