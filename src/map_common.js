export const mapboxAccessToken = "pk.eyJ1IjoiYW5kZXJzcGl0bWFuIiwiYSI6ImNpenJuNXpidzAxNjUzM281bnM3aWxveDEifQ.dG0CVtiRX3PEWdYbpoGI2w"
export const mapUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}';

// from colorbrewer
const colors = [
  '#feedde',
  '#fdd0a2',
  '#fdae6b',
  '#fd8d3c',
  '#f16913',
  '#d94801',
  '#8c2d04'
];

export function buildColorFunc(countyData, year) {

  // calculate classifications
  let max = 0;
  let min = 9999;
  countyData.forEach(function(county) {

    const dissolutionRate = county.properties.dissolutionData[year];

    if(dissolutionRate < min) {
      min = dissolutionRate;
    }
    if(dissolutionRate > max) {
      max = dissolutionRate;
    }
  });

  const divisionsCount = colors.length;
  const divisionSize = (max - min) / (divisionsCount - 1);

  let colorFunc = function(dissolutionRate) {
    const index = Math.floor(dissolutionRate / divisionSize) - 1;
    return colors[index];
  };

  return colorFunc;
}
