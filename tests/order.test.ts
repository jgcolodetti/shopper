import { insertOrder, insertOrderProduct } from "../pages/api/database/OrderDatabase"
import { beginTransaction, connection } from "../pages/api/database/DatabaseConnection"
import handler, { areProductsAvailable } from "../pages/api/orders"
import { describe, expect, test } from '@jest/globals'
import { FlashAuto } from "@mui/icons-material"
import { getProductQuantity, updateProductQuantity } from "../pages/api/database/ProductDatabase"


jest.mock("../pages/api/database/DatabaseConnection", () => {
    return {
        beginTransaction: jest.fn(() => { return { commit: jest.fn(), rollback: jest.fn() } }),
        connection: jest.fn()
    }
})

jest.mock("../pages/api/database/OrderDatabase", () => {
    return {
        insertOrder: jest.fn(),
        insertOrderProduct: jest.fn()
    }
})

jest.mock("../pages/api/database/ProductDatabase", () => {
    return {
        getProductQuantity: jest.fn((order, transaction) => { return [[{ product_id: order.products[0].product_id, qnty_stock: order.products[0].qnty_stock }]] }),
        updateProductQuantity: jest.fn(),
        getProductByName: jest.fn(),
        getProducts: jest.fn()
    }
})

// jest.mock("../pages/api/orders", () => {
//     return {
//         areProductsAvailable: jest.fn((x) => {return false})
//     }
// })

describe("Testing orders endpoint", () => {
    test("Test GET req method, no transaction", async () => {
        const req = {
            method: "GET"
        }

        const res = {
            status: jest.fn((x) => { return { json: jest.fn(), send: jest.fn() } }),
        }

        await handler(req as any, res as any)

        expect(beginTransaction).not.toHaveBeenCalled()
        // expect(res.status.mockReturnValue).toBe(200)
    })

    test("Test PUT req method, no transaction", async () => {
        const req = {
            method: "PUT"
        }

        const res = {
            status: jest.fn((x) => { return { json: jest.fn(), send: jest.fn() } }),
        }

        await handler(req as any, res as any)

        expect(beginTransaction).not.toHaveBeenCalled()
        // expect(res.status.mockReturnValue).toBe(200)
    })

    test("Test DELETE req method, no transaction", async () => {
        const req = {
            method: "DELETE"
        }

        const res = {
            status: jest.fn((x) => { return { json: jest.fn(), send: jest.fn() } }),
        }

        await handler(req as any, res as any)

        expect(beginTransaction).not.toHaveBeenCalled()
        // expect(res.status.mockReturnValue).toBe(200)
    })

    test("Test product not available", async () => {

        const body = {
            client_name: 'teste',
            delivery_date: '1111-11-11',
            products: [{
                product_id: 1,
                name: 'teste-produto',
                price: 1,
                qnty_stock: 1,
                qnty: 1,
            }]
        }

        const req = {
            method: "POST",
            body
        }

        const res = {
            status: jest.fn((x) => { return { json: jest.fn(), send: jest.fn() } }),
        }

        await handler(req as any, res as any)

        expect(areProductsAvailable).toHaveBeenCalled()
        expect(getProductQuantity).toHaveBeenCalled()
        expect(beginTransaction).not.toHaveBeenCalled()
        expect(insertOrder).not.toHaveBeenCalled()
        expect(insertOrderProduct).not.toHaveBeenCalled()
        expect(updateProductQuantity).not.toHaveBeenCalled()
    })
 
    test("Testing successfull transaction", async () => {
        const body = {
            client_name: 'teste',
            delivery_date: '1111-11-11',
            products: [{
                product_id: 1,
                name: 'teste-produto',
                price: 1,
                qnty_stock: 1,
                qnty: 1,
            }]
        }

        const req = {
            method: "POST",
            body
        }

        const res = {
            status: jest.fn((x) => { return { json: jest.fn(), send: jest.fn() } }),
        }

        await handler(req as any, res as any)

        expect(beginTransaction).toHaveBeenCalled()
        expect(getProductQuantity).toHaveBeenCalled()
        expect(insertOrder).toHaveBeenCalled()
        expect(insertOrderProduct).toHaveBeenCalled()
        expect(updateProductQuantity).toHaveBeenCalled()
        // expect((await beginTransaction()).commit).toHaveReturned()
        // expect((await beginTransaction()).rollback).not.toHaveReturned()

    })


})