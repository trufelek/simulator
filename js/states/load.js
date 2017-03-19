var load = {
    init: function() {
        console.log('Init load state...');
    },

    preload: function() {
        //load images
        game.load.image('ground', 'img/ground.png');
        game.load.image('cage', 'img/cage.png');
        game.load.image('incubator', 'img/incubator.png');
        game.load.image('slaugther_house_wall', 'img/slaugther_house_wall.png');
        game.load.image('slaugther_house_windows', 'img/slaugther_house_windows.png');
        game.load.image('slaugther_house_door', 'img/slaugther_house_door.png');
        game.load.image('slaugther_house_door_2', 'img/slaugther_house_door_2.png');
        game.load.image('storage_door', 'img/storage_door.png');
        game.load.image('storage_wall', 'img/storage_wall.png');
        game.load.image('office_wall', 'img/office_wall.png');
        game.load.image('office_windows', 'img/office_windows.png');
        game.load.image('office_door', 'img/office_door.png');
    },

    create: function() {
        game.state.start('play');
    }
};