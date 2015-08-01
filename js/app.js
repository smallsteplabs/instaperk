function DescNumberSort(a, b) {
  return (parseInt(b) - parseInt(a));
}

var Header = React.createClass({
  render: function () {
    return (
      <header className="bar bar-nav">
        <a href="#" onClick={function () { window.history.go(-1); return(false); }}
          className={"icon icon-left-nav pull-left" + (this.props.back === "true" ? "" : " hidden")}>
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
          <span className="icon icon-bookmark-o"></span>
          <span className="tab-label">Saves</span>
        </a>
        <a onClick={function () { actions.changeTab('home'); }}
          className={'tab-item' + (tab == 'home' ? ' active' : '')}>
          <span className="icon icon-chronometer"></span>
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
          placeholder="Search"
        />
        <span className="icon icon-search"></span>
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
          <span className="icon icon-close"></span>
        </button>
        <h1 className="title">{'To: ' + this.props.to}</h1>
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
      <li className="table-view-cell media media-card"
          style={{backgroundImage: 'url(img/biz'+ biz.id + '.jpg)'}}>
        <a href={"#biz/" + biz.id}>
          <div className="media-body">
            <div className="media-action">
              <button className={"pull-right btn" + (saved ? ' btn-positive' : '') }
                onClick={function (e) { e.preventDefault(); actions.toggleSave(biz.id); }}>
                <span className={"icon icon-bookmark" + (!saved ? '-o' : '')}>
                </span> {saved ? 'Member' : 'Save'}
              </button>
              {hasPerk &&
                <span className="icon icon-chronometer pull-right"></span>
              }
            </div>
            <h3>{biz.name}</h3>
            <p>{biz.address} &middot; <small>{biz.distance + ' mi'}</small></p>
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
      <ul className="table-view no-nav">
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
      showMessage: false,
      showCar: false
    });
  },

  toggleContact: function () {
    this.setState({ showContact: !this.state.showContact });
  },

  toggleMessage: function () {
    this.setState({ showMessage: !this.state.showMessage });
  },

  toggleCar: function () {
    this.setState({ showCar: !this.state.showCar});
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
          <a href="#" className="icon icon-left-nav pull-left"></a>

          <button className={"pull-right btn" + (saved ? ' btn-positive' : '') }
            onClick={function () { actions.toggleSave(biz.id); return(false); }}>
            <span className={"icon icon-bookmark" + (!saved? '-o' : '')}></span> {saved ? 'Member' : 'Save'}
          </button>

          <div className="logo-container centered">
            <div className="logo-overlay">
              <img className="logo" src={bizLogo} />
              <h1>{biz.name}</h1>
              <p><small>{biz.address} &ndash; {biz.city}</small></p>
              <p>
                <a
                  className="btn btn-link"
                  href={"#biz/" + biz.id + "/chat"}>
                  <span className="icon icon-chat"></span>
                </a>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <button
                  className="btn btn-link"
                  onClick={this.toggleContact}>
                  <span className="icon icon-phone"></span>
                </button>
                <span>&nbsp;</span>
                <span>&nbsp;</span>
                <button
                  className="btn btn-link"
                  onClick={this.toggleCar}>
                  <span className="icon icon-car"></span>
                </button>
                <br />
                <small>
                    Questions or to book a party &ndash; Contact Us
                </small>
              </p>
            </div>
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
          <ul className="table-view no-nav more-padding">
            <li className="table-view-cell centered">
              <p>Great classic cocktails and a genuine appreciation for Houston’s past, present and future.</p>
            </li>
          </ul>

          {this.state.showContact &&
            <ul className="table-view no-nav">
              <li className="table-view-cell media">
                <span className="media-object pull-left icon icon-phone-square"></span>
                <div className="media-body">
                  <p>
                    <a href="tel:713-222-3333">(832) 564-0918</a>
                  </p>
                </div>
              </li>
              <li className="table-view-cell media">
                <span className="media-object pull-left icon icon-envelope-square"></span>
                <div className="media-body">
                  <p>
                    <a href="mailto:social@deansdowntown.com">social@deansdowntown.com</a>
                  </p>
                </div>
              </li>
            </ul>
          }

          {this.state.showCar &&
            <ul className="table-view">
              <li className="table-view-cell table-view-divider">
                Choose Your Ride
              </li>
              <li className="table-view-cell media">
                <a href={"#biz/" + biz.id + "/car-request/uberX"}
                   className="navigate-right">
                  <span className="badge">4 mins</span>
                  <img src="img/uberX.jpg" className="media-object small natural pull-left" />
                  <div className="media-body">
                    uberX
                    <p>$5-6</p>
                  </div>
                </a>
              </li>
              <li className="table-view-cell media">
                <a href={"#biz/" + biz.id + "/car-request/uberXL"}
                   className="navigate-right">
                  <span className="badge">5 mins</span>
                  <img src="img/uberXL.jpg" className="media-object small natural pull-left" />
                  <div className="media-body">
                    uberXL
                    <p>$8-11</p>
                  </div>
                </a>
              </li>
              <li className="table-view-cell media">
                <a href={"#biz/" + biz.id + "/car-request/uberSELECT"}
                   className="navigate-right">
                  <span className="badge">4 mins</span>
                  <img src="img/uberSELECT.jpg" className="media-object small natural pull-left" />
                  <div className="media-body">
                    uberSELECT
                    <p>$10-16</p>
                  </div>
                </a>
              </li>
              <li className="table-view-cell media">
                <a href={"#biz/" + biz.id + "/car-request/uberBLACK"}
                   className="navigate-right">
                  <span className="badge">4 mins</span>
                  <img src="img/uberBLACK.jpg" className="media-object small natural pull-left" />
                  <div className="media-body">
                    uberBLACK
                    <p>$15-16</p>
                  </div>
                </a>
              </li>
            </ul>
          }

          {!saved &&
            <ul className="table-view no-nav">
              <li className="table-view-cell">
                <p>Save us and get members only perks from Dean's Downtown!</p>
              </li>
            </ul>
          }

          {saved && Object.keys(store.perks).length === 0 &&
            <ul className="table-view no-nav">
              <li className="table-view-cell">
                <p>New Perks Coming Soon.</p>
              </li>
            </ul>
          }

          {saved && Object.keys(store.perks).length > 0 &&
            ['Event', 'On-Going', 'Birthday'].map(function (kind) {
            var perkIds = Object.keys(store.perks)
                            .sort(DescNumberSort)
                            .filter(function (id) {
                              var perk = store.perks[id];
                              return (perk.bizId == biz.id && perk.kind == kind);
                            });
            return (
              <ul className="table-view top-nav">
                {perkIds.map(function (id) {
                  return <PerkListItem perk={store.perks[id]} />;
                })}
              </ul>
            );
          })}

          <ul className="table-view no-nav">
            <li className="table-view-cell">
              <img className="media-object pull-left big" src={bizImage} />
              <img className="media-object pull-left big" src={bizImage} />
            </li>
          </ul>
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
      completed: false,
      showInvite: false
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

  toggleInvite: function () {
    this.setState({ showInvite: !this.state.showInvite});
  },

  render: function () {
    var perk = this.props.perk,
        biz = this.state.biz,
        perkImage = '/img/perk' + perk.id + '.jpg',
        bizMapURL = 'https://www.google.com/maps/dir/29.778524,-95.395847/Dean%27s,+Main+Street,+Houston,+TX';

    return (
      <div className={"page " + this.props.position}>
        <Header text={perk.name} back="true" />
        <div className="bar bar-standard bar-footer">
          <button
             onClick={this.toggleInvite}
             className="btn btn-primary btn-block">
            Invite Friends
          </button>
        </div>
        <div className="content">
          <div className="content-padded centered">
            <h5>{biz.name}</h5>
            <p><img src={perkImage} style={{ width: '50%' }} /></p>

            {!this.state.started && perk.kind == 'Birthday'  &&
              <div>
                <h4>Happy Birtday!</h4>
                <h5><span className="badge">{perk.when}</span></h5>
                <p>{perk.description}</p>
                <p>{perk.details}</p>
                <h5>&mdash; Starts In &mdash;</h5>
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
                <h4>{perk.name}</h4>
                <h5><span className="badge">{perk.when}</span></h5>
                <p>{perk.details}</p>

                <h5>&mdash; Starts In &mdash;</h5>
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
                <h4>{"Get " + perk.name}</h4>
                <h5><span className="badge">{perk.when}</span></h5>
                <p>{perk.details}</p>

                <button className="btn btn-block btn-primary"
                    onClick={function () { actions.startPerk(perk.id); }}>
                  {"Start Your "+ perk.name + " Now"}
                </button>
              </div>
            }
            {this.state.started && !this.state.completed &&
              <div>
                <h4>{perk.name + " In Progress"}</h4>
                <p>{perk.details}</p>
                <h5>&mdash; For The Next &mdash;</h5>
                <h2>
                  <CountdownTimer
                    initialTimeRemaining={perk.duration * 1000}
                    completeCallback={function () { actions.endPerk(perk.id); }}
                  />
                </h2>
              </div>
            }
            {this.state.completed &&
              <div>
                <p>Perk has ended</p>
              </div>
            }
          </div>
        </div>

        {this.state.showInvite &&
          <div className="fixed-bottom" style={{marginBottom: '44px'}}>
            <ul className="table-view mb0">
              <li className="table-view-cell media">
                <a className="navigate-right"
                   href={'https://www.facebook.com/sharer/sharer.php?app_id=142858009128896&sdk=joey&u=https%3A%2F%2Fwww.google.com%2Fmaps%2Fdir%2F29.778524%2C-95.395847%2FDean%2527s%2C%2BMain%2BStreet%2C%2BHouston%2C%2BTX&display=popup&ref=plugin&src=share_button'}>
                  <span className="icon icon-facebook-square media-object pull-left"></span>
                  <div className="media-body" style={{lineHeight:'32px'}}>
                    Facebook
                  </div>
                </a>
              </li>
              <li className="table-view-cell media">
                <a className="navigate-right"
                   href={"https://twitter.com/intent/tweet?text=I'm%20at%20Dean's%20Downtown%20now.%20Get%20here!&via=instaperkapp&url=" + encodeURIComponent(bizMapURL)}>
                  <span className="icon icon-twitter-square media-object pull-left"></span>
                  <div className="media-body" style={{lineHeight:'32px'}}>
                    Twitter
                  </div>
                </a>
              </li>
              <li className="table-view-cell media">
                <a className="navigate-right">
                  <span className="icon icon-envelope-square media-object pull-left"></span>
                  <div className="media-body" style={{lineHeight:'32px'}}>
                    Text
                  </div>
                </a>
              </li>
              <li className="table-view-cell media">
                <a className="navigate-right">
                  <span className="icon icon-envelope-square media-object pull-left"></span>
                  <div className="media-body" style={{lineHeight:'32px'}}>
                    Email
                  </div>
                </a>
              </li>
            </ul>
          </div>
        }
      </div>
    );
  }
});

