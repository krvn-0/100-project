import { Types } from "mongoose"
import { Product } from "./product.js"

export type CartItem = {
    product: Product,
    quantity: number
}

export type CartItemDao = {
    productId: Types.ObjectId,
    quantity: number
}

