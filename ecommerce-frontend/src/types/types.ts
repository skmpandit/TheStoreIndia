
export type User = {
    name: string,
    email: string,
    photo: string,
    gender: string,
    role: string,
    dob: string,
    _id: string,
}


export type Product = {
    photos: [],
    name: string,
    stock: number,
    price: number,
    category: string,
    _id: string,
    productDetails: [],
    itemAbouts: [],
    additionalInfo: [],
    ratings: number,
    numOfReviews: number,
}

export type ShippingInfo = {
    address: string,
    city: string,
    state: string,
    country: string,
    pinCode: string,
}

export type CartItem = {
    productId: string,
    photos: string[],
    name: string,
    price: number,
    quantity: number,
    stock: number
}

export type OrderItem = Omit<CartItem,"stock"> & { _id : string };

export type Order = {
    orderItems: OrderItem[],
    shippingInfo: ShippingInfo,
    subtotal: number,
    tax: number,
    shippingCharges: number,
    discount: number,
    total: number,
    status: string,
    user: { 
        name: string,
        _id: string,
    },
    _id: string,
}

type CountAndChange = {
    revenue: number;
    user: number;
    product: number;
    order: number;
}

type LatestTransaction = {
    _id: string;
    amount: number;
    discount: number;
    quantity: number;
    status: string;
}

export type Stats = {
    categoryCount: Record<string, number>[],
    // categories: string,
    changePercent: CountAndChange,
    count: CountAndChange,
    chart: {
        order: number[],
        revenue: number[],
        },
    userRatio: {
        male: number;
        female: number;
    },
    latestTransaction: LatestTransaction[]
}

export type Pie = {
    orderFullfillment: {
        processing: number;
        shipped: number;
        deliverd: number;
    },
    productCategories: Record<string, number>[],
    stockAvailablity: {
        inStock: number;
        outOfStock: number;
    },
    revenueDistribution: {
        netMargin: number;
        discount: number;
        productionCost: number;
        burnt: number;
        marketingConst: number;
    },
    userAgeGroup: {
        teen: number;
        adult: number;
        old: number;
    },
    adminCustomer: {
        admin: number;
        customer: number;
    },
}

export type Bar = {
    users: number[],
    products: number[],
    orders: number[],
}

export type Line = {
    users: number[],
    products: number[],
    discount: number[],
    revenue: number[],
}