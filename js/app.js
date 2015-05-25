var Header = React.createClass({
  render: function () {
    return (
      <h1 className="title">{this.props.text}</h1>
    );
  }
});

var SearchBar = React.createClass({
  searchHandler: function() {
    this.props.searchHandler(this.refs.searchKey.getDOMNode().value);
  },  

  render: function() {
    return (
      <input type="search" ref="searchKey" onChange={this.searchHandler} />
    );
  }   
});

var BizListItem = React.createClass({
  render: function () {
    var biz = this.props.biz;

    return (
      <li>
        <strong>{biz.name}</strong> {biz.address} <a href="#">Save</a>
      </li>
    );
  }
});

var BizList = React.createClass({
  render: function() {
    var items = this.props.businesses.map(function(biz) {
          return (
            <BizListItem key={biz.id} biz={biz} />
          )
        });

    return (
      <ul>
        {items}
      </ul>
    );
  }
});

var HomePage = React.createClass({
  getInitialState: function() {
    return {businesses: []}
  },

  componentDidMount: function() {
    var _this = this;

    this.props.service.findAll().done(function(results) {
      _this.setState({searchKey: '', businesses: results});
    });
  },

  searchHandler: function(key) {
    this.props.service.findByName(key).done(function(result) {
      this.setState({searchKey: key, businesses: result});
    }.bind(this));
  }, 

  render: function() {
    return (
      <div>
        <Header text="List of Biz" />
        <SearchBar searchHandler={this.searchHandler} />
        <BizList businesses={this.state.businesses} />
      </div>
    );
  }
});

React.render(
  <HomePage service={bizService} />,
  document.body
);
