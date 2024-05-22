import {Product, ProductDOT, ProductType, User} from '../../entities.js';
import {products} from './data.js';

import {Request, Response} from 'express';

export function createProduct(req: Request, res: Response) {

    const id: string = req.body.id;
    const name: string = req.body.name;
    const description: string = req.body.description;
    const ownerId: string | undefined = req.body.ownerId;
    const type: ProductType = req.body.type;
    const quantity: number = req.body.quantity;
    const unitPrice: number = req.body.unitPrice;

    if(typeof(id) !== 'string' || typeof(name) !== 'string' || typeof(description) !== 'string' || typeof(quantity) !== 'number' || typeof(unitPrice) !== 'number' || typeof(ownerId) !== 'string'){

        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed request",
            status: 400,
            message: "Id, name, description must be strings and  quantity, unitPrice must be numbers",
        });
    }
    
    if(type !== ProductType.CROP && type !== ProductType.POULTRY) {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "Malformed request",
            status: 400,
            message: "Type should be at least 1 or 2"
            
        })
    }

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
