var store = fluxify.createStore({
  id: 'store',

  initialState: {
    tab: 'home',
    saves: [],
    perks: []
  },

  actionCallbacks: {
    changeTab: function (updater, tab) {
      updater.set({ tab: tab });
    },

    toggleSave: function (updater, id) {
      var _saves = store.saves.slice();
      var index = _saves.indexOf(id);

      if (index > -1) _saves.splice(index, 1); else _saves.push(id);
      updater.set({ saves: _saves });
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
