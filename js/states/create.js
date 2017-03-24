var create = {
    init: function() {
        console.log('Init create state...');
        game.settings.gui = new GUI();
    },

    create: function() {
        this.createIsometricMap();
    },

    createIsometricMap: function() {
        game.stage.backgroundColor = game.settings.background;

        groundGroup = game.add.group();
        cageGroup = game.add.group();
        incubatorGroup = game.add.group();
        slaugtherhouseGroup = game.add.group();
        officeGroup = game.add.group();
        storeGroup = game.add.group();
        foodStorageGroup = game.add.group();
        enviromentGroup = game.add.group();

        var tile;

        var tilesArray = [];
        tilesArray[0] = 'ground';
        tilesArray[1] = 'cage';
        tilesArray[2] = 'incubator';
        tilesArray[3] = 'slaugtherhouse';
        tilesArray[4] = 'storage';
        tilesArray[5] = 'office';
        tilesArray[6] = 'foodstorage';
        tilesArray[7] = 'tree1';
        tilesArray[8] = 'tree2';

        var tiles = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0,
            8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0,
            0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];

        var i = 0;

        for(var y = game.settings.grid; y <= game.settings.height - game.settings.grid ; y += game.settings.grid) {
            for(var x = game.settings.grid; x <= game.settings.width - game.settings.grid; x += game.settings.grid) {
                if(tiles[i] == 0) {
                    tile = game.add.isoSprite(x, y, 0, tilesArray[tiles[i]], 0, groundGroup);
                    tile.anchor.set(0.5);
                }

                if(tiles[i] == 1) {
                    tile = new Cage(this, x, y, 0, tilesArray[tiles[i]], cageGroup);
                    tile.anchor.set(0.5);
                }

                if(tiles[i] == 2) {
                    tile = game.add.isoSprite(x, y, 0, tilesArray[tiles[i]], 0, incubatorGroup);
                    tile.anchor.set(0.5);
                }

                if(tiles[i] == 3) {
                    tile = game.add.isoSprite(x, y, 0, tilesArray[tiles[i]], 0, slaugtherhouseGroup);
                    tile.anchor.set(0.5);
                }

                if(tiles[i] == 4) {
                    tile = game.add.isoSprite(x, y, 0, tilesArray[tiles[i]], 0, storeGroup);
                    tile.anchor.set(0.5);
                }

                if(tiles[i] == 5) {
                    tile = game.add.isoSprite(x, y, 0, tilesArray[tiles[i]], 0, officeGroup);
                    tile.anchor.set(0.5);
                }

                if(tiles[i] == 6) {
                    game.farm.foodStorage = new FoodStorage(this, x, y, 0, tilesArray[tiles[i]], 0, foodStorageGroup);
                    game.farm.foodStorage.anchor.set(0.5);
                }

                if(tiles[i] == 7 || tiles[i] == 8) {
                    tile = game.add.isoSprite(x, y, 0, tilesArray[tiles[i]], 0, enviromentGroup);
                    tile.anchor.set(0.5);
                }

                i++;
            }
        }
    },

    update: function() {
        this.updateCamera();
        this.updateIsometricMap();
    },

    updateCamera: function() {
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
    },

    updateIsometricMap: function() {
        game.iso.topologicalSort(groundGroup);
        game.iso.topologicalSort(slaugtherhouseGroup);
        game.iso.topologicalSort(officeGroup);
        game.iso.topologicalSort(storeGroup);
        game.iso.topologicalSort(foodStorageGroup);
        game.iso.topologicalSort(enviromentGroup);
    },

    render: function() {
        game.debug.inputInfo(15, 25);
        game.debug.cameraInfo(game.camera, 15, window.innerHeight - 100);
    }
};