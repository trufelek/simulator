var create = {
    init: function() {
        console.log('Init create state...');
    },

    create: function() {
        // set background color
        game.stage.backgroundColor = simulator.settings.background;

        // set world bounds
        game.world.setBounds(0, 0, simulator.settings.width, window.innerHeight);

        // create map
        this.createZigZagMap();

        // create gui
        simulator.gui = new GUI();

        // create owner
        simulator.farm.owner = new Owner();
    },

    createDiamondMap: function() {
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

        for(var y = simulator.settings.grid; y <= simulator.settings.height - simulator.settings.grid ; y += simulator.settings.grid) {
            for(var x = simulator.settings.grid; x <= simulator.settings.width - simulator.settings.grid; x += simulator.settings.grid) {
                if(tiles[i] == 0) {
                    tile = game.add.isoSprite(x, y, 0, tilesArray[tiles[i]], 0, groundGroup);
                    tile.anchor.set(0.5, 0);
                }

                if(tiles[i] == 1) {
                    cage = new Cage(game, x, y, 0, tilesArray[tiles[i]], 0, cageGroup, true);
                    simulator.farm.cages.push(cage);
                    cage.anchor.set(0.5);
                }

                if(tiles[i] == 2) {
                    incubator = new Incubator(game, x, y, 0, tilesArray[tiles[i]], 0, incubatorGroup);
                    simulator.farm.incubators.push(incubator);
                    incubator.anchor.set(0.5);
                }

                if(tiles[i] == 3) {
                    simulator.farm.slaughterhouse = new Slaughterhouse(game, x, y, 0, tilesArray[tiles[i]], 0, slaughterhouseGroup);
                    simulator.farm.slaughterhouse.anchor.set(0.5);
                }

                if(tiles[i] == 4) {
                    simulator.farm.storage = new Storage(game, x, y, 0, tilesArray[tiles[i]], 0, storeGroup);
                    simulator.farm.storage.anchor.set(0.5);
                }

                if(tiles[i] == 5) {
                    tile = game.add.isoSprite(x, y, 0, tilesArray[tiles[i]], 0, officeGroup);
                    tile.anchor.set(0.5);
                }

                if(tiles[i] == 6) {
                    simulator.farm.foodStorage = new FoodStorage(game, x, y, 0, tilesArray[tiles[i]], 0, foodStorageGroup);
                    simulator.farm.foodStorage.anchor.set(0.5);
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

    createZigZagMap : function() {
        //tiles groups
        var groundGroup = game.add.group();
        var foodStorageGroup = game.add.group();
        var incubatorGroup = game.add.group();
        var pavilionGroup = game.add.group();
        var cageGroup = game.add.group();

        var tile, offset;

        for(var i = 0; i < simulator.map.length ; i++) {
            if(i % 2 == 0) {
                offset = simulator.settings.tile.width / 2;
            } else {
                offset = 0;
            }

            for(var j = 0; j < simulator.map[i].length; j++) {
                var x = (j * simulator.settings.tile.width) + offset;
                var y = i * simulator.settings.tile.height / 2;
                var index = simulator.map[i][j];

                if(index == 0) {
                    tile = game.add.sprite(x, y, 'ground', 0, groundGroup);
                    tile.anchor.set(0.5, 0);
                }

                if(index == 1) {
                    tile = new FoodStorage(game, x, y, 'food_storage', 0, foodStorageGroup);
                    simulator.farm.foodStorage = tile;
                    tile.anchor.set(0.5);
                }

                if(index == 2) {
                    tile = new Incubator(game, x, y, 'incubator', 0, incubatorGroup);
                    simulator.farm.incubators.push(tile);
                    tile.anchor.set(0.5);
                }

                if(index >= 10 && index <= 31) {
                    var type = index.toString().split('');
                    var type_info = type.map(Number);

                    var pavilion = type_info[0];
                    var enabled = type_info[1];

                    tile = new Cage(game, x, y, enabled ? 'cage_double_full' : 'cage_double_empty', 0, cageGroup, enabled, pavilion);
                    simulator.farm.cages.push(tile);
                    tile.anchor.set(0.65, 0.4);
                }

                if(index == 3) {
                    var back = game.add.sprite(x, y, 'pavilion_back', 0, pavilionGroup);
                    back.anchor.set(0.25, 0.91);

                    tile = new Pavilion(game, x, y, 'pavilion_front', 0, pavilionGroup);
                    simulator.farm.pavilions.push(tile);
                    tile.anchor.set(0.25, 0.91);
                }
            }
        }
    },

    update: function() {
        // update camera
        this.updateCamera();

        //update interface
        simulator.gui.updateInterface();
    },

    updateCamera: function() {
        // control camera with pointer
        if (game.input.mousePointer.x < simulator.settings.camera.zone) {
            game.camera.x -= simulator.settings.camera.velocity;
        }

        if (game.input.mousePointer.x > game.width - simulator.settings.camera.zone) {
            game.camera.x += simulator.settings.camera.velocity;
        }

        if (game.input.mousePointer.y < simulator.settings.camera.zone) {
            game.camera.y -= simulator.settings.camera.velocity;
        }

        if (game.input.mousePointer.y > game.height - simulator.settings.camera.zone) {
            game.camera.y += simulator.settings.camera.velocity;
        }
    }
};