var CarRequestPage = React.createClass({
  render: function () {
    return (
      <div className={"page " + this.props.position}>
        <Header text="CONFIRMATION" back="true" />
        <div className="content" style={{background:'#EFEFF4 url(/img/route1.jpg) top center no-repeat'}}>
          <div className="card">
            <ul className="table-view no-nav">
              <li className="table-view-cell media">
                <span className="icon icon-home media-object pull-left"></span>
                <div className="media-body" style={{lineHeight:'32px'}}>
                  702 Cleveland Street
                </div>
              </li>
              <li className="table-view-cell media">
                <span className="icon icon-location media-object pull-left"></span>
                <div className="media-body" style={{lineHeight:'32px'}}>
                  Dean's Downtown
                </div>
              </li>
            </ul>
          </div>

          <div className="fixed-bottom">
            <div className="card">
              <ul className="table-view no-nav">
                <li className="table-view-cell media">
                  <span className="icon icon-cc-visa media-object pull-left"></span>
                  <div className="media-body" style={{lineHeight:'32px'}}>
                    Personal **** 9649
                  </div>
                </li>
              </ul>
            </div>

            <div className="content-padded">
              <button className="btn btn-primary btn-block">
                {"Request " + this.props.carKind}
              </button>
            </div>
            <p className="centered"><small className="badge">
              Pickup time is approximately 4 mins
            </small></p>
          </div>
        </div>
      </div>
    );
  }
});

