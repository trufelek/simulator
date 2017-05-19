var create = {
    init: function() {
        console.log('Init create state...');
    },

    create: function() {
        // set background color
        game.stage.backgroundColor = simulator.settings.background;

        // set world bounds
        game.world.setBounds(0, 0, simulator.settings.width, simulator.settings.height);

        // create map
        this.createZigZagMap();

        // create gui
        simulator.gui = new GUI();

        // create owner
        simulator.farm.owner = new Owner();
    },

    createZigZagMap : function() {
        //tiles groups
        var groundGroup = game.add.group();
        var foodStorageGroup = game.add.group();
        var incubatorGroup = game.add.group();
        var pavilionGroup = game.add.group();
        var cageGroup = game.add.group();
        var slaughterhouseGroup = game.add.group();
        var carcassStorageGroup = game.add.group();
        var furStorageGroup = game.add.group();

        var tile, offset;

        // draw background
        var background = game.add.sprite(0, 0, 'background', 0, groundGroup);
        background.inputEnabled = true;
        background.input.useHandCursor = true;

        // draw map procedurally
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
                    var pavilion_back = game.add.sprite(x, y, 'pavilion_back', 0, pavilionGroup);
                    pavilion_back.anchor.set(0.25, 0.91);

                    var pavilion_front = new Pavilion(game, x, y, 'pavilion_front', 0, pavilionGroup);
                    simulator.farm.pavilions.push(pavilion_front);
                    pavilion_front.anchor.set(0.25, 0.91);
                }

                if(index == 4) {
                    tile = game.add.sprite(x, y, 'box', 0);
                    tile.anchor.set(0.5, 0);
                }

                if(index == 50) {
                    var slaughterhouse_back = game.add.sprite(x, y, 'slaughterhouse_back', 0, slaughterhouseGroup);
                    slaughterhouse_back.anchor.set(0, 0);
                }

                if(index == 5) {
                    var slaughterhouse_front = new Slaughterhouse(game, x, y, 'slaughterhouse_front', 0, slaughterhouseGroup);
                    simulator.farm.slaughterhouse = slaughterhouse_front;
                    slaughterhouse_front.anchor.set(1);
                }

                if(index == 6) {
                    tile = new KillingStation(game, x, y, 'killing_robot', 0, slaughterhouseGroup);
                    simulator.farm.killingStations.push(tile);
                    tile.anchor.set(0.5);
                }

                if(index == 7) {
                    tile = new SkinningStation(game, x, y, 'skinning_robot', 0, slaughterhouseGroup);
                    simulator.farm.skinningStations.push(tile);
                    tile.anchor.set(0.5);
                }

                if(index == 8) {
                    var furStorage = new FurStorage(game, x, y, 'storage', 0, furStorageGroup);
                    simulator.farm.furStorage = furStorage;
                    furStorage.anchor.set(0.5);
                }

                if(index == 81) {
                    tile = game.add.sprite(x, y, 'furs', 0, furStorageGroup);
                    tile.anchor.set(0.5);
                }

                if(index == 9) {
                    var carcassStorage = new CarcassStorage(game, x, y, 'carcass', 0, carcassStorageGroup);
                    simulator.farm.carcassStorage = carcassStorage;
                    carcassStorage.anchor.set(0.5);
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
        // control camera by dragging the map
        if (game.input.activePointer.isDown) {
            if (game.draggingPoint) {
                // drag the camera by the amount the pointer has moved since last update
                game.camera.x += game.draggingPoint.x - game.input.activePointer.position.x;
            }
            // set new drag origin to current position
            game.draggingPoint = game.input.activePointer.position.clone();
        } else {
            game.draggingPoint = null;
        }
    }
};