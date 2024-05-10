import { Injectable, NotFoundException} from "@nestjs/common";
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
    products: Product[]=[];

    constructor(@InjectModel('Product') private readonly productModel: Model<Product>) {
        
    }

    async insertProduct(title: string, desc: string, price: number) { //inferred that we will return a string
        const newProduct = new this.productModel({
            title, 
            description: desc, 
            price,
        });
        const result = await newProduct.save(); //waits for this one to be competed before the next line executes
        return result.id as string;
    }

    getProducts() {
        return [...this.products];
    }

    getSingleProduct(productId: string) {
        const product = this.findProduct(productId)[0];
        return { ...product} ;
    }

    updateProduct(productId: string, title: string, desc: string, price: number) {
        const [product, index] = this.findProduct(productId);
        const updatedProduct = {...product};
        if (title) {
            updatedProduct.title = title;
        }
        if (desc) {
            updatedProduct.desc = desc;
        }
        if (price) {
            updatedProduct.price = price;
        }
        this.products[index] = updatedProduct;
    }

    private findProduct(id: string): [Product, number] {
        const productIndex = this.products.findIndex(prod => prod.id === id);
        const product = this.products[productIndex];
        if (!product) {
            throw new NotFoundException('could not find product');
        }
        return [product, productIndex];
    }

    deleteProduct(prodId: string) {
        const index = this.findProduct(prodId)[1];
        this.products.splice(index, 1);
    }
}