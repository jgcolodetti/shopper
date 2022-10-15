import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import OrderForm from '../components/OrderForm'

export default function Order() {
  const [todayDate, setTodayDate] = useState('')

  useEffect(() => {
    const [day, month, year] = new Date().toLocaleDateString().split('/')
    setTodayDate(year + '-' + month + '-' + day)
  }, [])

  return (
    <>
      <Header onOrder={true} />
      <OrderForm todayDate={todayDate} />
    </>
  )
}
