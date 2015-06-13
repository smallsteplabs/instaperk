bizService = (function() {
  var findById = function(id) {
    var deferred = $.Deferred(),
        biz = null;
        l = businesses.length;
    for (var i = 0; i < l; i++) {
      if (businesses[i].id == id) {
        biz = businesses[i];
        break;
      }
    }
    deferred.resolve(biz);
    return deferred.promise();
  },

  findByIds = function(ids) {
    var deferred = $.Deferred();
    var results = businesses.filter(function(biz) {
      return ids.indexOf(biz.id) > -1;
    });
    deferred.resolve(results);
    return deferred.promise();
  },

  findByName = function(searchKey) {
    var deferred = $.Deferred();
    var results = businesses.filter(function(biz) {
      return biz.name.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
    });
    deferred.resolve(searchKey ? results : []);
    return deferred.promise();
  },

  findAll = function() {
    var deferred = $.Deferred();
    deferred.resolve(businesses);
    return deferred.promise();
  },

  businesses = [
    { id: 1, name: "Dean's Downtown", address: "316 Main St, Houston, TX", distance: 0.1 },
    { id: 2, name: "Roma's Pizza", address: "233 Main St, Houston, TX", distance: 0.4 },
    { id: 3, name: "Fusion Taco", address: "801 Congress, Houston, TX", distance: 1.1 },
    { id: 4, name: "Frank's Pizza", address: "417 Travis St, Houston, TX", distance: 1.7 }
  ];

  // The public API
  return {
    findById: findById,
    findByIds: findByIds,
    findByName: findByName,
    findAll: findAll
  };

}());
