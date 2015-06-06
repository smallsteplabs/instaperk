var Header = React.createClass({
  render: function () {
    return (
      <header className="bar bar-nav">
        <a href="#" className={"icon icon-left-nav pull-left" + (this.props.back === "true" ? "" : " hidden")}></a>
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
        <a onClick={function () { actions.changeTab('home') }}
          className={'tab-item' + (tab == 'home' ? ' active' : '')}>
          <span className="icon icon-home"></span>
          <span className="tab-label">Home</span>
        </a>
        <a onClick={function () { actions.changeTab('search') }}
          className={'tab-item' + (tab == 'search' ? ' active' : '')}>
          <span className="icon icon-search"></span>
          <span className="tab-label">Search</span>
        </a>
        <a onClick={function () { actions.changeTab('favorites') }}
          className={'tab-item' + (tab == 'favorites' ? ' active' : '')}>
          <span className="icon icon-star-filled"></span>
          <span className="tab-label">Favorites</span>
        </a>
      </nav>
    );
  }
});

var SearchBar = React.createClass({
  searchHandler: function () {
    this.props.searchHandler(this.refs.searchKey.getDOMNode().value);
  },  

  render: function () {
    return (
      <div className="bar bar-standard bar-header-secondary">
        <input type="search" ref="searchKey" onChange={this.searchHandler}/>
      </div>
    );
  }   
});

var BizListItem = React.createClass({
  render: function () {
    var biz = this.props.biz,
        saved = this.props.saved,
        hasPerk = this.props.hasPerk;
        showRedeemButton = this.props.showRedeemButton;

    return (
      <li className="table-view-cell media">
        <a href="#biz" className="navigate-right">
          <img className="media-object small pull-left"
            src={"img/biz" + biz.id + '.jpg'} />
          <div className="media-body">
            {hasPerk &&
              <span className="badge badge-positive pull-right">
                <CountdownTimer initialTimeRemaining={6000000} />
              </span>
            }
            {biz.name}
            <p className="normal">
              {biz.address}
            </p>
            <p>
              <button className={"btn btn-outlined" + (saved ? ' btn-positive' : '') }
                onClick={function () { actions.toggleSave(biz.id); return(false); }}>
                <span className={"icon icon-star" + (saved ? '-filled' : '')}></span> {saved ? 'saved' : 'save'}
              </button>
              {showRedeemButton &&
                <span>&nbsp;
                  <button className="btn btn-primary"
                    onClick={function () { $('#perk').addClass('active'); return(false); }}>
                    <span className="icon icon-download"></span> redeem
                  </button>
                </span>
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
    var showRedeemButton = typeof this.props.showRedeemButton !== 'undefined';
    var items = this.props.businesses.map(function (biz) {
          return (
            <BizListItem
              key={biz.id}
              biz={biz}
              saved={store.favorites.indexOf(biz.id) !== -1}
              hasPerk={store.perks.indexOf(biz.id) !== -1}
              showRedeemButton={showRedeemButton}
            />
          )
        });

    return (
      <ul className="table-view">
        {items}
      </ul>
    );
  }
});

var BizPage = React.createClass({
  render: function () {
    var biz = this.props.biz;
    return (
      <div className={"page " + this.props.position}>
        <Header text="Dean's Downtown" back="true" />
        <div className="content">
        </div>
      </div>
    );
  }
});

var SearchPage = React.createClass({
  getInitialState: function () {
    return {businesses: []}
  },

  componentDidMount: function () {
    var _this = this;

    this.props.service.findAll().done(function (results) {
      _this.setState({searchKey: '', businesses: results});
    });
  },

  searchHandler: function (key) {
    this.props.service.findByName(key).done(function (result) {
      this.setState({searchKey: key, businesses: result});
    }.bind(this));
  }, 

  render: function () {
    return (
      <div>
        <Header text="Find Places" back="false" />
        <SearchBar searchHandler={this.searchHandler} />
        <Navigation tab={this.props.tab} />
        <div className="content">
          <BizList businesses={this.state.businesses} />
        </div>
      </div>
    );
  }
});

var FavoritesPage = React.createClass({
  getInitialState: function () {
    return { businesses: [] }
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
          {this.state.businesses.length == 0 &&
            <div className="content-padded">
              <h6 style={{textAlign:'center'}}>You haven't chosen your favorite places yet.</h6>
              <p style={{textAlign:'center'}}>
                <span className="icon icon-search" style={{fontSize:100,color:'#ddd'}}></span>
              </p>
              <button
                className="btn btn-block btn-primary btn-outlined"
                onClick={function () { actions.changeTab('search') }}>
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
    return { businesses: [] }
  },

  componentDidMount: function () {
    var _this = this;

    if (store.perks.length > 0) {
      _this.props.service.findByIds(store.favorites.filter(function (id) {
        return store.perks.indexOf(id) > -1
      })).done(function (results) {
        _this.setState({ businesses: results });
      });

      store.on('change:favorites', function (favorites) {
        _this.props.service.findByIds(favorites.filter(function (id) {
          return store.perks.indexOf(id) > -1
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
        <Header text={_new ? 'Instaperk' : 'My Feed'} back="false" />
        <div className="content">
          {this.state.businesses.length == 0 && _new &&
            <div className="content-padded">
              <h2 className="centered">
                Instaperk notifies perks from places you love.
              </h2>
              <p style={{textAlign:'center'}}>
                <span className="icon icon-star-filled" style={{fontSize:100,color:'#ddd'}}></span>
              </p>
              <button
                className="btn btn-block btn-primary btn-outlined"
                onClick={function () { actions.changeTab('search') }}>
                Find Your Favorite Places
              </button>
            </div>
          }
          {this.state.businesses.length == 0 && !_new &&
            <div className="content-padded">
              <h5 style={{textAlign:'center'}}>No favorite place with running perks.</h5>
              <p style={{textAlign:'center'}}>
                <span className="icon icon-search" style={{fontSize:100,color:'#ddd'}}></span>
              </p>
              <button
                className="btn btn-block btn-primary btn-outlined"
                onClick={function () { actions.changeTab('search') }}>
                Find More Places
              </button>
            </div>
          }
          {this.state.businesses.length > 0 &&
            <BizList businesses={this.state.businesses} showRedeemButton={true} />
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
    return {
      tab: store.tab,
      favorites: store.favorites,
      perks: store.perks
    }
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
            new={this.state.favorites.length == 0}
            {...this.state}
          />
        }
        {tab == 'search' &&
          <SearchPage service={bizService}
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
    router.addRoute('biz', function () {
      this.slidePage(<BizPage {...this.state} key="biz" />);
    }.bind(this));
    router.start();
  }
});

React.render(
  <App />, document.getElementById('app')
);
