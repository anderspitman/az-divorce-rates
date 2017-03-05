import React from 'react';
import ReactDOM from 'react-dom';
import { MainMap } from './main_map';
import { SmallMultiples } from './small_map';

export class App extends React.Component {
  render() {
    return (
      <div>
        <MainMap year={2015} position={this.props.position}
            countyData={this.props.countyData}/>
        <SmallMultiples years={this.props.years} position={this.props.position}
            countyData={this.props.countyData}/>
      </div>
    );
  }
}
