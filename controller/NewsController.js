import axios from "axios";

export const CryptoNews = async (req, res) => {
  try {
    const { nextPage } = req.query; // capture nextPage token if provided

    const url = `https://newsdata.io/api/1/news?apikey=${process.env.NEWS_API}&q=cryptocurrency&language=en${
      nextPage ? `&page=${nextPage}` : ""
    }`;

   

    const response = await axios.get(url);

    res.json(response.data); // return all (results + nextPage)
  } catch (error) {
    console.error("❌ Error fetching news:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
};



export const CryptoPrices = async (req, res) => {
  try {
    const response = await axios.get("https://api.coinpaprika.com/v1/tickers");
    const data = response.data.slice(0, 20).map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      current_price: coin.quotes.USD.price,
      price_change_percentage_24h: coin.quotes.USD.percent_change_24h,
      image: `https://static.coinpaprika.com/coin/${coin.id}/logo.png`,
    }));
    res.json(data);
  } catch (error) {
    console.error("Error fetching coins:", error.message);
    res.status(500).json({ message: "Error fetching coins" });
  }
};

export const TopMarket = async (req, res) => {
  try {
    const response = await axios.get("https://api.coinpaprika.com/v1/tickers");
    const data = response.data.slice(0, 4).map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      current_price: coin.quotes.USD.price,
      price_change_percentage_24h: coin.quotes.USD.percent_change_24h,
      image: `https://static.coinpaprika.com/coin/${coin.id}/logo.png`,
    }));
    res.json(data);
  } catch (error) {
    console.error("Error fetching top coins:", error.message);
    res.status(500).json({ message: "Error fetching top coins" });
  }
};

