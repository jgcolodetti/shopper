import { connection } from "./DatabaseConnection";
import { Product } from "../products";
import Order from "../model/Order";
import { TABLE_PRODUCTS } from "../tables/tables";

export const getProducts = async () => {
    const result = await connection(TABLE_PRODUCTS)
        .select("*")
        // .from("shopper_products")

    return result
}

export const getProductByName = async (name: string) => {
    const result = await connection(TABLE_PRODUCTS)
        .select('*')
        .whereLike('name', `%${name.toUpperCase()}%`)
        .orderBy('name')

    return result
}

export const updateProductQuantity = async (order: Order, transaction: any) => {
    const products = order.getProducts()

    for (let i = 0; i < products.length; i++) {
        await connection(TABLE_PRODUCTS)
            .where({ product_id: products[i].product_id })
            .update({ qnty_stock: products[i].qnty_stock - products[i].qnty })
            .transacting(transaction)
    }
}

export const getProductQuantity = async (order: Order, transaction: any) => {
    const products = order.getProducts()
    let response = []

    for (let i = 0; i < products.length; i++) {
        const result = await connection(TABLE_PRODUCTS)
            .select('product_id', 'qnty_stock')
            .where({ product_id: products[i].product_id })

        response.push(result)
    }
    return response
}