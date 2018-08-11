(function () {

    ninjaGame.NinjaWorldBuilder = function () {
        let rows = 11,
            columns = 5,
            worldLayout = [];

        for (let i = 0; i < rows; i++) {
            let row = [];
            for (let n = 0; n < columns; n++) {
                if (i === ninjaGame.NinjaStartPosition[0] && n === ninjaGame.NinjaStartPosition[1]) {
                    row.push('blank');
                } else if (i === 0 || i === 10 || n === 0 || n === 4) {
                    row.push('wall');
                } else if (n === 2) {
                    row.push(pickRandom('sushi', 'onigiri', 'wall', 'wall'));
                } else {
                    row.push(pickRandom('sushi', 'onigiri'));
                }
            }
            worldLayout.push(row);
        }

        return worldLayout;
    };

    ninjaGame.randomStartPosition = function(world) {
        while(1) {
            let randomX = getRandomInt(11);
            let randomY = getRandomInt(5);
            if (world.getWorldLayout()[randomX][randomY] !== 'wall') {
                return [randomX, randomY]
            }
        }
    };

    ninjaGame.NinjaStartPosition = [1, 1];

})();