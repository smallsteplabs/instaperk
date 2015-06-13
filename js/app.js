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
        <a onClick={function () { actions.changeTab('home'); }}
          className={'tab-item' + (tab == 'home' ? ' active' : '')}>
          <span className="icon icon-home3"></span>
          <span className="tab-label">Home</span>
        </a>
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
          placeholder="Enter Name"
        />
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
          <img className="media-object small pull-left"
            src={"img/biz" + biz.id + '.jpg'} />
          <div className="media-body">
            {biz.name}
            <p className="normal">
              {biz.address}
            </p>
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

var BizList = React.createClass({
  render: function () {
    var _this = this;
    var items = this.props.businesses.map(function (biz) {
          return (
            <BizListItem
              key={biz.id}
              biz={biz}
              saved={store.favorites.indexOf(biz.id) !== -1}
              hasPerk={store.perks[0].bizId == biz.id}
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
      showContact: false
    });
  },

  toggleContact: function () {
    this.setState({ showContact: !this.state.showContact });
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
        </header>

        <div className="content">
          <div className="card">
            <ul className="table-view no-nav">
              <li className="table-view-cell table-view-cell-divider">
                <button
                  className="pull-right btn btn-circle"
                  onClick={this.toggleContact}>
                  <span className="icon icon-phone"></span>
                </button>

                <h1>{biz.name}</h1>
                <p>{biz.address}</p>
              </li>
              <li className="table-view-cell media">
                <img className="media-object pull-left big" src={bizLogo} />
                <div className="media-body">
                  <p>Great classic cocktails and a genuine appreciation for Houston’s past, present and future.</p>
                </div>
              </li>
            </ul>
          </div>

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

          <div className="card">
            {biz.id == 1 && store.favorites.indexOf(biz.id) == -1 &&
              <ul className="table-view no-nav">
                <li className="table-view-cell">
                  <p>Save us and get members only perks from Dean's Downtown!</p>
                </li>
              </ul>
            }
            {biz.id == 1 && store.favorites.indexOf(biz.id) !== -1 &&
              <ul className="table-view no-nav">
                <li className="table-view-cell table-view-cell-divider">
                  <p>
                    <a href={"#/biz/" + biz.id + "/perk"} className="btn btn-block btn-primary">
                      <span className="icon icon-clock"></span> Start Insta Hour
                    </a>
                  </p>
                  <p dangerouslySetInnerHTML={{ __html: store.perks[0].description }} />
                </li>
              </ul>
            }
          </div>

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
    return ({ started: false, completed: false });
  },

  componentWillMount: function () {
    var _this = this;

    this.setState({ started: store.perks[0].startIn === 0 ? true : false });
    this.setState({ completed: store.perks[0].duration === 0 ? true : false });

    store.on('change:perks', function (perks) {
      _this.setState({ started: perks[0].startIn === 0 ? true : false });
      _this.setState({ completed: perks[0].duration === 0 ? true : false });
    });
  },

  render: function () {
    var perk = store.perks[0],
      bizImage = '/img/biz' + this.props.bizId + '.jpg',
      headerStyle = {
        backgroundImage: 'url(' + bizImage + ')'
      };

    return (
      <div className={"page " + this.props.position}>
        <Header text={perk.name} back="true" />
        <div className="content">
          <div className="content-padded centered">
            <img src="/img/logo1.png" style={{ width: '40%' }} />

            {!this.state.started &&
              <div>
                <h4>Get 50% all drinks $10 and under<br />in the next</h4>
                <br />
                <h3>
                  <CountdownTimer
                    initialTimeRemaining={perk.startIn * 1000}
                    completeCallback={function () { actions.startPerk(1); }}
                  />
                </h3>
              </div>
            }

            {this.state.started && !this.state.completed &&
              <div>
                <h4>Get 50% all drinks $10 and under<br />for the next</h4>
                <br />
                <h1 className="countdown text-positive">
                  <CountdownTimer
                    initialTimeRemaining={perk.duration * 1000}
                    completeCallback={function () { actions.endPerk(1); }}
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
              <h6 style={{textAlign:'center'}}>You haven't chosen your favorite places yet.</h6>
              <p style={{textAlign:'center'}}>
                <span className="icon icon-search" style={{fontSize:100,color:'#ddd'}}></span>
              </p>
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

var PerkModal = React.createClass({
  render: function () {
    return (
      <div id="perk" className="modal">
        <header className="bar bar-nav">
          <a className="icon icon-close pull-right"
            onClick={function () { $('#perk').removeClass('active'); }}>
          </a>
          <h1 className="title">Redeem a Perk</h1>
        </header>

        <div className="content">
          <img className="img img-responsive" src="img/perk1.jpg" />
          <div className="content-padded">
            <span className="badge badge-positive pull-right">
              <CountdownTimer initialTimeRemaining={6000000} />
            </span>
            <h4>
              Dean's Downtown
            </h4>
            <h3>
              Dean's Old Fashions 50% off
            </h3>
            <h4><strike>$6</strike> $3</h4>
            <div className="card">
              <div className="content-padded">
                <p>Show This When Making Your Purchase</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var HomePage = React.createClass({
  getInitialState: function () {
    return({ businesses: [] });
  },

  componentDidMount: function () {
    var _this = this;

    if (store.perks.length > 0) {
      _this.props.service.findByIds(store.favorites.filter(function (id) {
        return(store.perks[0].bizId == id);
      })).done(function (results) {
        _this.setState({ businesses: results });
      });

      store.on('change:favorites', function (favorites) {
        _this.props.service.findByIds(favorites.filter(function (id) {
          return(store.perks[0].bizId == id);
        })).done(function (results) {
          _this.setState({ businesses: results });
        });
      });
    }
  },

  render: function () {
    var _new = this.props.new;

    return (
      <div>
        <Header text={_new ? 'InstaPerk' : 'My Feed'} back="false" />
        <div className="content">
          {this.state.businesses.length === 0 && _new &&
            <div className="content-padded">
              <br />
              <h1 className="centered">
                Perks from places you love.
              </h1>
              <p style={{textAlign:'center'}}>
                <span className="icon icon-bookmark" style={{fontSize:100,color:'#ddd'}}></span>
              </p>
              <button
                className="btn btn-block btn-primary btn-outlined"
                onClick={function () { actions.changeTab('explore'); }}>
                Find Your Favorite Places
              </button>
            </div>
          }
          {this.state.businesses.length === 0 && !_new &&
            <div className="content-padded">
              <h5 style={{textAlign:'center'}}>No favorite place with running perks.</h5>
              <p style={{textAlign:'center'}}>
                <span className="icon icon-search" style={{fontSize:100,color:'#ddd'}}></span>
              </p>
              <button
                className="btn btn-block btn-primary btn-outlined"
                onClick={function () { actions.changeTab('search'); }}>
                Find More Places
              </button>
            </div>
          }
          {this.state.businesses.length > 0 &&
            <BizList businesses={this.state.businesses} />
          }
        </div>
        <Navigation tab={this.props.tab} />
        <PerkModal />
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
            new={this.state.favorites.length === 0}
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
    router.addRoute('/biz/:id/perk', function (id) {
      this.slidePage(<PerkPage {...this.state} key={"perk" + id} bizId={id} />);
    }.bind(this));
    router.start();
  }
});

React.render(
  <App />, document.getElementById('app')
);
