import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { calculatePercentage, getChartData, getInventories } from "../utils/features.js";


export const getDashboardStats = TryCatch(
    async(req, res, next) => {
        let stats = {};
        const key = "admin-stats";
        if(myCache.has(key)) { 
            stats = JSON.parse(myCache.get(key) as string);
        } else {
            const today = new Date();
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth()-6);

            const thisMonth = {
                start: new Date(today.getFullYear(), today.getMonth(), 1),
                end: today,
            }

            const lastMonth = {
                start: new Date(today.getFullYear(), today.getMonth()-1, 1),
                end: new Date(today.getFullYear(), today.getMonth(), 0),
            }
            
            const thisMonthProductsPromise = Product.find({
                createdAt: {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end,
                }
            })
            const lastMonthProductsPromise = await Product.find({
                createdAt: {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end,
                }
            })

            const thisMonthUsersPromise = User.find({
                createdAt: {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end,
                }
            })
            const lastMonthUsersPromise = User.find({
                createdAt: {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end,
                }
            })

            const thisMonthOrdersPromise = Order.find({
                createdAt: {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end,
                }
            })
            const lastMonthOrdersPromise = Order.find({
                createdAt: {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end,
                }
            })

            const lastSixMonthOrdersPromise = Order.find({
                createdAt: {
                    $gte: sixMonthsAgo,
                    $lte: today,
                }
            })

            const latestTransactionsPromise = Order.find({}).select(["orderItems","discount","total","status"]).limit(4);

            const [
                thisMonthProducts, 
                thisMonthUsers, 
                thisMonthOrders, 
                lastMonthProducts, 
                lastMonthUsers, 
                lastMonthOrders,
                productsCount,
                usersCount,
                allOrders,
                lastSixMonthOrders,
                categories,
                femaleUsersCount,
                latestTransactions,
            ] = await Promise.all([
                thisMonthProductsPromise, 
                thisMonthUsersPromise, 
                thisMonthOrdersPromise, 
                lastMonthProductsPromise, 
                lastMonthUsersPromise, 
                lastMonthOrdersPromise,
                Product.countDocuments(),
                User.countDocuments(),
                Order.find({}).select("total"),
                lastSixMonthOrdersPromise,
                Product.distinct("category"),
                User.countDocuments({ gender: "female"}),
                latestTransactionsPromise
            ]);
            const thisMonthRevenue = thisMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
            const lastMonthRevenue = lastMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
            const changePercent = {
                revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
                user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
                product: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
                order: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length)
            }
            const revenue = allOrders.reduce((total, order) => total + (order.total || 0), 0);
            const count = {
                revenue,
                user: usersCount,
                product: productsCount,
                order: allOrders.length,
            } 
            const orderMonthCount = new Array(6).fill(0);
            const orderMonthlyRevenue = new Array(6).fill(0);
            lastSixMonthOrders.forEach((order) => {
                const creationDate = order.createdAt;
                const monthDeff = (today.getMonth() - creationDate.getMonth() + 12 ) % 12;
                if(monthDeff < 6) {
                    orderMonthCount[6 - monthDeff - 1] += 1;
                    orderMonthlyRevenue[6 - monthDeff - 1] += order.total;
                }
            })
    
            const categoryCount = await getInventories({categories, productsCount});
            
            const userRatio = {
                male: usersCount - femaleUsersCount,
                female: femaleUsersCount,
            }
            const modifiedLatestTransaction = latestTransactions.map(i => ({
                _id: i._id,
                discount: i.discount,
                amount: i.total,
                quantity: i.orderItems.length,
                status: i.status,
            }))

            stats = { 
                categoryCount,
                // categories,
                changePercent,
                count,
                chart: {
                    order: orderMonthCount,
                    revenue: orderMonthlyRevenue,
                },
                userRatio,
                latestTransaction: modifiedLatestTransaction
            }
            myCache.set(key, JSON.stringify(stats));
        }

        return res.status(200).json({
            success: true,
            stats,
        })
    }
)

