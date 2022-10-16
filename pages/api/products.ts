import type { NextApiRequest, NextApiResponse } from 'next'
import { ProductDatabase } from './database/ProductDatabase'

export type Product = {
  product_id: number,
  name: string,
  price: number,
  qnty_stock: number,
  qnty: number,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const name = req.query.name as string
    
    if (!name || name.trim() === '') {
      const productDB = await new ProductDatabase().getProducts()
      res.status(200).json({ products: productDB })
    } else {
      const productDB = await new ProductDatabase().getProductByName(name)
      res.status(200).json({ products: productDB })
    }

  } catch (err: any) {
    res.status(500).send({ message: err.message })
  }
}
