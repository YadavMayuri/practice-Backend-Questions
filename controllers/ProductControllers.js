import Products from "../modals/products.js";
import fs from "fs"
import path from "path"

const __dirname = path.resolve();

export const addProduct = async (req, res) => {
    try {
        const products_data = JSON.parse(fs.readFileSync(__dirname + '/data/products.json', 'utf-8'));

        // insert Products data to Mongodb

        for (var i = 0; i < products_data.length; i++) {

            var name, price, description, category;
            name = products_data[i]["name"];
            price = products_data[i]["price"];
            description = products_data[i]["description"];
            category = products_data[i]["category"];

            var newproduct = {
                "name": name,
                "description": description,
                "price": price,
                "category": category
            };

            Products.create(newproduct);
            // res.status(200).json({message:"Products added to DB successfully."})
        }

    } catch (err) {
        res.send(err)

    }
}


//get all products
export const getAllProducts = async (req, res) => {
    try {
        const product = await Products.find({}).exec();
        const CountOfProducts = await Products.count();
        if (!product) {
            return res.status(404).json({ message: "No products found." })
        }
        return res.send({ CountOfProducts, product })

    } catch (err) {
        res.send(err)
    }
}


//return product category = phone
export const ByCategory = async (req, res) => {
    try {
        const { category } = req.query;

        const product = await Products.find({ category: category }).exec()
        const CountOfProducts = await await Products.find({ category: category }).count();

        if (!product) {
            return res.status(404).json({ message: "No products found." })
        }
        return res.send({
            "Total Products in this category ": CountOfProducts,
            product
        });


    } catch (err) {
        return res.send(err)
    }
}


//get products between range
export const BetweenPriceRange = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;
        const product = await Products.find({ price: { $gte: minPrice, $lte: maxPrice } })
        const CountPriducts = await Products.find({ price: { $gte: minPrice, $lte: maxPrice } }).count()
        if (!product[0]) return res.status(404).json({ message: "Products not found. " })
        return res.status(200).json({
            "Total products between this price range ": CountPriducts,
            product
        })


    } catch (err) {
        res.send(err)
    }
}


//get productd above price
export const AbovePrice = async (req, res) => {
    try {
        const { range } = req.query;
        const product = await Products.find({ price: { $gt: range } })
        const CountOfProducts = await Products.find({ price: { $gt: range } }).count()
        if (!product[0]) return res.status(404).json({ message: "Products not found." })
        return res.status(200).json({
            "Total products between this price range": CountOfProducts,
            product
        })

    } catch (err) {
        res.send(err)
    }
}


//get products between price range and by category
export const ByPriceAndCategory = async (req, res) => {
    try {
        const { minPrice, maxPrice, category } = req.query;
        if (!minPrice) return res.status(400).json({ message: "Min price is required." })
        if (!maxPrice) return res.status(400).json({ message: "Max price is required." })
        if (!category) return res.status(400).json({ message: "category is required." })

        const product = await Products.find({ price: { $gte: minPrice, $lte: maxPrice }, category: category })
        const CountOfProducts = await Products.find({ price: { $gte: minPrice, $lte: maxPrice }, category: category }).count();
        if (!product[0]) return res.status(404).json({ message: "No products found." })
        return res.status(200).json({
            "Total products between price range and by category ": CountOfProducts,
            product
        })
    } catch (err) {
        res.send(err)
    }
}


//pagination
export const pagination = async (req, res) => {
    const { offset = 0, limit = 5 } = req.query;
    if (!offset) return res.status(400).json({ message: "Offset is required." })
    if (!limit) return res.status(400).json({ message: "Limit is required." })


    try {
        const product = await Products.find()
            .limit(limit * 1)
            .skip((offset - 1) * limit)
            .exec();

        const count = await Products.count();

        const CountProductsonPage = await Products.find()
            .limit(limit * 1)
            .skip((offset - 1) * limit)
            .count()

        if (product[0]) {
            res.send({
                product,
                "Total Pages": Math.ceil(count / limit),
                "Current Page": offset,
                "Total Products on this page": CountProductsonPage
            });
        } else {
            return res
                .status(404)
                .json({ message: "No more products found." })
        }


    } catch (err) {
        return res.send(err);
    }
}


//pagination - 

export const paginationR = async (req, res) => {
    try {
        // console.log(req.query, "req.query")
        const limit = (req.query.limit < 5 ? req.query.limit : 5);
        const offset = req.query.offset || 0;
        // console.log(limit, offset,"limit, offset")
        // var ids = [];

        //Write your Code here.
        const resFromDB = await Products.find().skip(limit * offset).limit(limit).select('_id');

        const ids = resFromDB.map(pro => pro._id)

        res.send(ids);

    } catch (err) {
        res.send(err);
    }
}


//get products using range

export const getProductRange = async (req, res) => {

    const { category, range } = req.query;
    try {

        let query = {};
        // console.log(range)
        if (category) {
            query.category = category
        }

        if (range) {

            const [minPrice, maxPrice] = range.split('-');
            // console.log(minPrice, maxPrice,"chec here")
            if (minPrice && maxPrice) {
                query.price = { $gte: minPrice, $lte: maxPrice }
            } else if (minPrice) {
                query.price = { $gte: minPrice }
            }
        }
        // console.log(query, "query")
        // console.log(minPrice,maxPrice,"range")
        const resFromMongo = await Products.find(query).exec();
        res.json({"Total products in this price range":resFromMongo.length});


    } catch (err) {
        res.send(err);
    }
}