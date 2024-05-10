import { Controller, Post, Body, Get, Param, Patch, Delete } from "@nestjs/common";

import { ProductsService } from './products.service';

@Controller('products')

export class ProductsController {
    constructor(private readonly productsService: ProductsService) {

    }

    @Post()
    async addProduct(
        @Body('title') prodTitle: string, 
        @Body('description') prodDesc: string, 
        @Body('price') prodPrice: number
        ) {
        const generatedId = await this.productsService.insertProduct( //if we returned this it would be in html format, we want json
            prodTitle, 
            prodDesc, 
            prodPrice
            ); 
        return {id: generatedId};
    }

    @Get()
    getAllProducts() {
        return {products: this.productsService.getProducts()};
    }
    @Get(':id')
    getProduct(@Param('id') prodId: string) {
        return this.productsService.getSingleProduct(prodId);
    }

    @Patch(':id')
    updateProduct(@Param('id') prodId: string, @Body('title') prodTitle: string, @Body('description') prodDesc: string, @Body('price') prodPrice: number) {
        this.productsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
        return null;
    }

    @Delete(':id')
    removeProduct(@Param('id') prodId: string,) {
        this.productsService.deleteProduct(prodId);
        return null;
    }
}
