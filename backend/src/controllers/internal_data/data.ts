import { ProductDOT, ProductType, UserDOT } from "../../entities.js";

type UserInternal = UserDOT & {
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
export const products: ProductDOT[] = [{
    id: "hahahehe",
    name: "test product",
    description: "isang product",
    ownerId: "adsasdfasdf",
    type: ProductType.CROP,
    quantity: 100,
    unitPrice: 1000
}];
