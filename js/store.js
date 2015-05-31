var store = fluxify.createStore({
  id: 'store',
  initialState: {
    tab: 'search'
  },
  actionCallbacks: {
    changeTab: function (updater, tab) {
      updater.set({ tab: tab });
    }
  }
});

var actions = {
  changeTab: function (tab) {
    fluxify.doAction('changeTab', tab);
  }
}
