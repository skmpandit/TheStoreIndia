import mongoose from "mongoose";


const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter Name"],
        },
        photos: [{
            type: String,
            required: [true, "Please add Photo"],
        }],
        price: {
            type: Number,
            required: [true, "Please enter Price"]
        },
        stock: {
            type: Number,
            required: [true, "Please enter Stock"],
        },
        category: {
            type: String,
            required: [true, "Please enter Product Category"],
            trim: true,
        },
        productDetails: [{
            detailsHead: {
                type: String,
            },
            detailsSub: {
                type: String,
            }
        }],
        itemAbouts: [{
            aboutsHead: {
                type: String,
            },
            aboutsSub: {
                type: String,
            }
        }],
        additionalInfo: [{
            infoHead: {
                type: String,
            },
            infoSub: {
                type: String,
            }
        }],
        ratings: {
            type: Number,
            default: 0,
        },
        numOfReviews: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.ObjectId,
                    ref: "User",
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },
                rating: {
                    type: Number,
                    required: true,
                },
                comment: {
                    type: String,
                    required: true,
                }
            }
        ],
    },
    {
        timestamps: true,
    }
)

export const Product = mongoose.model("Product", schema);