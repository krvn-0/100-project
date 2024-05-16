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
},
{
    id: "id2",
    name: "product 2",
    description: "pangalawa",
    ownerId: "ppppp",
    type: ProductType.POULTRY,
    quantity: 99,
    unitPrice: 9999,
}];
