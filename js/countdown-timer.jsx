/** @jsx React.DOM */

// Generic Countdown Timer UI component
//
// props:
//   - initialTimeRemaining: Number
//       The time remaining for the countdown (in ms).
//
//   - interval: Number (optional -- default: 1000ms)
//       The time between timer ticks (in ms).
//
//   - formatFunc(timeRemaining): Function (optional)
//       A function that formats the timeRemaining.
//
//   - tickCallback(timeRemaining): Function (optional)
//       A function to call each tick.
//
var CountdownTimer = React.createClass({

  propTypes: {
    initialTimeRemaining: React.PropTypes.number.isRequired,
    interval: React.PropTypes.number,
    formatFunc: React.PropTypes.func,
    tickCallback: React.PropTypes.func,
    completeCallback: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      interval: 1000,
      formatFunc: undefined,
      tickCallback: undefined,
      completeCallback: undefined,
    };
  },

  getInitialState: function() {
    // Normally an anti-pattern to use this.props in getInitialState,
    // but these are all initializations (not an anti-pattern).
    return {
      timeRemaining: this.props.initialTimeRemaining,
      secondsRemaining: 0,
      minutesRemaining: 0,
      hoursRemaining: 0,
      daysRemaining: 0,
      timeoutId: undefined,
      prevTime: undefined
    };
  },

  componentWillReceiveProps: function(newProps, oldProps) {
    if (this.state.timeoutId) clearTimeout(this.state.timeoutId);
    this.setState({ prevTime: undefined, timeRemaining: newProps.initialTimeRemaining });
  },

  componentDidMount: function() {
    var options = {
      scaleColor: false,
      trackColor: '#ddd',
      barColor: '#DFBA69',
      lineWidth: 6,
      lineCap: 'butt',
      size: 75
    };
    $('.chart').easyPieChart(options);
    this.tick();
  },

  componentDidUpdate: function(){
    if ((!this.state.prevTime) && this.state.timeRemaining > 0 && this.isMounted()) {
      this.tick();
    }
  },

  componentWillUnmount: function() {
    clearTimeout(this.state.timeoutId);
  },

  tick: function() {

    var currentTime = Date.now();
    var dt = currentTime - this.state.prevTime || 0;
    var interval = this.props.interval;

    // correct for small variations in actual timeout time
    var timeRemainingInInterval = (interval - (dt % interval));
    var timeout = timeRemainingInInterval;

    if (timeRemainingInInterval < (interval / 2.0)) {
      timeout += interval;
    }

    var timeRemaining = Math.max(this.state.timeRemaining - dt, 0);
    var countdownComplete = (this.state.prevTime && timeRemaining <= 0);

    // time remaining breakdowns
    var totalSeconds = Math.round(timeRemaining / 1000);
    var seconds = parseInt(totalSeconds % 60);
    var minutes = parseInt(totalSeconds / 60) % 60;
    var hours = parseInt(totalSeconds / 3600) % 24;
    var days = parseInt(totalSeconds / 86400) % 365;

    if (this.isMounted()) {
      if (this.state.timeoutId) clearTimeout(this.state.timeoutId);
      this.setState({
        timeoutId: countdownComplete ? undefined: setTimeout(this.tick, timeout),
        prevTime: currentTime,
        timeRemaining: timeRemaining,
        secondsRemaining: seconds,
        minutesRemaining: minutes,
        hoursRemaining: hours,
        daysRemaining: days
      });
    }

    // update percent
    $('.chart.seconds').data('easyPieChart').update(seconds * 100 / 60);
    $('.chart.minutes').data('easyPieChart').update(minutes * 100 / 60);
    $('.chart.hours').data('easyPieChart').update(hours * 100 / 24);
    $('.chart.days').data('easyPieChart').update(days * 100 / 30);

    // update visibility
    if (days > 0) {
      $('.chart.days').show(); $('.chart.seconds').hide();
    } else {
      $('.chart.days').hide(); $('.chart.seconds').show();
    }
    if (hours === 0 && days === 0) $('.chart.hours').hide();

    if (countdownComplete) {
      if (this.props.completeCallback) { this.props.completeCallback() };
      return;
    }

    if (this.props.tickCallback) {
      this.props.tickCallback(timeRemaining);
    }
  },

  getFormattedTime: function(milliseconds) {
    if (this.props.formatFunc) {
      return this.props.formatFunc(milliseconds);
    }

    var totalSeconds = Math.round(milliseconds / 1000);

    var seconds = parseInt(totalSeconds % 60);
    var minutes = parseInt(totalSeconds / 60) % 60;
    var hours = parseInt(totalSeconds / 3600) % 24;
    var days = parseInt(totalSeconds / 86400) % 365;

    if (days > 0) {
      return days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's';
    } else {
      seconds = seconds < 10 ? '0' + seconds : seconds;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      hours = hours < 10 ? '0' + hours : hours;

      return (hours > 0 ? hours + ':' : '') + minutes + ':' + seconds;
    }
  },

  render: function() {
    var timeRemaining = this.state.timeRemaining,
        seconds = this.state.secondsRemaining,
        minutes = this.state.minutesRemaining,
        hours = this.state.hoursRemaining,
        days = this.state.daysRemaining;

    return (
      <div className='timer'>
        <ul style={{margin:0, padding:0}}>
          <li className="chart days" data-percent={days * 100 / 30}><span>{days}</span><small>days</small></li>
          <li className="chart hours" data-percent={hours * 100 / 24}><span>{hours}</span><small>hours</small></li>
          <li className="chart minutes" data-percent={minutes * 100 / 60 }><span>{minutes}</span><small>mins</small></li>
          <li className="chart seconds" data-percent={seconds * 100 / 60 }><span>{seconds}</span><small>secs</small></li>
        </ul>
      </div>
    );
  }
});
