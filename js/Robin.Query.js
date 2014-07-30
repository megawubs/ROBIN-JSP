(function (self) {

    self.querys = {};

    self.getQueryStrings = function () {
        var queryStrings = {},
            query = window.location.search.substring(1),
            vars = query.split("&");

        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if (typeof queryStrings[pair[0]] === "undefined") {
                queryStrings[pair[0]] = pair[1];
            }
            else if (typeof queryStrings[pair[0]] === "string") {
                var arr = [ queryStrings[pair[0]], pair[1] ];
                queryStrings[pair[0]] = arr;
            }
            else {
                queryStrings[pair[0]].push(pair[1]);
            }
        }
        self.querys = queryStrings;
        return queryStrings;
    };

    self.hasRobinConversationID = function(){
        var value = Robin.Storage.getItem('robin_cnv');
        if(typeof value === 'string'){
            self.querys.rbn_cnv = value;
            return true;
        }
        return self.urlHasRobinConversationID();
    };

    self.urlHasRobinConversationID = function(){
        var querys = self.getQueryStrings();
        if(typeof querys.rbn_cnv !== 'undefined'){
            Robin.Utils.log('Found Robin query string');
            Robin.Storage.setItem('robin_cnv', querys.rbn_cnv);
            Robin.Utils.querys = querys;
        }
        else{
            Robin.Utils.log('No robin query string found.');
            return false;
        }
        return true;
    };

    return self;

})(Robin.Query);
