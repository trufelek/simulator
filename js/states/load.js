var load = {
    init: function() {
        console.log('Init load state...');
    },

    preload: function() {
        //load images
        game.load.image('ground', 'img/ground.png');
        game.load.image('cage', 'img/cage.png');
        game.load.image('incubator', 'img/incubator.png');
        game.load.image('building_door', 'img/building_door.png');
        game.load.image('building_door_2', 'img/building_door_2.png');
        game.load.image('building_wall', 'img/building_wall.png');
        game.load.image('building_windows', 'img/building_windows.png');
        game.load.image('storage_door', 'img/storage_door.png');
        game.load.image('storage_wall', 'img/storage_wall.png');
        game.load.image('path', 'img/path.png');
        game.load.image('shadow', 'img/shadow.png');
    },

    create: function() {
        game.state.start('play');
    }
};