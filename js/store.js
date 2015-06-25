var notify = function (message) {
  $('#message').text(message);
  $('#notification').show();
  setTimeout(function () {
    $('#notification').hide(function () {
      $('#message').text('');
    });
  }, 6000);
}

var store = fluxify.createStore({
  id: 'store',

  initialState: {
    intro: true,
    tab: 'home',
    favorites: [],
    perks: {
      1: {
        id: 1,
        bizId: 1,
        kind: "On-Going",
        when: "Sun - Thu, 5pm - 2am",
        name: 'Insta Hour',
        description: "On Demand Happy Hour.",
        details: "Get 50% off drinks $10 and under.",
        startIn: 20,
        duration: 3600
      },
      2: {
        id: 2,
        bizId: 1,
        kind: "Event",
        when: "Fri, Jul 11th, 5pm - 10pm",
        name: 'New Draught Cocktail',
        description: "Be The First To Try Our New Draught Cocktail.",
        details: "The Easy Credit Mule, Cucumber Serrano Infused Vodka, Fresh Lime Juice, House Made Ginger Beer. Get A Complimentary Easy Credit Mule.",
        startIn: 25 * 24 * 3600 + 17 * 3600,
        duration: 5 * 3600
      },
      3: {
        id: 3,
        bizId: 1,
        kind: "Birthday",
        when: "Oct 1st - Oct 14th",
        name: 'Happy Early Birthday',
        description: "Stop by and get any two appetizers on us!",
        details: "Just show this screen to your server.",
        startIn: 24 * 3600,
        duration: 5 * 3600
      }
    }
  },

  actionCallbacks: {
    changeTab: function (updater, tab) {
      if (store.intro)
        updater.set({ intro: false });
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
      var _perks = $.extend(true, {}, store.perks);
      _perks[id].startIn = 0;
      updater.set({ perks: _perks });
      notify(_perks[id].name + ' has started.');
    },

    endPerk: function (updater, id) {
      var _perks = $.extend(true, {}, store.perks);
      _perks[id].startIn = 25 * 60 * 60;
      _perks[id].duration = 30;
      updater.set({ perks: _perks });
      notify(_perks[id].name + ' has ended.');
    },

    sendMessage: function (updater) {
      notify('Thanks for sending us a message! We\'ll get back to you as soon as possible.');
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
  },

  sendMessage: function () {
    fluxify.doAction('sendMessage');
  }
};
