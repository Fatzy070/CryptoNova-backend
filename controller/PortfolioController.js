import Portfolio from "../models/Portfolio.js";
import axios from "axios";

// Add new coin to portfolio
export const addCoin = async (req, res) => {
  try {
    const { coin, quantity, buyPrice } = req.body;

    let entryPrice = buyPrice;

    // If no buy price, use live market price from CoinPaprika
    if (!entryPrice) {
      const { data } = await axios.get(`https://api.coinpaprika.com/v1/tickers/${coin}`);
      if (!data || !data.quotes?.USD?.price) {
        return res.status(400).json({ message: "Invalid coin ID" });
      }
      entryPrice = data.quotes.USD.price;
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
    console.error("Error adding coin", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all portfolio coins + calculate P/L
export const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ user: req.user.id });

    const updated = await Promise.all(
      portfolio.map(async (item) => {
        try {
          const { data } = await axios.get(
            `https://api.coinpaprika.com/v1/tickers/${item.coin}`
          );

          const currentPrice = data.quotes?.USD?.price || item.buyPrice;
          const currentValue = currentPrice * item.quantity;

          const plValue = currentValue - item.buyPrice * item.quantity;
          const plPercent =
            ((currentPrice - item.buyPrice) / item.buyPrice) * 100;

          return {
            ...item._doc,
            currentPrice,
            currentValue,
            plValue,
            plPercent,
          };
        } catch (error) {
          console.error(`Error fetching ${item.coin}`, error.message);
          return {
            ...item._doc,
            currentPrice: item.buyPrice,
            currentValue: item.buyPrice * item.quantity,
            plValue: 0,
            plPercent: 0,
          };
        }
      })
    );

    res.json(updated);
  } catch (err) {
    console.error("Error fetching portfolio", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete portfolio item
export const deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;

    const portfolio = await Portfolio.findByIdAndDelete(id);

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    res.status(200).json({
      portfolio,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error("Cannot delete portfolio", error);
    res
      .status(500)
      .json({ message: "Server error while deleting portfolio" });
  }
};
