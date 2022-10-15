import Order from "../model/Order"
import { BaseDatabase } from "./BaseDatabase"

export class OrderDatabase extends BaseDatabase {
    public static TABLE_ORDERS = "shopper_orders"
    public static TABLE_ORDERS_ITEMS = "shopper_order_items"

    public async insertOrder(order: Order, transaction: any) {
        await this.getConnection().insert({
            order_id: order.getOrderId(),
            client_name: order.getName(),
            delivery_date: order.getDate()
        }).into(OrderDatabase.TABLE_ORDERS)
        .transacting(transaction)
    }

    public async insertOrderProduct(order: Order, transaction: any) {
        const products = order.getProducts()
        for (let i = 0; i < products.length; i++) {
            await this.getConnection().insert({
                product_id: products[i].product_id,
                quantidade: products[i].qnty,
                order_id: order.getOrderId()
            }).into(OrderDatabase.TABLE_ORDERS_ITEMS)
            .transacting(transaction)
        }

    }

    public async beginTransaction() {
        return await this.getConnection().transaction()
    }

}