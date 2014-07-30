var Robin;
Robin = {
    ButtonMaker: {},
    Animator:{},
    Utils: {
        PubSub: {},
        API: {},
        extend: function (destination, source) {
            for (var property in source) {
                if (destination[property] === undefined) {
                    destination[property] = source[property];
                }
                if (destination[property] !== source[property]) {
                    destination[property] = source[property];
                }
            }
        },
        log: function (message) {
            if (Robin.Settings.logging) {
                console.log(message);
            }
        }
    },
    Core: {},
    Storage: {},
    PopOver:{},
    Query: {},
    Settings: {
        apikey: false,
        logging: false,
        popup: {}
    }
};

Robin.Utils.extend(Robin.Settings, robin_JSP_settings);

console.log(Robin);