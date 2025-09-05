import Category from "../models/Category.js";
export const validateCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId).select('_id');
        if (!category) {
            res.status(404).json({
                success: false,
                message: "Category not found"
            });
            return;
        }
        next();
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid category ID"
        });
    }
};
//# sourceMappingURL=categoryMiddleware.js.map