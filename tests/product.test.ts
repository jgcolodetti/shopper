import { getProducts, getProductByName } from "../pages/api/database/ProductDatabase"
import handler from "../pages/api/products"
import { describe, expect, test } from '@jest/globals'

jest.mock("../pages/api/database/ProductDatabase", () => {
    return {
        getProducts: jest.fn(),
        getProductByName: jest.fn(),
    }
})

afterEach(() => {
    jest.clearAllMocks();
})

describe("Testing products endpoint", () => {
    test("No response if POST req method", async () => {
        const req = {
            method: "POST"
        }

        const res = {
            status: jest.fn((x) => { return { json: jest.fn(), send: jest.fn() } }),
        }

        await handler(req as any, res as any)

        expect(getProducts).not.toHaveBeenCalled()
        expect(getProductByName).not.toHaveBeenCalled()

    })

    test("No response if PUT req method", async () => {
        const req = {
            method: "PUT"
        }

        const res = {
            status: jest.fn((x) => { return { json: jest.fn(), send: jest.fn() } }),
        }

        await handler(req as any, res as any)

        expect(getProducts).not.toHaveBeenCalled()
        expect(getProductByName).not.toHaveBeenCalled()

    })

    test("No response if DELETE req method", async () => {
        const req = {
            method: "DELETE"
        }

        const res = {
            status: jest.fn((x) => { return { json: jest.fn(), send: jest.fn() } }),
        }

        await handler(req as any, res as any)

        expect(getProducts).not.toHaveBeenCalled()
        expect(getProductByName).not.toHaveBeenCalled()

    })

    test("Sucessful response if !req.query.name", async () => {
        const req = {
            method: "GET",
            query: {
                name: undefined
            }
        }

        const res = {
            status: jest.fn((x) => { return { json: jest.fn(), send: jest.fn() } }),
        }

        await handler(req as any, res as any)

        expect(getProducts).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(getProductByName).not.toHaveBeenCalled()

    })

    test("Sucessful response if req.query.name", async () => {
        const req = {
            method: "GET",
            query: {
                name: "teste"
            }
        }

        const res = {
            status: jest.fn((x) => { return { json: jest.fn(), send: jest.fn() } }),
        }

        await handler(req as any, res as any)

        expect(getProducts).not.toHaveBeenCalled()
        expect(getProductByName).toHaveBeenCalledWith(req.query.name)
        expect(res.status).toHaveBeenCalledWith(200)

    })
})