export const getPieCharts = TryCatch(
    async(req, res, next) => {
        let charts;
        const key = "admin-pie-charts";
        if(myCache.has(key)) {
            charts = JSON.parse(myCache.get(key) as string);
        } else {
            const allOrderPromise = Order.find({}).select(["total","discount","subtotal","tax","shippingCharges"]);
            const [
                processingOrder,
                shippedOrder,
                deliverdOrder,
                categories,
                productsCount,
                outOfStock,
                allOrders,
                allUsers, 
                adminUsers,
                customerUsers,
            ] = await Promise.all([
                Order.countDocuments({status: "Processing"}),
                Order.countDocuments({status: "Shipped"}),
                Order.countDocuments({status: "Delivered"}),
                Product.distinct("category"),
                Product.countDocuments(),
                Product.countDocuments({ stock: 0}),
                allOrderPromise,
                User.find({}).select(["dob"]),
                User.countDocuments({ role: "admin"}),
                User.countDocuments({ role: "user"}),
            ])
            const orderFullfillment = {
                processing: processingOrder,
                shipped: shippedOrder,
                deliverd: deliverdOrder,
            }
            const productCategories = await getInventories({categories, productsCount});
            const stockAvailablity = {
                inStock: productsCount - outOfStock,
                outOfStock,
            }
            const grossIncome = allOrders.reduce((prev, order) => prev + (order.total || 0), 0);
            const discount = allOrders.reduce((prev, order) => prev + (order.discount || 0), 0);
            const productionCost = allOrders.reduce((prev, order) => prev + (order.shippingCharges || 0), 0);
            const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
            const marketingConst = Math.round(grossIncome * (30 / 100));
            const netMargin = grossIncome - discount - productionCost - burnt - marketingConst;
            const revenueDistribution = {
                netMargin,
                discount,
                productionCost,
                burnt,
                marketingConst,
            }
            const adminCustomer = {
                admin: adminUsers,
                customer: customerUsers,
            }
            const userAgeGroup = {
                teen: allUsers.filter((i) => i.age < 20).length,
                adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
                old: allUsers.filter((i) => i.age >= 40).length,
            }
            charts = {
                orderFullfillment,
                productCategories,
                stockAvailablity,
                revenueDistribution,
                userAgeGroup,
                adminCustomer,
            }
            myCache.set(key, JSON.stringify(charts));
        }
        return res.status(200).json({
            success: true,
            charts
        })
    }
)

export const getBarCharts = TryCatch(
    async(req, res, next) => {
        let charts;
        const key = "admin-bar-charts";
        if(myCache.has(key)) {
            charts = JSON.parse(myCache.get(key) as string);
        } else {
            const today = new Date();

            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 12);

            const sixMonthProductPromise = Product.find({
                createdAt: {
                  $gte: sixMonthsAgo,
                  $lte: today,
                },
              }).select("createdAt");

            const sixMonthUserPromise = User.find({
                createdAt: {
                    $gte: sixMonthsAgo,
                    $lte: today,
                }
            }).select("createdAt");

            const twelveMonthOrderPromise = Order.find({
                createdAt: {
                    $gte: twelveMonthsAgo,
                    $lte: today,
                }
            }).select("createdAt");

            const [
                products,
                users,
                orders
            ] = await Promise.all([
                sixMonthProductPromise,
                sixMonthUserPromise,
                twelveMonthOrderPromise,
            ])

            // const transformedProducts: MyDocument[] = products.map(product => ({
            //     createdAt: product.createdAt
            // }));
            
            const productCounts = getChartData({ length: 6, today, docArr: products });
            const userCounts = getChartData({ length: 6, today, docArr: users });
            const orderCounts = getChartData({ length: 12, today, docArr: orders });

            charts = {
                users: userCounts,
                products: productCounts,
                orders: orderCounts,
            }

            myCache.set(key, JSON.stringify(charts));
        }
        return res.status(200).json({
            success: true,
            charts,
        })
    }
)

export const getLineCharts = TryCatch(
    async(req, res, next) =>{
        let charts; 
        const key = "admin-line-charts";
        if(myCache.has(key)) {
            charts = JSON.parse(myCache.get(key) as string);
        } else {
            const today = new Date();

            const twelveMonthsAgo = new Date();
            twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
            const baseQuery = {
                createdAt: {
                    $gte: twelveMonthsAgo,
                    $lte: today,
                }
            }

            const [users, products, orders] = await Promise.all([
                User.find(baseQuery).select("createdAt"),
                Product.find(baseQuery).select("createdAt"),
                Order.find(baseQuery).select(["createdAt","discount","total"]),
            ])
            const userCounts = getChartData({length: 12, today, docArr: users});
            const productCounts = getChartData({length: 12, today, docArr: products});
            const discount = getChartData({length: 12, today, docArr: orders, property: "discount"});
            const revenue = getChartData({ length: 12, today, docArr: orders, property: "total"});
            const 
            charts = {
                users: userCounts,
                products: productCounts,
                discount,
                revenue,
            }
            myCache.set(key, JSON.stringify(charts));
        }
        return res.status(200).json({
            success: true,
            charts,
        })
    }
)