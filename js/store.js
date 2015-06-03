var notify = function (message) {
  $('#message').text(message);
  $('#notification').show('slow');
  setTimeout(function () {
    $('#notification').hide('slow', function () {
      $('#message').text('');
    });
  }, 4000);
}

var store = fluxify.createStore({
  id: 'store',

  initialState: {
    tab: 'home',
    favorites: [],
    perks: [1]
  },

  actionCallbacks: {
    changeTab: function (updater, tab) {
      updater.set({ tab: tab });
    },

    toggleSave: function (updater, id) {
      var _favorites = store.favorites.slice();
      var index = _favorites.indexOf(id);
      var saving = index == -1;;

      if (!saving) _favorites.splice(index, 1); else _favorites.push(id);
      updater.set({ favorites: _favorites });

      if (saving) {
        bizService.findById(id).done(function (biz) {
          notify('You will now be notified of perks from ' + biz.name);
        });
      }
    }
  }
});

var actions = {
  changeTab: function (tab) {
    fluxify.doAction('changeTab', tab);
  },

  toggleSave: function (id) {
    fluxify.doAction('toggleSave', id);
  }
}
