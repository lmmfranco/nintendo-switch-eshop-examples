const { getGamesAmerica, getPrices, parseNSUID, Region } = require("nintendo-switch-eshop");
const fs = require('fs');

(async () => {
    console.log("Fetching all games...");
    const games = await getGamesAmerica();
    const gameIds = games.map(g => parseNSUID(g, Region.AMERICA));

    console.log(`Fetching prices for ${gameIds.length} games on 'Canada'...`);
    const priceData = await getPrices("CA", gameIds);
    const gamesOnSale = [];

    // Filter games with discount
    const discountPrices = priceData.prices.filter(p => p.discount_price);

    // Filter games on our discount list
    discountPrices.forEach(price => {
        const game = games.find(g => parseNSUID(g, Region.AMERICA) == price.title_id);
        if (game) {
            game.price_data = price;
            gamesOnSale.push(game);
        }
    });

    console.log(`Found ${gamesOnSale.length} games on sale`);

    const jsonData = JSON.stringify(gamesOnSale, null, 4);
    fs.writeFileSync("./gamedata.json", jsonData, "utf8");

    console.log("Saved results to gamedata.json");
})();
