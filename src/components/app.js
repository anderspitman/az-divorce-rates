import React from 'react';
import ReactDOM from 'react-dom';
import { MainMap } from './main_map';
import { SmallMultiples } from './small_map';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.state = { year: this.props.years[0] };
  }

  render() {
    return (
      <div>
        <MainMap year={this.state.year} position={this.props.position}
            countyData={this.props.countyData}/>
        <SmallMultiples years={this.props.years} position={this.props.position}
            countyData={this.props.countyData} onChange={this.handleChange} />
      </div>
    );
  }

  handleChange(year) {
    this.setState({ year: year });
  }
}
