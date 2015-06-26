function DescNumberSort(a, b) {
  return (parseInt(b) - parseInt(a));
}

var Header = React.createClass({
  render: function () {
    return (
      <header className="bar bar-nav">
        <a href="#" onClick={function () { window.history.go(-1); return(false); }}
          className={"icon icon-arrow-left2 pull-left" + (this.props.back === "true" ? "" : " hidden")}>
        </a>
        <h1 className="title">{this.props.text}</h1>
      </header>
    );
  }
});

var Navigation = React.createClass({
  render: function () {
    var tab = this.props.tab;

    return (
      <nav className="bar bar-tab">
        <a onClick={function () { actions.changeTab('explore'); }}
          className={'tab-item' + (tab == 'explore' ? ' active' : '')}>
          <span className="icon icon-location"></span>
          <span className="tab-label">Explore</span>
        </a>
        <a onClick={function () { actions.changeTab('search'); }}
          className={'tab-item' + (tab == 'search' ? ' active' : '')}>
          <span className="icon icon-search"></span>
          <span className="tab-label">Search</span>
        </a>
        <a onClick={function () { actions.changeTab('favorites'); }}
          className={'tab-item' + (tab == 'favorites' ? ' active' : '')}>
          <span className="icon icon-bookmark"></span>
          <span className="tab-label">Saves</span>
        </a>
        <a onClick={function () { actions.changeTab('home'); }}
          className={'tab-item' + (tab == 'home' ? ' active' : '')}>
          <span className="icon icon-clock"></span>
          <span className="tab-label">Perks</span>
        </a>
      </nav>
    );
  }
});

var SearchBar = React.createClass({
  componentDidMount: function () {
    if (this.props.filterized)
      React.findDOMNode(this.refs.searchKey).focus();
  },

  searchHandler: function () {
    this.props.searchHandler(React.findDOMNode(this.refs.searchKey).value);
  },

  render: function () {
    return (
      <div className="bar bar-standard bar-header-secondary">
        <input type="search"
          ref="searchKey"
          onChange={this.searchHandler}
          placeholder="Search place"
        />
      </div>
    );
  }
});

var MessageBox = React.createClass({
  componentDidMount: function () {
    React.findDOMNode(this.refs.from).focus();
  },

  submitHandler: function () {
    this.props.deliveryHandler(
      React.findDOMNode(this.refs.from).value,
      React.findDOMNode(this.refs.to).value,
      React.findDOMNode(this.refs.message).value
    );
    return false;
  },

  closeHandler: function () {
    this.props.closeHandler();
    return false;
  },

  render: function () {
    return (
      <div className="bar bar-standard bar-message">
        <button
          className="btn btn-link pull-right"
          onClick={this.closeHandler}>
          <span className="icon icon-cross"></span>
        </button>
        <h1 className="title">{`To: ${this.props.to}`}</h1>
        <form onSubmit={this.submitHandler}>
          <input type="text" ref="from" placeholder="Your Name" />
          <input type="hidden" ref="to" value="1" />
          <p><small>* Please include the best way to contact you</small></p>
          <textarea rows="3" ref="message" placeholder="Your Message*"></textarea>
          <button className="btn btn-primary btn-block">
            Send Message
          </button>
        </form>
      </div>
    );
  }
});

var BizListItem = React.createClass({
  render: function () {
    var biz = this.props.biz,
        saved = this.props.saved,
        hasPerk = this.props.hasPerk;

    return (
      <li className="table-view-cell media">
        <a href={"#biz/" + biz.id} className="navigate-right">
          <span className="badge">{biz.distance + ' mi'}</span>
          <img className="media-object small pull-left"
            src={"img/biz" + biz.id + '.jpg'} />
          <div className="media-body">
            <span>{biz.name}</span>
            <p>{biz.address}<br />{biz.city}</p>
            <p>
              <button className={"btn" + (saved ? ' btn-positive' : '') }
                onClick={function () { actions.toggleSave(biz.id); return(false); }}>
                <span className="icon icon-bookmark"></span> {saved ? 'Member' : 'Save'}
              </button>
              {hasPerk &&
                <span className="icon icon-clock"></span>
              }
            </p>
          </div>
        </a>
      </li>
    );
  }
});

var PerkListItem = React.createClass({
  render: function () {
    var perk = this.props.perk,
        perkImage = '/img/perk' + perk.id + '.jpg';

    return (
      <li className="table-view-cell media">
        <a href={'#perk/' + perk.id} className="navigate-right">
          <img className="media-object pull-left small" src={perkImage} />
          <div className="media-body">
            <p className="when"><small>
              <span className="badge">{perk.kind}</span>
              &nbsp;
              {perk.when}
            </small></p>
            <span>{perk.name}</span>
            <p>{perk.description}</p>
          </div>
          <div className="media-footer">
            <p><small>{perk.details}</small></p>
            {perk.kind == 'Birthday' &&
              <p><small>If there's anything we can do to make your celebration better please contact us!</small></p>
            }
          </div>
        </a>
      </li>
    );
  }
});

