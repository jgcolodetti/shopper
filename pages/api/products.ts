// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import internal from 'stream'
import { ProductDatabase } from './database/ProductDatabase'

type Data = {
  products: Array<Product>
}

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
  // <Data>
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
