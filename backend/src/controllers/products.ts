import {Product, ProductDOT, ProductType, User} from '../entities.js';
import {products} from './internal_data/data.js';

import {Request, Response} from 'express';

export function addProduct(req: Request, res: Response) {

    const id: string = req.body.id;
    const name: string = req.body.name;
    const description: string = req.body.description;
    const ownerId: string | undefined = req.body.ownerId;
    const type: ProductType = req.body.type;
    const quantity: number = req.body.quantity;
    const unitPrice: number = req.body.unitPrice;

    // const type: ProductType = req.body.type;
    // const quantity: number = req.body.quantity;
    // const unitPrice: number = req.body.unitPrice;
    // const owner: User = req.body.owner;

    products.push({
        id: id,
        name: name,
        description: description,
        ownerId: ownerId,
        type: type,
        quantity: quantity,
        unitPrice: unitPrice
    });
}