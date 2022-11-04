import { insertOrder, insertOrderProduct } from "../pages/api/database/OrderDatabase"
import { beginTransaction, connection } from "../pages/api/database/DatabaseConnection"
import handler, { areProductsAvailable } from "../pages/api/orders"
import { describe, expect, test } from '@jest/globals'
import { getProductQuantity, updateProductQuantity } from "../pages/api/database/ProductDatabase"

const transactionCommitMock = jest.fn()
const transactionRollbackMock = jest.fn()


jest.mock("../pages/api/database/DatabaseConnection", () => {
    return {
        beginTransaction: jest.fn(() => { return { commit: transactionCommitMock, rollback: transactionRollbackMock } }),
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
        getProducts: jest.fn(),
    }
})

afterEach(() => {
    jest.clearAllMocks()
})


describe("Testing orders endpoint", () => {
    test("No transaction if GET req method", async () => {
        const req = {
            method: "GET"
        }

        const res = {
            status: jest.fn((x) => { return { json: jest.fn(), send: jest.fn() } }),
        }

        await handler(req as any, res as any)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(beginTransaction).not.toHaveBeenCalled()
    })

    test("No transaction if PUT req method", async () => {
        const req = {
            method: "PUT"
        }

        const res = {
            status: jest.fn((x) => { return { json: jest.fn(), send: jest.fn() } }),
        }

        await handler(req as any, res as any)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(beginTransaction).not.toHaveBeenCalled()
    })

    test("No transaction if DELETE req method", async () => {
        const req = {
            method: "DELETE"
        }

        const res = {
            status: jest.fn((x) => { return { json: jest.fn(), send: jest.fn() } }),
        }

        await handler(req as any, res as any)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(beginTransaction).not.toHaveBeenCalled()
    })

    test("No transaction if client_name undefined", async () => {
        const body = {
            client_name: undefined,
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

        expect(res.status).toHaveBeenCalledWith(400)
        expect(beginTransaction).not.toHaveBeenCalled()
        expect(getProductQuantity).not.toHaveBeenCalled()
        expect(insertOrder).not.toHaveBeenCalled()
        expect(insertOrderProduct).not.toHaveBeenCalled()
        expect(updateProductQuantity).not.toHaveBeenCalled()

    })

    test("No transaction if delivery_date undefined", async () => {
        const body = {
            client_name: "teste",
            delivery_date: undefined,
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

        expect(res.status).toHaveBeenCalledWith(400)
        expect(beginTransaction).not.toHaveBeenCalled()
        expect(getProductQuantity).not.toHaveBeenCalled()
        expect(insertOrder).not.toHaveBeenCalled()
        expect(insertOrderProduct).not.toHaveBeenCalled()
        expect(updateProductQuantity).not.toHaveBeenCalled()
    })

    test("No transaction if products undefined", async () => {
        const body = {
            client_name: "teste",
            delivery_date: "1111-11-11",
            products: undefined
        }

        const req = {
            method: "POST",
            body
        }

        const res = {
            status: jest.fn((x) => { return { json: jest.fn(), send: jest.fn() } }),
        }

        await handler(req as any, res as any)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(beginTransaction).not.toHaveBeenCalled()
        expect(getProductQuantity).not.toHaveBeenCalled()
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

        expect(beginTransaction).toHaveBeenCalledTimes(1)
        expect(getProductQuantity).toHaveBeenCalledTimes(1)
        expect(insertOrder).toHaveBeenCalledTimes(1)
        expect(insertOrderProduct).toHaveBeenCalledTimes(1)
        expect(updateProductQuantity).toHaveBeenCalledTimes(1)
        expect(transactionCommitMock).toHaveBeenCalledTimes(1)
        expect(transactionRollbackMock).not.toHaveBeenCalled()
    })

    test("No transaction if products are unavailable", async () => {
       (getProductQuantity as jest.Mock).mockImplementation((order, transaction) => { return [[{ product_id: order.products[0].product_id, qnty_stock: 0}]] })

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

        expect(beginTransaction).toHaveBeenCalledTimes(1)
        expect(getProductQuantity).toHaveBeenCalledTimes(1)
        expect(insertOrder).not.toHaveBeenCalled()
        expect(insertOrderProduct).not.toHaveBeenCalled()
        expect(updateProductQuantity).not.toHaveBeenCalled()
        expect(transactionCommitMock).not.toHaveBeenCalled()
        expect(transactionRollbackMock).toHaveBeenCalledTimes(1)
    })
})