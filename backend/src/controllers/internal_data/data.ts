import { Product, User } from "../../entities.js";

interface UserInternal extends User {
    password: string
}

export const users: UserInternal[] = [{
    id: "test-acc",
    firstName: "Lorem",
    lastName: "Ipsum",
    email: "test@example.com",
    password: "test-pass",
    isMerchant: true
}]

export const userTokens: {
    userId: string,
    token: string,
}[] = []
export const products: Product[] = [];
