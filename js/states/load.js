var load = {
    init: function() {
        console.log('Init load state...');
    },

    preload: function() {
        //map elements
        game.load.image('ground', 'img/grid.png');
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
        game.load.image('office_door', 'img/office_door.png');

        // gui elements
        game.load.image('tooltip', 'img/gui/tooltip.png');
        game.load.image('tooltip_line', 'img/gui/line.png');
        game.load.image('bar', 'img/gui/bar.png');
        game.load.image('progress_bar', 'img/gui/progress.png');

        // icons
        game.load.image('clock_icon', 'img/icons/clock_icon.png');
        game.load.image('condition_icon', 'img/icons/condition_icon.png');
        game.load.image('food_icon', 'img/icons/food_icon.png');
    },

    create: function() {
        game.state.start('create');
    }
};