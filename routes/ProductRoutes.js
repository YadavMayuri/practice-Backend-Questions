import express from "express"
import { AbovePrice, BetweenPriceRange, ByCategory, ByPriceAndCategory, addProduct, getAllProducts, pagination,  } from "../controllers/ProductControllers.js";

const router = express.Router()

router.post('/allProducts',addProduct)
router.get('/',getAllProducts)
router.get('/ByCategory',ByCategory)
router.get('/BetweenPriceRange',BetweenPriceRange)
router.get('/AbovePrice',AbovePrice)
router.get('/ByPriceAndCategory',ByPriceAndCategory)

router.get('/pagination',pagination)







export default router;