/* SET UP LEAFLET MAP */

console.log("hi from before the map!!!");

L.mapbox.accessToken = 'pk.eyJ1Ijoia2hpZ2dpbnMxMTUiLCJhIjoiY2ltcW9pZXZkMDBua3ZsbTRieXh1NmdkdSJ9.CDeDgVkdUyZS3nkyJWYAXg';
var map = L.mapbox.map('map', 'mapbox.streets')
    .setView([30.62,-96.34], 14);

/* END LEAFLET MAP SETUP */

//get number function
//parse string function
function getNumber(str){
  return (isNaN(parseFloat(str))) ? 0 : parseFloat(str);
}


var colVals = [4000,6000,8000,10000,12000,14000,18000,24000,30000,60000];
var rowVals = [500,1000,1500,2000,2500,3000,3500,4000,5000,9000];
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
  //console.log("in getData!");
  d3.json('data/parcelSubset2.geojson', function(data) {
    //console.log("got PARCEL data");
    parcelData = data;
    //console.log(parcelData.features[0]);
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

        parcelData.features[i].properties.coeff = getNumber(coeffVal);

      }
      console.log("hi from after get coeffs!");


    });


  });
}//end getData

getData();




/*

for(i=0;i<parcels.length;i++){
  console.log("inside first for loop");
  landArea = parcels.features[i].properties.land_sqft;
  livingArea = parcels.features[i].properties.living_are;
  grassArea = landArea - livingArea;
  console.log(grassArea);
  parcels.features[i].properties.grass_area =  parcels.features[i].properties.land_sqft - parcels.features[i].properties.living_are;

}

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
