import Order from "../model/Order"
import { TABLE_ORDERS, TABLE_ORDERS_ITEMS } from "../tables/tables"
import { connection } from "./DatabaseConnection"

export const insertOrder = async (order: Order, transaction: any) => {
    const order_id = await connection(TABLE_ORDERS).insert({
        client_name: order.getName(),
        delivery_date: order.getDate()
    }).returning('order_id')
        .transacting(transaction)

    return order_id[0] as number
}

export const insertOrderProduct = async (order_id: number, order: Order, transaction: any) => {
    const products = order.getProducts()
    for (let i = 0; i < products.length; i++) {
        await connection(TABLE_ORDERS_ITEMS).insert({
            product_id: products[i].product_id,
            quantidade: products[i].qnty,
            order_id: order_id,
        })
            .transacting(transaction)
    }
}
