import { Product } from "../products"

class Order {
    constructor(
        private order_id: string,
        private client_name:string,
        private delivery_date: string,
        private products: Product[]
    ){}

    public getOrderId(){
        return this.order_id
    }
    
    public getName(){
        return this.client_name
    }

    public getDate(){
        return this.delivery_date
    }

    public getProducts(){
        return this.products
    }
}

export default Order