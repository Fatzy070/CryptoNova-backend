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

export const CryptoPrices = async(req , res ) => {
   const { page = 1 } = req.query;

  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 20,
          page,
          sparkline: false,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching coins" });
  }
}
export const TopMarket = async(req , res ) => {
   

  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: 4,
          page:1,
          sparkline: false,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching coins" });
  }
}