var CarRequestPage = React.createClass({
  render: function () {
    return (
      <div className={"page " + this.props.position}>
        <Header text="CONFIRMATION" back="true" />
        <div className="content" style={{background:'#EFEFF4 url(/img/route1.jpg) top center no-repeat'}}>
          <div className="card">
            <ul className="table-view no-nav">
              <li className="table-view-cell media">
                <span className="icon icon-home media-object pull-left"></span>
                <div className="media-body" style={{lineHeight:'32px'}}>
                  702 Cleveland Street
                </div>
              </li>
              <li className="table-view-cell media">
                <span className="icon icon-location media-object pull-left"></span>
                <div className="media-body" style={{lineHeight:'32px'}}>
                  Dean's Downtown
                </div>
              </li>
            </ul>
          </div>

          <div className="fixed-bottom">
            <div className="card">
              <ul className="table-view no-nav">
                <li className="table-view-cell media">
                  <span className="icon icon-cc-visa media-object pull-left"></span>
                  <div className="media-body" style={{lineHeight:'32px'}}>
                    Personal **** 9649
                  </div>
                </li>
              </ul>
            </div>

            <div className="content-padded">
              <button className="btn btn-primary btn-block">
                {"Request " + this.props.carKind}
              </button>
            </div>
            <p className="centered"><small className="badge">
              Pickup time is approximately 4 mins
            </small></p>
          </div>
        </div>
      </div>
    );
  }
});

