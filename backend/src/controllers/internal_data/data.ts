import { ProductDOT } from "../../entities/product.js";
import { UserDOT } from "../../entities/user.js";

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
export const products: ProductDOT[] = [];
