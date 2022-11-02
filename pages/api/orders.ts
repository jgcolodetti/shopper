import type { NextApiRequest, NextApiResponse } from 'next'
import { beginTransaction } from './database/DatabaseConnection'
import { insertOrder, insertOrderProduct } from './database/OrderDatabase'
import { getProductQuantity, updateProductQuantity } from './database/ProductDatabase'
import Order from './model/Order'

type Data = {
    message: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {

    let transaction = undefined

    try {
        if (req.method !== 'POST') {
            res.status(400).json({ message: 'Only Post requests are allowed.' })
            return
        }

        const { client_name, delivery_date, products } = req.body

        if (!client_name || !delivery_date || !products) {
            res.status(400).json({ message: 'Campos incompletos.' })
            return
        }

        const order = new Order(client_name, delivery_date, products)
        transaction = await beginTransaction()

        if (!areProductsAvailable(order, transaction, products)) {
            throw new Error('Estoque insuficiente.')
        }

        const order_id = await insertOrder(order, transaction)
        await insertOrderProduct(order_id, order, transaction)
        await updateProductQuantity(order, transaction)
        await transaction.commit()

        res.status(201).json({ message: 'Pedido realizado com sucesso.' })
    } catch (err: any) {
        transaction?.rollback()
        res.status(500).send(err)
    }
}

async function areProductsAvailable(order: Order, transaction: any, products: any) {
    const productsQntyStock = await getProductQuantity(order, transaction)

    const unavailableProducts = productsQntyStock.filter((item: any) => {
        const orderSize = products.filter((product: any) => {
            return item[0].product_id === product.product_id
        })[0].qnty
        return Number(orderSize) > item[0].qnty_stock
    })

    return unavailableProducts.length == 0;
}
