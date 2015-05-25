var Header = React.createClass({
  render: function () {
    return (
      <h1 className="title">{this.props.text}</h1>
    );
  }
});

var BizList = React.createClass({
  render: function () {
    return (
      <ul>
        <li>Dean's Downtown</li>
        <li>Roma's Pizza</li>
      </ul>
    );
  }
});

var HomePage = React.createClass({
  render: function () {
    return (
      <div>
        <Header text="Instaperk"/>
        <BizList />
      </div>
    );
  }
});

React.render(
  <HomePage />,
  document.body
);
