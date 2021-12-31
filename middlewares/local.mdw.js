import productModels from "../models/product.models.js";

export default function (app) {
    app.use(async function (req, res, next){
        const obj = await productModels.getAllParentsProductType();
        res.locals.ParentType = obj.recordset;
        next();
    });
};