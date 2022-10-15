// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { OrderDatabase } from './database/OrderDatabase'
import { ProductDatabase } from './database/ProductDatabase'
import Order from './model/Order'
import GenerateId from './services/GenerateId'
import { knex } from 'knex'
import { BaseDatabase } from './database/BaseDatabase'


type Data = {
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const order_id = new GenerateId().createId()
    const orderDB = new OrderDatabase()
    const productDB = new ProductDatabase()
    const transaction = await orderDB.beginTransaction()

    try {
        if (req.method === 'POST') {
            const { client_name, delivery_date, products } = req.body

            if (!client_name || !delivery_date || !products) {
                throw new Error('Campos incompletos')
            }
            const order = new Order(order_id, client_name, delivery_date, products)
            const productsQntyStock = await productDB.getProductQuantity(order, transaction)
            // console.log(products[0].qnty)
            
            const unavaibleProducts = productsQntyStock.filter((item: any) => {
                const orderSize = products.filter((product: any) => {
                    // console.log(product.product_id, item[0].product_id)
                    return item[0].product_id === product.product_id

                })[0].qnty
                console.log(Number(orderSize), item[0].qnty_stock)
                console.log(Number(orderSize) > item[0].qnty_stock)
                return Number(orderSize) > item[0].qnty_stock
            })

            console.log(unavaibleProducts)
            if (unavaibleProducts.length > 0) {
                throw new Error('Estoque insuficiente')
            }

            await orderDB.insertOrder(order, transaction)
            await orderDB.insertOrderProduct(order, transaction)
            // throw new Error('stop')
            await productDB.updateProductQuantity(order, transaction)
            await transaction.commit()

            res.status(201).json({ message: 'Pedido realizado com sucesso.' })
        } else {
            res.status(400).json({ message: 'Only Post requests are allowed.' })
        }

    } catch (err: any) {
        await transaction.rollback()
        throw (err)
        res.status(500).send(err)
    }
}
