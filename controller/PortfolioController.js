// controllers/portfolioController.js
import Portfolio from "../models/Portfolio.js";
import axios from "axios";


export const addCoin = async (req, res) => {
  try {
    const { coin, quantity, buyPrice } = req.body;

    // if user no give buyPrice, fallback to current market price
    let entryPrice = buyPrice;
    if (!entryPrice) {
      const { data } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`
      );
      if (!data[coin]) {
        return res.status(400).json({ message: "Invalid coin name" });
      }
      entryPrice = data[coin].usd;
    }

    const totalValue = entryPrice * quantity;

    const newCoin = await Portfolio.create({
      user: req.user.id,
      coin,
      quantity,
      buyPrice: entryPrice,
      totalValue,
    });

    res.status(201).json(newCoin);
  } catch (err) {
    console.error("Error adding coin", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ user: req.user.id });

    const updated = await Promise.all(
      portfolio.map(async (item) => {
        const { data } = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${item.coin}&vs_currencies=usd`
        );

        const currentPrice = data[item.coin]?.usd || item.buyPrice;
        const currentValue = currentPrice * item.quantity;

        // calculate P/L
        const plValue = currentValue - (item.buyPrice * item.quantity);
        const plPercent = ((currentPrice - item.buyPrice) / item.buyPrice) * 100;

        return {
          ...item._doc,
          currentPrice,
          currentValue,
          plValue,
          plPercent,
        };
      })
    );

    res.json(updated);
  } catch (err) {
    console.error("Error fetching portfolio", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const deletePortfolio = async(req , res) =>{
    try {
        const { id } = req.params

        const portfolio = await Portfolio.findByIdAndDelete(id)

        if (!portfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

   

        res.status(200).json({
             portfolio,
           message:"deleted successfully" 
         })

        

    } catch (error) {
        console.error("cannot delete portfolio" , error)
        res.status(500).json({ message:"Server error while deleting portfolio" })
    }
}