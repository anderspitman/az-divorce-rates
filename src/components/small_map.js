import React from 'react';
import ReactDOM from 'react-dom';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import { mapUrl, mapboxAccessToken, buildColorFunc } from '../map_common';


class SmallMultipleMap extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  render() {
    const style = {
      width: "200px",
      height: "200px",
      float: "left"
    };

    const s = {
    };

    const year = this.props.year;
    const colorFunc = buildColorFunc(this.props.countyData, year);
    const styleFunc = (feature) => {

      const color = colorFunc(feature.properties.dissolutionData[year]);

      return {
        fillColor: color,
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
      };
    };

    return (
      <div onClick={this.onClick} >
        <Map style={style} center={this.props.position} zoom={5}
            zoomControl={false} attributionControl={false} dragging={false}
            scrollWheelZoom={false} boxZoom={false} doubleClickZoom={false}
            touchZoom={false}>
          <TileLayer
            id='mapbox.light'
            url={mapUrl}
            accessToken={mapboxAccessToken}
          />
          <GeoJSON data={this.props.countyData} style={styleFunc} />
        </Map>
      </div>
    );
  }

  onClick() {
    this.props.onChange(this.props.year);
  }
}

export class SmallMultiples extends React.Component {

  constructor(props) {
    super(props);

    this.onChildClicked = this.onChildClicked.bind(this);
  }

  render() {
    const countyData = this.props.countyData;
    const years = this.props.years;
    const smallMaps = years.map((year) =>
      <SmallMultipleMap key={year} year={year} countyData={countyData}
          position={this.props.position} onChange={this.onChildClicked} />
    );
    return (
      <div>
        {smallMaps}
      </div>
    );
  }

  onChildClicked(year) {
    this.props.onChange(year);
  }
}

