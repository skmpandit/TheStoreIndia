import { NextFunction, Response, Request } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";


export const newUser = TryCatch(
    async (req:Request<{},{}, NewUserRequestBody>, res:Response, next:NextFunction) => {
        const {_id, name, email, photo, gender, dob} = req.body;
        let user = await User.findById(_id);
        if(user) {
            return res.status(200).json({
                success: true,
                message: `Welcome ${user.name}`
            })
        }
        if(!_id || !name || !email || !photo || !gender || !dob) {
            return next(new ErrorHandler("Please add all fields", 400));
        }
        user = await User.create({_id, name, email, photo, gender, dob: new Date(dob)});
    
        return res.status(201).json({
            success: true,
            message:  `Welcome ${user.name}`,
        })
    }
);

export const getAllUsers = TryCatch(
    async (req, res, next) => {
        const users = await User.find({});
        return res.status(200).json({
            success: true,
            users
        })
    }
);

export const getUser = TryCatch(
    async (req, res, next) => {
        const id = (req.params as { id: string}).id;
        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(400).json({ 
                    success: false,
                    message: "Invalid ID"
                });
            }
            return res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            return next(new ErrorHandler("Internal Server Error", 500));
        }
    }
);

export const deleteUser = TryCatch( async(req, res, next) => {
        const id = req.params.id;
        const user = await User.findById(id);

        if(!user) {
            return next(new ErrorHandler("Invalid ID",400));
        }
        await user.deleteOne();
        // const deleteUser = await User.findById(id);
        // if(deleteUser) {
        //     return next(new ErrorHandler("Failed to Delete the User", 500));
        // }
        return res.status(200).json({
            success: true,
            message: "User Delete Successfully"
        })
    }
)