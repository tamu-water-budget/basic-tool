/* SET UP LEAFLET MAP */

console.log("Hi there! This is just to demonstrate that we've retrieved the coefficients and appended them to the created JSON file!");

L.mapbox.accessToken = 'pk.eyJ1Ijoia2hpZ2dpbnMxMTUiLCJhIjoiY2ltcW9pZXZkMDBua3ZsbTRieXh1NmdkdSJ9.CDeDgVkdUyZS3nkyJWYAXg';
var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([30.62,-96.34], 14);

/*
var geocodeControl = L.mapbox.geocoderControl('mapbox.places');
geocodeControl.addTo(map);
console.log("Here's the geocodeControl!");

var resultOne = geocodeControl.setTileJSON(tilejson);
console.log("look HERE is " + resultOne);

*/
map.addControl(L.mapbox.geocoderControl('mapbox.places', {
  autocomplete: true
}));


/* END LEAFLET MAP SETUP */


var colVals = [4000,6000,8000,10000,12000,14000,18000,24000,30000,60000];
console.log("Here is an array of column values from the coefficient lookup table");
console.log(colVals);
var rowVals = [500,1000,1500,2000,2500,3000,3500,4000,5000,9000];
console.log("Here is an array of row values from the coefficient lookup table");
console.log(rowVals);
//var landAreTable = new Array();



/* await getData
queue()
  .defer(d3.csv, "data/OSM_research_qgis.csv")
  .defer(d3.json, "data/admin0_countries.json")
  .await(getData);

*/
var parcelData, coeffData, coeffVal;

/* GET DATA */
function getData(){
  console.log("first we loop through the geojson data!");
  d3.json('data/parcelSubset2.geojson', function(data) {
    //console.log("got PARCEL data");
    parcelData = data;
    //console.log(parcelData.features[0]);
    console.log("now we're looping through a csv of coefficients. Each one corresponds to a land bin (range of values)");
    d3.csv('data/land_binCoeff.csv', function(coeffs) {
      coeffData = coeffs;
      //console.log("got coeffs!");

      for(i = 0; i < parcelData.features.length; i++){
        //console.log("inside first for loop");
        var landArea = parcelData.features[i].properties.land_sqft;
        var livingArea = parcelData.features[i].properties.living_are;
        var totalGrass = landArea - livingArea;

        for(j=0; j < rowVals.length; j++){
          //get the row for reference

          if(livingArea >= rowVals[j] && livingArea < rowVals[j+1]){
            var refRow = j;
          }
        }//end get rowVals

        for(k=0; k < colVals.length; k++){
          //get column for reference

          if(landArea >= colVals[k] && landArea < colVals[k+1]){
            var refCol = k;
          }
        }//end get colVals


        if(refCol == 0){
            coeffVal = coeffData[refRow].land_bin1;
        }else if(refCol == 1){
            coeffVal = coeffData[refRow].land_bin2;
        }else if(refCol == 2){
            coeffVal = coeffData[refRow].land_bin3;
        }else if(refCol == 3){
            coeffVal = coeffData[refRow].land_bin4;
        }else if(refCol == 4){
            coeffVal = coeffData[refRow].land_bin5;
        }else if(refCol == 5){
            coeffVal = coeffData[refRow].land_bin6;
        }else if(refCol == 6){
            coeffVal = coeffData[refRow].land_bin7;
        }else if(refCol == 7){
            coeffVal = coeffData[refRow].land_bin8;
        }else if(refCol == 8){
            coeffVal = coeffData[refRow].land_bin9;
        }else if(refCol == 9){
            coeffVal = coeffData[refRow].land_bin10;
        }

        parcelData.features[i].properties.coeff = Number(coeffVal);

      }
      console.log("next we get row values based on conditions: if living area is between two numbers, assign that i value to variable refRow.");
      console.log("Then we get column values based on similar logic, assigning i value to variable refCol");
      console.log("then some if/else if statements; if ref col equals a certain value, then the coefficient value is equal to the coefficient data at index equal to refRow");
      console.log("This is the end of the coefficient logic explaination!");


    });


  });
}//end getData

getData();


/*  NOW WE NEED TO DO SOME MATH
     Q = (Kc*ET - P)*A*0.62
     Kc = coeff attribute in parcelData
     ET is evapotranspiration
     P = Precipitation

*/



/*
var parcels = L.mapbox.featureLayer()
    .loadURL('data/parcelSubset.geojson')
    .addTo(map);



var marker = L.marker([30.62,-96.34], {
          icon: L.mapbox.marker.icon({
            'marker-color': '#500000'
          })
      })
      .bindPopup('<button class="trigger">Say Hi!</button>')
      .addTo(map);

$('#map').on('click', '.trigger', function() {
  alert('Hello from College Station!');
});

*/
