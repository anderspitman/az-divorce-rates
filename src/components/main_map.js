import React from 'react';
import ReactDOM from 'react-dom';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import { mapUrl, mapboxAccessToken, buildColorFunc } from '../map_common';

export class MainMap extends React.Component {
  render() {

    const style = {
      width: "800px",
      height: "600px"
    };

    const year = this.props.year;

    const colorFunc = buildColorFunc(this.props.countyData, year);

    let styleFunc = (feature) => {

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
      <Map style={style} center={this.props.position} zoom={6}>
        <TileLayer
          id='mapbox.light'
          url={mapUrl}
          accessToken={mapboxAccessToken}
        />
        <GeoJSON data={this.props.countyData} style={styleFunc} />
      </Map>
    );
  }
}
