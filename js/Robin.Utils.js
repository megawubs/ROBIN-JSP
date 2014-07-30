(function (self) {
    self.extend = function (destination, source) {
        for (var property in source) {
            if (destination[property] === undefined) {
                destination[property] = source[property];
            }
            if (destination[property] !== source[property]) {
                destination[property] = source[property];
            }
        }
    };

    self.log = function (message) {
        if (Robin.Settings.logging) {
            console.log(message);
        }
    };

    self.extend(Robin.Settings, robin_settings);
    self.extend(Robin, Robin.Utils.PubSub); //Give Robin pub/sub methods!
})(Robin.Utils);

