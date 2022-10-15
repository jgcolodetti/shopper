import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Store from '../components/Store'
export default function Home() {

  const [products, setProducts] = useState([])

  useEffect(() => {
      axios.get('/api/products')
        .then((res) => {
          setProducts(res.data.products.filter((product) => { return product.qnty_stock > 0}))
        })
  })

  return (
    <>
      <Header onHome={true}/>
      {/* <h1>{nome}</h1> */}
      <Store products={products}/>
    </>
  )
}
