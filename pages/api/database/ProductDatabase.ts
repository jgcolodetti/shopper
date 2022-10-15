import { BaseDatabase } from "./BaseDatabase";
import { Product } from "../products";
import Order from "../model/Order";

export class ProductDatabase extends BaseDatabase {
    public static TABLE_PRODUCTS = "shopper_products"

    public async getProducts() {
        const result = await this.getConnection()
            .select("*")
            // .limit(9)
            .from(ProductDatabase.TABLE_PRODUCTS)

        return result
    }

    public async getProductByName(name: string) {
        const result = await this.getConnection()
            .select('*')
            .whereLike('name', `%${name.toUpperCase()}%`)
            // .where('name', name)
            .from(ProductDatabase.TABLE_PRODUCTS)

        return result
    }

    public async updateProductQuantity(order: Order, transaction: any) {
        const products = order.getProducts()

        for (let i = 0; i < products.length; i++) {
            await this.getConnection()
                .where({ product_id: products[i].product_id })
                .update({ qnty_stock: products[i].qnty_stock - products[i].qnty })
                .from(ProductDatabase.TABLE_PRODUCTS)
                .transacting(transaction)
        }
    }

    public async getProductQuantity(order: Order, transaction: any) {
        const products = order.getProducts()
        let response = []

        for (let i = 0; i < products.length; i++) {
            const result = await this.getConnection()
                .select( 'product_id', 'qnty_stock')
                .where({ product_id: products[i].product_id })
                .from(ProductDatabase.TABLE_PRODUCTS)
            response.push(result)
        }
        return response
    }

}