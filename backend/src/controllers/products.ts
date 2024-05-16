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

    if(typeof(id) !== 'string' || typeof(name) !== 'string' || typeof(description) !== 'string' || typeof(quantity) !== 'number' || typeof(unitPrice) !== 'number' || typeof(ownerId) !== 'string'){

        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "malformed request",
            status: 400,
            message: "id, name, description must be strings and  quantity, unitPrice must be numbers",
        });
    }
    
    if(type !== ProductType.CROP && type !== ProductType.POULTRY) {
        res.status(400).send({
            type: "urn:100-project:error:malformed",
            title: "malformed request",
            status: 400,
            message: "type should be at least 1 or 2"
            
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

export function getProduct(req: Request, res: Response) {
    let id: string = req.params.id; // route /:id

    const foundProduct: ProductDOT | undefined = products.find((p) => p.id == id);

    if(foundProduct === undefined) {
        res.send({
            type:"urn:100-project:error:not-found",
            title: "Product Not Found",
            status: 404,
            message: "Product does not exist"
        });
        return;
    }

    res.send({
        id: foundProduct.id,
        name: foundProduct.name,
        description: foundProduct.description,
        ownerId: foundProduct.ownerId,
        type: foundProduct.type,
        quantity: foundProduct.quantity,
        unitPrice: foundProduct.unitPrice,
    })
}

export function updateProduct(req: Request, res: Response) {
    const id = req.params.id;

    const product: ProductDOT | undefined = products.find((p) => p.id === id);

    if(product === undefined) {
        res.status(404).send({
            type: "urn:100-project:error:not-found",
            title: "Product Not Found",
            status: 404,
            message: "Product does not exist"
        });
        return;
    }

    const name: string = req.body.name;
    const description: string = req.body.description;
    const type: ProductType = req.body.type;
    const quantity: number = req.body.quantity;
    const unitPrice: number = req.body.unitPrice;
    const ownerId: string | undefined = req.body.ownerId;

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.type = type ?? product.type;
    product.quantity = quantity ?? product.quantity;
    product.unitPrice = unitPrice ?? product.unitPrice;
    product.ownerId = ownerId ?? product.ownerId;

    res.status(200).send(product);
}

export function getProducts(req: Request, res: Response) {
    let ret: ProductDOT[] = products.map((p) => {
        return{
            id: p.id,
            name: p.name,
            description: p.description,
            ownderId: p.ownerId,
            type: p.type,
            quantity: p.quantity,
            unitPrice: p.unitPrice
        }
    })

    res.send(ret);
}