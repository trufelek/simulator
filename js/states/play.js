var play = {
    init: function() {
        console.log('Init play state...');
    },

    create: function() {
        // setup tiles map
        game.stage.backgroundColor = game.settings.background;

        groundGroup = game.add.group();
        cageGroup = game.add.group();
        incubatorGroup = game.add.group();
        slaugtherhouseGroup = game.add.group();
        officeGroup = game.add.group();
        storageGroup = game.add.group();

        var groundTile, cageTile, incubatorTile, slaughterhouseTile, officeTile, storageTile;

        var tiles = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 2, 0, 2, 0, 2, 0, 0, 0, 3, 5, 4, 5, 4, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 0,
            0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 8, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 0,
            0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 6, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 10, 6, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 6, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];

        var i = 0;

        for(var x = game.settings.width ; x > 0; x -= game.settings.grid) {
            for(var y = game.settings.width; y > 0; y -= game.settings.grid) {
                if(tiles[i] == 0) {
                    groundTile = game.add.isoSprite(x, y, 0, 'ground', 0, groundGroup);
                    groundTile.anchor.set(0.5);
                }

                if(tiles[i] == 1) {
                    cageTile = game.add.isoSprite(x, y, 0, 'cage', 0, cageGroup);
                    cageTile.anchor.set(0.5);
                }

                if(tiles[i] == 2) {
                    incubatorTile = game.add.isoSprite(x, y, 0, 'incubator', 0, incubatorGroup);
                    incubatorTile.anchor.set(0.5);
                }

                if(tiles[i] == 3) {
                    slaughterhouseTile = game.add.isoSprite(x, y, 0, 'building_door', 0, slaugtherhouseGroup);
                    slaughterhouseTile.anchor.set(0.5);
                }

                if(tiles[i] == 4) {
                    slaughterhouseTile = game.add.isoSprite(x, y, 0, 'building_wall', 0, slaugtherhouseGroup);
                    slaughterhouseTile.anchor.set(0.5);
                }

                if(tiles[i] == 5) {
                    slaughterhouseTile = game.add.isoSprite(x, y, 0, 'building_windows', 0, slaugtherhouseGroup);
                    slaughterhouseTile.anchor.set(0.5);
                }

                if(tiles[i] == 6) {
                    officeTile = game.add.isoSprite(x, y, 0, 'building_wall', 0, officeGroup);
                    officeTile.anchor.set(0.5);
                }

                if(tiles[i] == 7) {
                    officeTile = game.add.isoSprite(x, y, 0, 'building_door', 0, officeGroup);
                    officeTile.anchor.set(0.5);
                }

                if(tiles[i] == 8) {
                    storageTile = game.add.isoSprite(x, y, 0, 'storage_wall', 0, storageGroup);
                    storageTile.anchor.set(0.5);
                }

                if(tiles[i] == 9) {
                    storageTile = game.add.isoSprite(x, y, 0, 'storage_door', 0, storageGroup);
                    storageTile.anchor.set(0.5);
                }

                if(tiles[i] == 10) {
                    officeTile = game.add.isoSprite(x, y, 0, 'building_door_2', 0, officeGroup);
                    officeTile.anchor.set(0.5);
                }

                i++;
            }
        }

    },

    update: function() {
        // camera control
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

        // depth sort isometric grid
        game.iso.topologicalSort(slaugtherhouseGroup);
        game.iso.topologicalSort(officeGroup);
        game.iso.topologicalSort(storageGroup);
    },

    render: function() {
        game.debug.inputInfo(15, 25);
    }
};