var ChatPage = React.createClass({
  render: function () {
    return (
      <div className={"page " + this.props.position}>
        <Header text="Chat with Dean's Downtown" back="true" />
        <div className="bar bar-standard bar-footer-secondary bar-small">
          <p><small>* Please include the best way to contact you</small></p>
        </div>
        <div className="bar bar-standard bar-footer">
          <form onSubmit={this.submitHandler}>
            <input
              type="text"
              placeholder="Your Message"
              style={{marginTop: 2, padding: '5px'}}
            />
          </form>
        </div>
        <div className="content">
          <ul className="table-view no-nav chat">
            <li className="table-view-divider centered">
              <small>Yesterday, 9.30 AM</small>
            </li>

            <li className="table-view-cell media">
              <div className="media-body">
                <div className="badge badge-primary badge-chat pull-right">
                  Hi, I'm Rian.<br />
                  I'd like to book for my birthday party. Can you arrange that?<br />
                  My phone number is 812.323.4567<br />
                </div>
              </div>
            </li>
            
            <li className="table-view-divider centered">
              <small>Today, 11.23 AM</small>
            </li>

            <li className="table-view-cell media">
              <img src="img/logo1.png" className="media-object bottom tiny circle pull-left" />
              <div className="media-body" style={{paddingLeft: 25}}>
                <span className="badge badge-inverted badge-chat-meta">
                  <small>Dean's Downtown</small>
                </span>
                <br />
                <div className="badge badge-chat">
                  Sure! When?
                </div>
              </div>
            </li>

            <li className="table-view-cell media">
              <div className="media-body">
                <div className="badge badge-primary badge-chat pull-right">
                  It will be Nop 11. Saturday, I believe.
                </div>
              </div>
            </li>

            <li className="table-view-cell media">
              <img src="img/logo1.png" className="media-object bottom tiny circle pull-left" />
              <div className="media-body" style={{paddingLeft: 25}}>
                <span className="badge badge-inverted badge-chat-meta">
                  <small>Dean's Downtown</small>
                </span>
                <br />
                <div className="badge badge-chat">
                  Great! How many people will attend?
                </div>
              </div>
            </li>

            <li className="table-view-cell media">
              <div className="media-body">
                <div className="badge badge-primary badge-chat pull-right">
                  20 max
                </div>
              </div>
            </li>

            <li className="table-view-cell media">
              <img src="img/logo1.png" className="media-object bottom tiny circle pull-left" />
              <div className="media-body" style={{paddingLeft: 25}}>
                <span className="badge badge-inverted badge-chat-meta">
                  <small>Dean's Downtown</small>
                </span>
                <br />
                <div className="badge badge-chat">
                  Awesome! We'll arrange it for you.
                </div>
              </div>
            </li>

            <li className="table-view-cell media">
              <div className="media-body">
                <div className="badge badge-primary badge-chat pull-right">
                  Thanks! Looking forward to it.
                </div>
              </div>
            </li>

          </ul>
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
            Instaperk
          </h1>
          <h5 className="centered">
            Perks from places<br />you love
          </h5>
          <br />
          <p className="centered">
            <span
              className="icon icon-bookmark-o"
              style={{fontSize:100,color:'#ddd'}}>
            </span>
          </p>
        </div>
        <div className="fixed-bottom">
          <div className="content-padded">
            <button
              className="btn btn-block btn-primary"
              onClick={function () { actions.changeTab('explore'); }}>
              Get Started 
            </button>
          </div>
        </div>
      </div>
    );

    if (!store.intro && perkIds.length === 0) return (
      <div>
        <Header text={store.intro ? 'Instaperk' : 'My Perks'} back="false" />
        <div className="content">
          <div className="content-padded">
            <br />
            <h4 className="centered">New Perks for You Coming Soon.</h4>
            <br />
            <p className="centered">
              <span
                className="icon icon-chronometer"
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
        <Header text={store.intro ? 'Instaperk' : 'My Perks'} back="false" />
        <div className="content">
          <ul className="table-view">
            <li className="table-view-cell table-view-divider">
              Dean's Downtown
            </li>
            {perkIds.map(function (id) {
              return (
                <PerkListItem perk={store.perks[id]} />
              );
            })}
          </ul>
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
    router.addRoute('biz/:id/car-request/:carKind', function (id, carKind) {
      this.slidePage(
        <CarRequestPage {...this.state}
          key={"car" + id}
          bizId={id}
          carKind={carKind} />
      );
    }.bind(this));
    router.addRoute('perk/:id', function (id) {
      var perk = store.perks[id];
      this.slidePage(<PerkPage {...this.state} key={"perk" + id} perk={perk} />);
    }.bind(this));
    router.addRoute('biz/:id/chat', function (id) {
      this.slidePage(<ChatPage {...this.state} key={"chat" + id} bizId={id} />);
    }.bind(this));
    router.start();
  }
});

React.render(
  <App />, document.getElementById('app')
);
