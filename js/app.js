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
  toggleSave: function (e) {
    e.preventDefault();
    this.props.onToggleSave(this.props.biz.id);
  },

  render: function () {
    var biz = this.props.biz,
        saved = this.props.saved;

    return (
      <li className="table-view-cell media">
        <img className="media-object small pull-left" src={"img/biz" + biz.id + '.jpg'} />
        {biz.name}
        <button className={"btn pull-right" + (saved ? ' btn-positive' : '') } onClick={this.toggleSave}>
          <span className={"icon icon-star" + (saved ? '-filled' : '')}></span>
          {saved ? 'Saved' : 'Save'}
        </button>
        <p>{biz.address}</p>
      </li>
    );
  }
});

var BizList = React.createClass({
  getInitialState: function () {
    return {saves: []}
  },

  toggleSave: function (id) {
    var _saves = this.state.saves,
        index = _saves.indexOf(id);
    if (index == -1) _saves.push(id); else _saves.splice(index, 1);
    this.setState({saves: _saves});
  },

  render: function () {
    var _this = this;
    var items = this.props.businesses.map(function (biz) {
          return (
            <BizListItem
              key={biz.id}
              biz={biz}
              saved={_this.state.saves.indexOf(biz.id) !== -1}
              onToggleSave={_this.toggleSave}
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

var HomePage = React.createClass({
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

React.render(
  <HomePage service={bizService} />,
  document.body
);
