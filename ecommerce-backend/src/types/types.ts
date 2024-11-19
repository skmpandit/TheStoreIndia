import { Request, Response, NextFunction } from "express";

export interface NewUserRequestBody {
    _id: string;
    name: string;
    email: string;
    photo: string;
    role: string;
    gender: string;
    dob: Date;
}


export type productDetailsTypes = {
    detailsHead: string,
    detailsSub: string,
}

export type itemAboutsTypes = {
    aboutsHead: string,
    aboutsSub: string,
}

export type additionalInfoTypes = {
    infoHead: string,
    infoSub: string
}

export type reviewsTypes = {
    user: string,
    name: string,
    rating: number,
    comment: string,
}

export interface NewProductRequestBody {
    name: string;
    price: number;
    stock: number;
    category: string;
    productDetails: productDetailsTypes[];
    itemAbouts: itemAboutsTypes[];
    additionalInfo: additionalInfoTypes[];
    ratings: number;
    numOfReviews: number; 
    reviews: reviewsTypes[];
}

export interface SearchRequestQuery {
    search?: string;
    price?: string;
    category?: string;
    sort?: string;
    page?: string;
}

export interface BaseQuery {
    name?: {
        $regex: string,
        $options: string,
    },
    price?: {
        $lte: number;
    }, 
    category?: string;
}


export type InvalidateCacheProps = {
    product?: boolean;
    order?: boolean;
    admin?: boolean;
    userId?: string;
    orderId?: string;
    productId?: string | string[];
}

export type ShippingInfoType = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number; 
}

export type OrderItemType = {
    name: string;
    photos: string[];
    price: number;
    quantity: number;
    productId: string;
}

export interface NewOrderRequestBody {
    shippingInfo: {};
    user: string;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    orderItems: OrderItemType[]; 
}

export type ControllerType = (
    req: Request<any>, 
    res: Response, 
    next: NextFunction
) =>  Promise<void | Response<any, Record<string, any>>>