var BizList = React.createClass({
  render: function () {
    var _this = this;
    var items = this.props.businesses.map(function (biz) {
          return (
            <BizListItem
              key={biz.id}
              biz={biz}
              saved={store.favorites.indexOf(biz.id) !== -1}
              hasPerk={biz.id == 1}
            />
          );
        });

    return (
      <ul className="table-view">
        {items}
      </ul>
    );
  }
});

var BizPage = React.createClass({
  getInitialState: function () {
    return ({
      biz: null,
      showContact: false,
      showMessage: false
    });
  },

  toggleContact: function () {
    this.setState({ showContact: !this.state.showContact });
  },

  toggleMessage: function () {
    this.setState({ showMessage: !this.state.showMessage });
  },

  sendMessage: function () {
    actions.sendMessage();
    this.toggleMessage();
    return false;
  },

  componentWillMount: function () {
    var _this = this;

    bizService.findById(this.props.bizId).done(function (result) {
      _this.setState({ biz: result });
    });

    store.on('change:favorites', function (favorites) {
      _this.setState({});
    });
  },

  render: function () {
    var biz = this.state.biz,
        bizImage = '/img/biz' + biz.id + '.jpg',
        bizLogo = '/img/logo' + biz.id + '.png',
        headerStyle = {
          backgroundImage: 'url(' + bizImage + ')'
        },
        saved = store.favorites.indexOf(biz.id) !== -1;
    return (
      <div className={"page " + this.props.position}>
        <header className="bar bar-tall" style={headerStyle}>
          <a href="#" className="icon icon-arrow-left2 pull-left"></a>

          <button className={"pull-right btn btn-primary" + (saved ? ' btn-positive' : '') }
            onClick={function () { actions.toggleSave(biz.id); return(false); }}>
            <span className="icon icon-bookmark"></span> {saved ? 'Member' : 'Save'}
          </button>

          <div className="logo-container">
            <img className="logo" src={bizLogo} />
          </div>
        </header>

        {this.state.showMessage &&
          <MessageBox
            to={biz.name}
            deliveryHandler={this.sendMessage}
            closeHandler={this.toggleMessage}
          />
        }

        <div className="content">
          <ul className="table-view no-nav">
            <li className="table-view-cell centered">
              <br />
              <h1>{biz.name}</h1>
              <p><small>{biz.address} &ndash; {biz.city}</small></p>
              <br />
              <p>Great classic cocktails and a genuine appreciation for Houston’s past, present and future.</p>
            </li>
            <li className="table-view-cell centered">
              <p><small>
                  Questions or to book a party &ndash; Contact Us
              </small></p>
              <p>
                <button
                  className="btn btn-circle"
                  onClick={this.toggleMessage}>
                  <span className="icon icon-bubbles2"></span>
                </button>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <button
                  className="btn btn-circle"
                  onClick={this.toggleContact}>
                  <span className="icon icon-phone"></span>
                </button>
              </p>
            </li>
          </ul>

          {this.state.showContact &&
            <div className="card">
              <ul className="table-view no-nav">
                <li className="table-view-cell media">
                  <span className="media-object pull-left icon icon-phone"></span>
                  <div className="media-body">
                    <p>
                      <a href="tel:713-222-3333">(832) 564-0918</a>
                    </p>
                  </div>
                </li>
                <li className="table-view-cell media">
                  <span className="media-object pull-left icon icon-envelop"></span>
                  <div className="media-body">
                    <p>
                      <a href="mailto:social@deansdowntown.com">social@deansdowntown.com</a>
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          }

          {!saved &&
            <div className="card">
              <ul className="table-view no-nav">
                <li className="table-view-cell">
                  <p>Save us and get members only perks from Dean's Downtown!</p>
                </li>
              </ul>
            </div>
          }

          {saved && Object.keys(store.perks).length === 0 &&
            <div className="card">
              <ul className="table-view no-nav">
                <li className="table-view-cell">
                  <p>New Perks Coming Soon.</p>
                </li>
              </ul>
            </div>
          }

          {saved && Object.keys(store.perks).length > 0 &&
            ['Event', 'On-Going', 'Birthday'].map(function (kind) {
            const perkIds = Object.keys(store.perks)
                            .sort(DescNumberSort)
                            .filter(function (id) {
                              const perk = store.perks[id];
                              return (perk.bizId == biz.id && perk.kind == kind);
                            });
            return (
              <div className="card">
                <ul className="table-view top-nav">
                  {perkIds.map(function (id) {
                    return <PerkListItem perk={store.perks[id]} />;
                  })}
                </ul>
              </div>
            );
          })}

          <div className="card">
            <ul className="table-view no-nav">
              <li className="table-view-cell">
                <img className="media-object pull-left big" src={bizImage} />
                <img className="media-object pull-left big" src={bizImage} />
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
});

var PerkPage = React.createClass({
  getInitialState: function () {
    return ({
      biz : null,
      started: false,
      completed: false
    });
  },

  componentWillMount: function () {
    var _this = this,
        perk = this.props.perk;

    bizService.findById(this.props.perk.bizId).done(function (result) {
      _this.setState({ biz: result });
    });

    this.setState({ started: perk.startIn === 0 ? true : false });
    this.setState({ completed: perk.duration === 0 ? true : false });

    store.on('change:perks', function (perks) {
      _this.setState({ started: perks[perk.id].startIn === 0 ? true : false });
      _this.setState({ completed: perks[perk.id].duration === 0 ? true : false });
    });
  },

  render: function () {
    var perk = this.props.perk,
        biz = this.state.biz,
        perkImage = '/img/perk' + perk.id + '.jpg';

    return (
      <div className={"page " + this.props.position}>
        <Header text={perk.name} back="true" />
        <div className="content">
          <div className="content-padded centered">
            <h5>{biz.name}</h5>
            <p><img src={perkImage} style={{ width: '50%' }} /></p>

            {!this.state.started && perk.kind == 'Birthday'  &&
              <div>
                <br />
                <h4>Happy Birtday!</h4>
                <h5><span className="badge">{perk.when}</span></h5>
                <p>{perk.description}</p>
                <p>{perk.details}</p>
                <h5>&mdash; Starts In &mdash;</h5>
                <br />
                <h2>
                  <CountdownTimer
                    initialTimeRemaining={perk.startIn * 1000}
                    completeCallback={function () { actions.startPerk(perk.id); }}
                  />
                </h2>
              </div>
            }

            {!this.state.started && perk.kind == 'Event'  &&
              <div>
                <br />
                <h4>{perk.name}</h4>
                <h5><span className="badge">{perk.when}</span></h5>
                <p>{perk.details}</p>

                <h5>&mdash; Starts In &mdash;</h5>
                <br />
                <h2>
                  <CountdownTimer
                    initialTimeRemaining={perk.startIn * 1000}
                    completeCallback={function () { actions.startPerk(perk.id); }}
                  />
                </h2>
              </div>
            }
            {!this.state.started && perk.kind == 'On-Going' &&
              <div>
                <br />
                <h4>{"Get " + perk.name}</h4>
                <h5><span className="badge">{perk.when}</span></h5>
                <p>{perk.details}</p>

                <br />
                <button className="btn btn-block btn-primary"
                    onClick={function () { actions.startPerk(perk.id); }}>
                  {"Start Your "+ perk.name + " Now"}
                </button>
              </div>
            }
            {this.state.started && !this.state.completed &&
              <div>
                <br />
                <h4>{perk.name + " In Progress"}</h4>
                <p>{perk.details}</p>
                <h5>&mdash; For The Next &mdash;</h5>
                <h1 className="text-positive text-big">
                  <CountdownTimer
                    initialTimeRemaining={perk.duration * 1000}
                    completeCallback={function () { actions.endPerk(perk.id); }}
                  />
                </h1>
              </div>
            }
            {this.state.completed &&
              <div>
                <p>Perk has ended</p>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
});

var SearchPage = React.createClass({
  getInitialState: function () {
    return({ businesses: [] });
  },

  componentDidMount: function () {
    var _this = this;

    if (!this.props.filterized) {
      _this.props.service.findAll().done(function (results) {
        _this.setState({ businesses: results });
      });
    }
  },

  searchHandler: function (key) {
    this.props.service.findByName(key).done(function (result) {
      this.setState({searchKey: key, businesses: result});
    }.bind(this));
  },

  render: function () {
    return (
      <div>
        <Header text={this.props.filterized ? 'Find a Place' : 'Explore Places'} back="false" />
        <SearchBar
          searchHandler={this.searchHandler}
          {...this.props}
        />
        <Navigation tab={this.props.tab} />
        <div className="content">
          <BizList
            businesses={this.state.businesses}
            {...this.props}
          />
        </div>
      </div>
    );
  }
});

var FavoritesPage = React.createClass({
  getInitialState: function () {
    return({ businesses: [] });
  },

  componentDidMount: function () {
    var _this = this;

    this.props.service.findByIds(store.favorites).done(function (results) {
      _this.setState({ businesses: results });
    });

    store.on('change:favorites', function (favorites) {
      _this.props.service.findByIds(favorites).done(function (results) {
        _this.setState({ businesses: results });
      });
    });
  },

  render: function () {
    return (
      <div>
        <Header text="Favorite Places" back="false" />
        <Navigation tab={this.props.tab} />
        <div className="content">
          {this.state.businesses.length === 0 &&
            <div className="content-padded">
              <br />
              <h4 className="centered">No favorite place saved yet.</h4>
              <br />
              <p className="centered">
                <span
                  className="icon icon-search"
                  style={{fontSize:100,color:'#ddd'}}>
                </span>
              </p>
              <br />
              <br />
              <button
                className="btn btn-block btn-primary btn-outlined"
                onClick={function () { actions.changeTab('search'); }}>
                Find Your Favorite Places
              </button>
            </div>
          }
          {this.state.businesses.length > 0 &&
            <BizList businesses={this.state.businesses} />
          }
        </div>
      </div>
    );
  }
});

var HomePage = React.createClass({
  render: function () {
    var perkIds = Object.keys(store.perks)
                        .sort(DescNumberSort)
                        .map(function (id) { return(parseInt(id)); })
                        .filter(function (id) {
                          return (store.favorites.indexOf(store.perks[id].bizId) !== -1);
                        }),
        biz = {};

    // populate biz
    bizService.findByIds(perkIds).done(function (results) {
      results.forEach(function (b) { biz[b.id] = b; });
    });

    if (store.intro) return (
      <div className="content bg-dark">
        <div className="content-padded">
          <br />
          <h1 className="centered">
            InstaPerk
          </h1>
          <h5 className="centered">
            Perks from places<br />you love
          </h5>
          <br />
          <p className="centered">
            <span
              className="icon icon-bookmark"
              style={{fontSize:100,color:'#ddd'}}>
            </span>
          </p>
          <br />
          <br />
          <br />
          <button
            className="btn btn-block btn-primary btn-outlined"
            onClick={function () { actions.changeTab('explore'); }}>
            Start Here
          </button>
        </div>
      </div>
    );

    if (!store.intro && perkIds.length === 0) return (
      <div>
        <Header text={store.intro ? 'InstaPerk' : 'My Perks'} back="false" />
        <div className="content">
          <div className="content-padded">
            <br />
            <h4 className="centered">New Perks for You Coming Soon.</h4>
            <br />
            <p className="centered">
              <span
                className="icon icon-clock"
                style={{fontSize:100,color:'#ddd'}}>
              </span>
            </p>
            <br />
            <br />
            <button
              className="btn btn-block btn-primary btn-outlined"
              onClick={function () { actions.changeTab('explore'); }}>
              Find and Save More Places
            </button>
          </div>
        </div>
        <Navigation tab={this.props.tab} />
      </div>
    );

    if (!store.intro && perkIds.length > 0) return (
      <div>
        <Header text={store.intro ? 'InstaPerk' : 'My Perks'} back="false" />
        <div className="content">
          <div className="content-padded">
            <ul className="table-view">
              <li className="table-view-cell table-view-divider">
                Dean's Downtown
              </li>
              {perkIds.map(function (id) {
                return (
                  <PerkListItem perk={store.perks[id]} />
                )
              })}
            </ul>
          </div>
        </div>
        <Navigation tab={this.props.tab} />
      </div>
    );
  }
});

var MainPage = React.createClass({
  getInitialState: function () {
    return({
      tab: store.tab,
      favorites: store.favorites,
      perks: store.perks
    });
  },

  componentDidMount: function () {
    var _this = this;

    store.on('change:tab', function (tab) {
      _this.setState({ tab: tab });
    });

    store.on('change:favorites', function (favorites) {
      _this.setState({ favorites: favorites });
    });

    store.on('change:perks', function (perks) {
      _this.setState({ perks: perks });
    });
  },

  render: function () {
    var tab = this.state.tab;

    return (
      <div className={"page " + this.props.position}>
        {tab == 'home' &&
          <HomePage
            service={bizService}
            {...this.state}
          />
        }
        {tab == 'explore' &&
          <SearchPage service={bizService}
            {...this.state}
          />
        }
        {tab == 'search' &&
          <SearchPage service={bizService}
            filterized
            {...this.state}
          />
        }
        {tab == 'favorites' &&
          <FavoritesPage service={bizService}
            {...this.state}
          />
        }
      </div>
    );
  }
});


var App = React.createClass({
  mixins: [PageSlider],

  componentDidMount: function () {
    router.addRoute('', function () {
      this.slidePage(<MainPage key="main" />);
    }.bind(this));
    router.addRoute('biz/:id', function (id) {
      this.slidePage(<BizPage {...this.state} key={"biz" + id} bizId={id} />);
    }.bind(this));
    router.addRoute('perk/:id', function (id) {
      var perk = store.perks[id];
      this.slidePage(<PerkPage {...this.state} key={"perk" + id} perk={perk} />);
    }.bind(this));
    router.start();
  }
});

React.render(
  <App />, document.getElementById('app')
);
