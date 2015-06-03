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
    saves: [1],
    perks: [1]
  },

  actionCallbacks: {
    changeTab: function (updater, tab) {
      updater.set({ tab: tab });
    },

    toggleSave: function (updater, id) {
      var _saves = store.saves.slice();
      var index = _saves.indexOf(id);
      var saving = index == -1;;

      if (!saving) _saves.splice(index, 1); else _saves.push(id);
      updater.set({ saves: _saves });

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
