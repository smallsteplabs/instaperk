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
        <a onClick={function () { actions.changeTab('saves') }}
          className={'tab-item' + (tab == 'saves' ? ' active' : '')}>
          <span className="icon icon-star-filled"></span>
          <span className="tab-label">Saves</span>
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
        <img className="media-object small pull-left"
          src={"img/biz" + biz.id + '.jpg'} />
        <div className="media-body">
          {hasPerk &&
            <span className="badge badge-positive pull-right">-01:40</span>
          }
          {biz.name}
          <p className="normal">
            {biz.address}
          </p>
          <p>
            <button className={"btn btn-outlined" + (saved ? ' btn-positive' : '') }
              onClick={function () { actions.toggleSave(biz.id) }}>
              <span className={"icon icon-star" + (saved ? '-filled' : '')}></span> {saved ? 'saved' : 'save'}
            </button>
            {showRedeemButton &&
              <span>&nbsp;
                <button className="btn btn-primary"
                  onClick={function () { alert('Redeem Perk'); }}>
                  <span className="icon icon-download"></span> redeem
                </button>
              </span>
            }
          </p>
        </div>
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
              saved={store.saves.indexOf(biz.id) !== -1}
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
        <Header text="List of Biz" back="false" />
        <SearchBar searchHandler={this.searchHandler} />
        <div className="content">
          <BizList businesses={this.state.businesses} />
        </div>
      </div>
    );
  }
});

var SavesPage = React.createClass({
  getInitialState: function () {
    return { businesses: [] }
  },

  componentDidMount: function () {
    var _this = this;

    this.props.service.findByIds(store.saves).done(function (results) {
      _this.setState({ businesses: results });
    });

    store.on('change:saves', function (saves) {
      _this.props.service.findByIds(saves).done(function (results) {
        _this.setState({ businesses: results });
      });
    });
  },

  render: function () {
    return (
      <div>
        <Header text="Saved Businesses" back="false" />
        <div className="content">
          {this.state.businesses.length == 0 &&
            <div className="content-padded">
              <h6 style={{textAlign:'center'}}>You have no saved businesses yet.</h6>
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

var HomePage = React.createClass({
  getInitialState: function () {
    return { businesses: [] }
  },

  componentDidMount: function () {
    var _this = this;

    if (store.perks.length > 0) {
      _this.props.service.findByIds(store.saves.filter(function (id) {
        return store.perks.indexOf(id) > -1
      })).done(function (results) {
        _this.setState({ businesses: results });
      });

      store.on('change:saves', function (saves) {
        _this.props.service.findByIds(saves.filter(function (id) {
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
              <h2 style={{textAlign:'center'}}>
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
              <h5 style={{textAlign:'center'}}>No saved places with running perks.</h5>
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
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState: function () {
    return {
      tab: store.tab,
      saves: store.saves,
      perks: store.perks
    }
  },

  componentDidMount: function () {
    var _this = this;

    store.on('change:tab', function (tab) {
      _this.setState({ tab: tab });
    });

    store.on('change:saves', function (saves) {
      _this.setState({ saves: saves });
    });

    store.on('change:perks', function (perks) {
      _this.setState({ perks: perks });
    });
  },

  render: function () {
    var tab = this.state.tab;

    return (
      <div>
        {tab == 'home' &&
          <HomePage service={bizService} new={this.state.saves.length == 0} />
        }
        {tab == 'search' &&
          <SearchPage service={bizService} />
        }
        {tab == 'saves' &&
          <SavesPage service={bizService} />
        }
        <Navigation tab={tab} />
      </div>
    );
  }
});

React.render(
  <App />, document.body
);
