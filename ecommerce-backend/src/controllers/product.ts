import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery, productDetailsTypes } from "../types/types.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { read, rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";



export const newProduct = TryCatch (
    async(req: Request<{}, {}, NewProductRequestBody>, res: Response, next: NextFunction) => {
        const { name, price, stock, category, itemAbouts, productDetails, additionalInfo, ratings, numOfReviews, reviews } = req.body;
        const photos = req.files as Express.Multer.File[];
        console.log(req.body);
         
        
        if(!photos || photos.length === 0) return next(new ErrorHandler("Please add Photo",400));
        if(!name || !price || !stock || !category ) {
            photos.forEach((photo: Express.Multer.File) => {
                rm(photo.path, ()=> {
                    console.log("Deleted");
                });
            })
            return next(new ErrorHandler("Please fill all Fields",400));
        }
        const photoPaths = photos.map((photo: Express.Multer.File) => photo.path);
        await Product.create({ 
            name, 
            price, 
            stock, 
            category: category.toLowerCase(), 
            photos: photoPaths,
            productDetails,
            itemAbouts,
            additionalInfo,
            ratings,
            numOfReviews,
            reviews,
        });
        invalidateCache({ product: true, admin: true, });
        return res.status(201).json({
            success: true,
            message: "Product Created Successfully",
        })
    }
)

// Revalidate on New, Update, Delete Product & on New Order
export const getlatestProduct = TryCatch(
    async (req, res, next) => {
        let products;
        if(myCache.has("latest-products")) {
            products = JSON.parse(myCache.get("latest-products") as string);
        } else {
            products = await Product.find({}).sort({ createdAt: -1}).limit(5);
            myCache.set("latest-products", JSON.stringify(products));
        }
        
        return res.status(200).json({
            success: true,
            products,
        })
    }
)

// Revalidate on New, Update, Delete Product & on New Order
export const getAllCategories = TryCatch(
    async(req, res, next) => {
        let categories;
        if(myCache.has("categories")) {
            categories = JSON.parse(myCache.get("categories") as string);
        } else {
            categories = await Product.distinct("category");
            myCache.set("categories", JSON.stringify(categories));
        }
        return res.status(200).json({
            success: true,
            categories,
        })
    }
)

// Revalidate on New, Update, Delete Product & on New Order
export const getAdminProducts = TryCatch(
    async(req, res, next) => {
        let products;
        const key = "All-products";
        if(myCache.has(key)) {
            products = JSON.parse(myCache.get(key) as string);
        } else {
            products = await Product.find({});
            myCache.set(key, JSON.stringify(products));
        }
        return res.status(200).json({
            success: true,
            products,
        })
    }
)

export const getSingleProduct = TryCatch(
    async(req, res, next) => {
        let product;
        const id = req.params.id;
        const key = `product-${id}`;
        if(myCache.has(key)) {
            product = JSON.parse(myCache.get(key) as string);
        } else {
            product = await Product.findById(id);
            if(!product) {
                return next(new ErrorHandler("Product Not Found", 404));
            }
            myCache.set(key, JSON.stringify(product));
        }
        
        return res.status(200).json({
            success: true,
            product,
        })
    }
)

export const updateProduct = TryCatch(
    async (req, res, next) => {
        const { id } = req.params;
        const { name, price, category, stock, productDetails, itemAbouts, additionalInfo } = req.body;
        const photos = req.files;
        const product = await Product.findById(id);
        if(!product) {
            return next(new ErrorHandler("Invalid Product Id", 404));
        }
        if (Array.isArray(photos) && photos.length > 0) {
            for (const photo of photos) {
                const existingIndex = product.photos.findIndex(existingPhoto => existingPhoto === photo.path);
                if (existingIndex !== -1) {
                    // Remove the existing photo
                    rm(product.photos[existingIndex], () => {
                        console.log("Old Photo Deleted");
                    });
                    product.photos.splice(existingIndex, 1);
                }
                
                // Add the new photo
                product.photos.push(photo.path);
            }
        }
        if(name) { product.name = name; }
        if(price) { product.price = price; }
        if(stock) { product.stock = stock; }
        if(category) { product.category = category }
        if(productDetails) {
            product.productDetails = productDetails;
        }
        if(itemAbouts) {
            product.itemAbouts = itemAbouts;
        }
        if(additionalInfo) {
            product.additionalInfo = additionalInfo;
        }
        await product.save();
        invalidateCache({ product: true, productId: String(product._id), admin: true, });
        return res.status(200).json({
            success: true,
            message: "Product Updated Successfully",
        })
    }
)

export const deleteProduct = TryCatch(
    async (req , res, next) => {
        const product = await Product.findById(req.params.id);
        if(!product) {
            return next(new ErrorHandler("Product Not Found", 404));
        }
        if (product.photos && product.photos.length > 0) {
            for (const imagePath of product.photos) {
                rm(imagePath, (err) => {
                    if (err) {
                        console.error("Error deleting image:", err);
                    } else {
                        console.log("Product Image Deleted:", imagePath);
                    }
                });
            }
        }
        await product.deleteOne();
        invalidateCache({ product: true, productId: String(product._id), admin: true, });
        return res.status(200).json({
            success: true,
            message: "Product Deleted Successfully",
        })
    }
)

export const getAllProducts = TryCatch(
    async(req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {

        const { search, price, sort, category } = req.query;

        const page = Number(req.query.page) || 1;
        const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;

        const skip = (page - 1) * limit;

        const baseQuery: BaseQuery = {};
        
        if(search) {
            baseQuery.name = {
                $regex: search,
                $options: "i",
            }
        }
        if(price) {
            baseQuery.price = {
                $lte: Number(price),
            }
        }
        if(category) {
            baseQuery.category = category;
        }
        const productsPromise = Product.find(baseQuery).sort(sort && {price: sort === "asc" ? 1 : -1}).limit(limit).skip(skip)

        const [products, filteredOnlyProduct] = await Promise.all([productsPromise, Product.find(baseQuery) ]);

        const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

        return res.status(200).json({
            success: true,
            products,
            totalPage,
        })
    }
)