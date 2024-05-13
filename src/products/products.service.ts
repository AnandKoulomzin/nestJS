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

    async getProducts() {
        const products = await this.productModel.find().exec(); //.exec() gives a better promise
        return products.map((prod)=> ({id: prod.id, title: prod.title, description: prod.description, price: prod.price}));
    }

    async getSingleProduct(productId: string) {
        const product = await this.findProduct(productId)[0];
        return { id: product.id, title: product.title, description: product.desc, price: product.price};
    }

    async updateProduct(productId: string, title: string, desc: string, price: number) {
        const updatedProduct = await this.findProduct(productId);
        if (title) {
            updatedProduct.title = title;
        }
        if (desc) {
            updatedProduct.description = desc;
        }
        if (price) {
            updatedProduct.price = price;
        }
        updatedProduct.save();
    }

    private async findProduct(id: string): Promise<Product> {
        let product;
        try {
            product = await this.productModel.findById(id).exec();
        } catch (error) {
            throw new NotFoundException('could not find product');
        }
        if (!product) {
            throw new NotFoundException('could not find product');
        }
        return product;
    }

    async deleteProduct(prodId: string) {
        const result = await this.productModel.deleteOne({_id: prodId}).exec();
        if (result.n === 0 ) {
            throw new NotFoundException('could not find product');
        }
    }
}