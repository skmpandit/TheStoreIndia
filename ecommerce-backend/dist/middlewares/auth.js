import { TryCatch } from "./error.js";
import ErrorHandler from "../utils/utility-class.js";
import { User } from "../models/user.js";
export const adminOnly = TryCatch(async (req, res, next) => {
    const { id } = req.query;
    if (!id) {
        return next(new ErrorHandler("Login Please!", 401));
    }
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("Your are Not Allowed", 401));
    }
    if (user?.role !== "admin") {
        return next(new ErrorHandler("Only admin is Allowed to Excess", 403));
    }
    next();
});
