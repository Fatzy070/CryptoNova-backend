import express from 'express'
import { CryptoNews , CryptoPrices , TopMarket } from '../controller/NewsController.js'

const router = express.Router()

router.get('/news' , CryptoNews )
router.get('/price' , CryptoPrices )
router.get('/top' , TopMarket)

export default router