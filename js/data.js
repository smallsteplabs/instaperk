bizService = (function() {
  var findById = function(id) {
    var deferred = $.Deferred(),
        biz = null;
        l = businesses.length;
    for (var i = 0; i < l; i++) {
      if (bizs[i].id == id) {
        biz = bizs[i];
        break;
      }
    }
    deferred.resolve(biz);
    return deferred.promise();
  },

  findByName = function(searchKey) {
    var deferred = $.Deferred();
    var results = businesses.filter(function(biz) {
      console.log(biz.name);
      return biz.name.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
    });
    deferred.resolve(results);
    return deferred.promise();
  },

  findAll = function() {
    var deferred = $.Deferred();
    deferred.resolve(businesses);
    return deferred.promise();
  },

  businesses = [
    {id: 1, name: "Dean's Downtown", address: "316 Main St, Houston, TX"},
    {id: 2, name: "Roma's Pizza", address: "233 Main St, Houston, TX"},
    {id: 3, name: "Fusion Taco", address: "801 Congress, Houston, TX"},
    {id: 4, name: "Frank's Pizza", address: "417 Travis St, Houston, TX"}
  ];

  // The public API
  return {
    findById: findById,
    findByName: findByName,
    findAll: findAll
  };

}());
