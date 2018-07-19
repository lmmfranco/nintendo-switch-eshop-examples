const SwitchEshop = require('nintendo-switch-eshop');
const fs = require('fs');

console.log("Fetching all EU games...");
SwitchEshop.getGamesEurope().then(games => {
    const gamesWithIds = games.filter(g => g.nsuid_txt);
    const ids = gamesWithIds.map(g => g.nsuid_txt[0]);

    console.log(`Fetching prices for ${ids.length} games on 'Great Britain'...`);
    SwitchEshop.getPrices("GB", ids).then(priceData => {
        const gamesOnSale = [];

        // Filter games with discount
        const discountPrices = priceData.prices.filter(p => p.discount_price);

        // Filter games on our discount list
        discountPrices.forEach(price => {
            const game = gamesWithIds.find(g => g.nsuid_txt[0] == price.title_id);
            if(game) {
                game.price_data = price;
                gamesOnSale.push(game);
            }
        });

        console.log(`Found ${gamesOnSale.length} games on sale`);

        const jsonData = JSON.stringify(gamesOnSale, null, 4);
        fs.writeFileSync("./gamedata.json", jsonData, "utf8");

        console.log("Saved results to gamedata.json");
    })

});