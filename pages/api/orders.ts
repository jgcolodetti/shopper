import type { NextApiRequest, NextApiResponse } from 'next'
import { OrderDatabase } from './database/OrderDatabase'
import { ProductDatabase } from './database/ProductDatabase'
import Order from './model/Order'

type Data = {
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const orderDB = new OrderDatabase()
    const productDB = new ProductDatabase()
    const transaction = await orderDB.beginTransaction()

    try {
        if (req.method !== 'POST') {
            res.status(400).json({ message: 'Only Post requests are allowed.' })
            return
        }

        const { client_name, delivery_date, products } = req.body
        const order = new Order(client_name, delivery_date, products)

        if (!client_name || !delivery_date || !products) {
            res.status(400).json({ message: 'Campos incompletos'})
            return
        }
 
        if (!areProductsAvailable(order, transaction, products, productDB)) {
            throw new Error('Estoque insuficiente.')
        }

        const order_id = await orderDB.insertOrder(order, transaction)
        await orderDB.insertOrderProduct(order_id, order, transaction)
        await productDB.updateProductQuantity(order, transaction)
        await transaction.commit()

        res.status(201).json({ message: 'Pedido realizado com sucesso.' })
    } catch (err: any) {
        await transaction.rollback()
        res.status(500).send(err)
    }
}

async function areProductsAvailable(order: Order, transaction: any, products: any, productDB: ProductDatabase) {
    const productsQntyStock = await productDB.getProductQuantity(order, transaction)

    const unavailableProducts = productsQntyStock.filter((item: any) => {
        const orderSize = products.filter((product: any) => {
            return item[0].product_id === product.product_id
        })[0].qnty
        return Number(orderSize) > item[0].qnty_stock
    })

    return unavailableProducts.length == 0;
}
