var notify = function (message) {
  $('#message').text(message);
  $('#notification').show('fast');
  setTimeout(function () {
    $('#notification').hide('fast', function () {
      $('#message').text('');
    });
  }, 4000);
}

var store = fluxify.createStore({
  id: 'store',

  initialState: {
    tab: 'home',
    favorites: [],
    perks: [{
      id: 1,
      bizId: 1,
      name: 'Insta Hour',
      description: "On Demand Happy Hour.<br />Get 50% off drinks $10 and under.<br />Sunday 5pm - 2am<br />Tuesday 5pm - 2am<br />Wednesday 5pm - 2am<br />Thursday  5pm - 2am ",
      startIn: 20,
      duration: 3600 
    }]
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
    },

    startPerk: function (updater, id) {
      var _perks = store.perks.slice();
      _perks[0].startIn = 0;
      updater.set({ perks: _perks });
      notify(_perks[0].name + ' has started.');
    },

    endPerk: function (updater, id) {
      var _perks = store.perks.slice();
      _perks[0].startIn = 25 * 60 * 60;
      _perks[0].duration = 30;
      updater.set({ perks: _perks });
      notify(_perks[0].name + ' has ended.');
    }
  }
});

var actions = {
  changeTab: function (tab) {
    fluxify.doAction('changeTab', tab);
  },

  toggleSave: function (id) {
    fluxify.doAction('toggleSave', id);
  },

  startPerk: function (id) {
    fluxify.doAction('startPerk', id);
  },

  endPerk: function (id) {
    fluxify.doAction('endPerk', id);
  }
};
