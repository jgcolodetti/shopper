import Order from "../pages/api/model/Order"
import { Product } from "../pages/api/products"
import { insertOrder } from "../pages/api/database/OrderDatabase"
import handler from "../pages/api/orders"
import { NextApiRequest } from "next"

// const insertOrderMock = jest.fn()
// const beginTransactionMock = jest.fn()
// const insertOrderProductMock = jest.fn()

// jest.mock("../pages/api/database/OrderDatabase")

// const orderDatabaseMock = OrderDatabase as unknown as jest.Mock
// orderDatabaseMock.mockImplementation(() => {
//     return {
//         insertOrder: insertOrderMock,
//         beginTransaction: beginTransactionMock,
//         insertOrderProduct: insertOrderProductMock,
//     }
// })

// beforeEach(() => {
//     // Clear all instances and calls to constructor and all methods:
//     orderDatabaseMock.mockClear()
//     insertOrderMock.mockClear()
//     beginTransactionMock.mockClear()
//     insertOrderProductMock.mockClear()
// })

// describe("Testando a OrderDatabase", () => {
//     const req = {
//         method: "GET",
//     }

//     const res = {
//         status: jest.fn((x) => { return { json: jest.fn() } }),
//     }

//     test("Expect no database insertions in case of GET request", async () => {
//         console.log('teste')

//         const oi: any = res
//         oi.status(400).json({ message: 'Only Post requests are allowed.' })
//         await handler(req as any, res as any)


//         expect(OrderDatabase).toHaveBeenCalled()
//         expect(beginTransactionMock).toHaveBeenCalled()
//         expect(insertOrderMock).not.toHaveBeenCalled()
//         expect(insertOrderProductMock).not.toHaveBeenCalled()
//     })
// })

describe("Testando inputs do order", () => {

    test("Todos os campos devem ser preenchidos no order", async () => {
        const body: any = {
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
        const req: any = {
            method: "POST",
            body
        }

        const res = {
            status: jest.fn((x) => { return { json: jest.fn() } }),
        }

        await handler(req as any, res as any)

        expect(insertOrder).toHaveBeenCalledTimes(1)
    })
})