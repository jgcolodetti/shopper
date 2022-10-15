import Order from "../model/Order"
import { BaseDatabase } from "./BaseDatabase"

export class OrderDatabase extends BaseDatabase {
    public static TABLE_ORDERS = "shopper_orders"
    public static TABLE_ORDERS_ITEMS = "shopper_order_items"


    public async insertOrder(order: Order, transaction: any) {
        const order_id = await this.getConnection().insert({
            client_name: order.getName(),
            delivery_date: order.getDate()
        }).returning('order_id')
        .into(OrderDatabase.TABLE_ORDERS)
        .transacting(transaction)

        return order_id[0] as number
    }

    public async insertOrderProduct(order_id: number, order: Order, transaction: any) {
        const products = order.getProducts()
        for (let i = 0; i < products.length; i++) {
            await this.getConnection().insert({
                product_id: products[i].product_id,
                quantidade: products[i].qnty,
                order_id: order_id,
            }).into(OrderDatabase.TABLE_ORDERS_ITEMS)
            .transacting(transaction)
        }
    }

}