var create = {
    init: function() {
        console.log('Init create state...');
        // create gui
        game.settings.gui = new GUI();
    },

    create: function() {
        // create map
        this.createIsometricMap();
    },

    createIsometricMap: function() {
        // set background color
        game.stage.backgroundColor = game.settings.background;

        // tiles groups
        groundGroup = game.add.group();
        cageGroup = game.add.group();
        incubatorGroup = game.add.group();
        slaughterhouseGroup = game.add.group();
        officeGroup = game.add.group();
        storeGroup = game.add.group();
        foodStorageGroup = game.add.group();
        enviromentGroup = game.add.group();

        // images map
        var tilesArray = [];
        tilesArray[0] = 'ground';
        tilesArray[1] = 'cage';
        tilesArray[2] = 'incubator';
        tilesArray[3] = 'slaughterhouse';
        tilesArray[4] = 'storage';
        tilesArray[5] = 'office';
        tilesArray[6] = 'foodstorage';
        tilesArray[7] = 'tree1';
        tilesArray[8] = 'tree2';

        // iso map
        var tiles = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 2, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 2, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 2, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 2, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];

        // draw map
        var ground, cage, incubator, tile;
        var i = 0;

        for(var y = game.settings.grid; y <= game.settings.height - game.settings.grid ; y += game.settings.grid) {
            for(var x = game.settings.grid; x <= game.settings.width - game.settings.grid; x += game.settings.grid) {
                if(tiles[i] == 0) {
                    tile = game.add.isoSprite(x, y, 0, tilesArray[tiles[i]], 0, groundGroup);
                    tile.anchor.set(0.5, 0);
                }

                if(tiles[i] == 1) {
                    cage = new Cage(game, x, y, 0, tilesArray[tiles[i]], 0, cageGroup, true);
                    game.farm.cages.push(cage);
                    cage.anchor.set(0.5);
                }

                if(tiles[i] == 2) {
                    incubator = new Incubator(game, x, y, 0, tilesArray[tiles[i]], 0, incubatorGroup);
                    game.farm.incubators.push(incubator);
                    incubator.anchor.set(0.5);
                }

                if(tiles[i] == 3) {
                    game.farm.slaughterhouse = new Slaughterhouse(game, x, y, 0, tilesArray[tiles[i]], 0, slaughterhouseGroup);
                    game.farm.slaughterhouse.anchor.set(0.5);
                }

                if(tiles[i] == 4) {
                    game.farm.storage = new Storage(game, x, y, 0, tilesArray[tiles[i]], 0, storeGroup);
                    game.farm.storage.anchor.set(0.5);
                }

                if(tiles[i] == 5) {
                    tile = game.add.isoSprite(x, y, 0, tilesArray[tiles[i]], 0, officeGroup);
                    tile.anchor.set(0.5);
                }

                if(tiles[i] == 6) {
                    game.farm.foodStorage = new FoodStorage(game, x, y, 0, tilesArray[tiles[i]], 0, foodStorageGroup);
                    game.farm.foodStorage.anchor.set(0.5);
                }

                if(tiles[i] == 7 || tiles[i] == 8) {
                    tile = game.add.isoSprite(x, y, 0, tilesArray[tiles[i]], 0, enviromentGroup);
                    tile.anchor.set(0.5);
                }

                i++;
            }
        }

        // depth sorting of groups
        game.iso.topologicalSort(groundGroup);
        game.iso.topologicalSort(cageGroup);
        game.iso.topologicalSort(slaughterhouseGroup);
        game.iso.topologicalSort(officeGroup);
        game.iso.topologicalSort(storeGroup);
        game.iso.topologicalSort(foodStorageGroup);
        game.iso.topologicalSort(enviromentGroup);
    },

    update: function() {
        // update camera
        this.updateCamera();
    },

    updateCamera: function() {
        // control camera with pointer
        if (game.input.mousePointer.x < game.settings.camera.zone) {
            game.camera.x -= game.settings.camera.velocity;
        }

        if (game.input.mousePointer.x > game.width - game.settings.camera.zone) {
            game.camera.x += game.settings.camera.velocity;
        }

        if (game.input.mousePointer.y < game.settings.camera.zone) {
            game.camera.y -= game.settings.camera.velocity;
        }

        if (game.input.mousePointer.y > game.height - game.settings.camera.zone) {
            game.camera.y += game.settings.camera.velocity;
        }
    }
};