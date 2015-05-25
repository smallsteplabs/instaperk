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

  render: function () {
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
  render: function () {
    var businesses = this.props.businesses.map(function(biz) {
          return (
            <BizListItem key={biz.id} biz={biz} />
          )
        });

    return (
      <ul>
        {businesses}
      </ul>
    );
  }
});

var HomePage = React.createClass({
  searchHandler: function(key) {
    alert('Search key: ' + key);
  }, 

  render: function() {
    var businesses= [
      {id: 1, name: "Dean's Downtown", address: "316 Main St, Houston, TX"},
      {id: 2, name: "Roma's Pizza", address: "233 Main St, Houston, TX"},
      {id: 3, name: "Fusion Taco", address: "801 Congress, Houston, TX"},
      {id: 4, name: "Frank's Pizza", address: "417 Travis St, Houston, TX"}
    ];

    return (
      <div>
        <Header text="List of Biz" />
        <SearchBar searchHandler={this.searchHandler} />
        <BizList businesses={businesses} />
      </div>
    );
  }
});

React.render(
  <HomePage />,
  document.body
);
