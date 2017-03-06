import React from 'react';
import ReactDOM from 'react-dom';
import Papa from 'papaparse';
import { App } from './components/app';

const position = [34.0489, -111.0937];
const years = [ 2010, 2011, 2012, 2013, 2014, 2015 ];

const parseOptions = {
  header: true,
  download: true,
  complete: dataReady
};
Papa.parse("dissolution_rate_data.csv", parseOptions);

function dataReady(results) {

  const data = convertData(results.data);

  populateGeoJson(data, countyData);

  ReactDOM.render(
    <App years={years} position={position} countyData={countyData.features} />,
    document.getElementById('app')
  );

}

function convertData(data) {
  data.forEach(function(row) {
    row.year = +row.year;
    row.dissolutionRate = +row.dissolutionRate;
  });
  return data;
}

function populateGeoJson(data, geojson) {
  geojson.features.forEach(function(county) {

    county.properties.dissolutionData = {};

    data.forEach(function(row) {

      if (row.county === county.properties.NAME) {
        county.properties.dissolutionData[row.year] = row.dissolutionRate;
      }

    });
  });

}
