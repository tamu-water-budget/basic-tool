/* SET UP LEAFLET MAP */

//console.log("Hi there! This is just to demonstrate that we've retrieved the coefficients and appended them to the created JSON file!!!!!!!!!!! HIIIIIIIIII!!");

console.log("1. SET UP THE MAP");
L.mapbox.accessToken = 'pk.eyJ1Ijoia2hpZ2dpbnMxMTUiLCJhIjoiY2ltcW9pZXZkMDBua3ZsbTRieXh1NmdkdSJ9.CDeDgVkdUyZS3nkyJWYAXg';
var map = L.mapbox.map('map', 'mapbox.streets-satellite')
    .setView([30.59, -96.29], 14);


/* for testing purposes, example point coordinate, which we will check if it is within polygons */
/* 30.6028545,-96.2784941 --> coord of address at parcelData.features[1], 8907 Sandstone drive */
var marker = L.marker(new L.LatLng(30.6028545, -96.2784941), {
    icon: L.mapbox.marker.icon({
        "marker-color": "#500000",
        "marker-size": "large"
    })
    //draggable: true,
    //zIndexOffset: 999
});


var geocoderControl = L.mapbox.geocoderControl('mapbox.places', {
  keepOpen: true,
  autocomplete: true
});
geocoderControl.addTo(map);

/* GEOCODE THIS FUNCTION */
geocoderControl.on('select', function(e){
  console.log("only runs if geocoder function activated")

  //console.log("inside geocoderControl, object = ");
  //console.log(e);
  var coord = e.feature.geometry.coordinates;
  /*
  var marker = L.marker(new L.LatLng(coord[1], coord[0]), {
    icon: L.mapbox.marker.icon({
        "marker-color": "#500000",
        "marker-size": "large"
    })
  });
  */
  marker.setLatLng([coord[1], coord[0]]).addTo(map);
  map.setView([coord[1], coord[0]], 14);
  console.log("<!-- calling updateMarker from inside geocoder condition -->");
  getData();;
});

/* END LEAFLET MAP SETUP */

/* set arrays for column and row values for coefficient table lookup */
var colVals = [4000,6000,8000,10000,12000,14000,18000,24000,30000,60000];
//console.log("Here is an array of column values from the coefficient lookup table");
//console.log(colVals);
var rowVals = [500,1000,1500,2000,2500,3000,3500,4000,5000,9000];
//console.log("Here is an array of row values from the coefficient lookup table");
//console.log(rowVals);


/* await getData */
queue()
  .defer(d3.csv, "data/land_binCoeff.csv")
  .defer(d3.json, "data/parcelSubsetTest.geojson")
  .await(getData);



/* GLOBAL VARIABLES */
var parcelData, coeffData, coeffVal;


/* WE'RE GOING TO NEED TO RESTRICT SEARCHABLE ADDRESSES TO RESIDENTIAL ONLY...WHICH WILL BE ATTRIBUTE FIELD: STATE_CD, CODES A1 AND A8 ONLY */

/* GET DATA */
function getData(){
  console.log("<!-- inside getData -->");
  //make paramA local instead of global, pass to getRainfall later
  var paramA;

  //marker click-move functionality
  /*
  map.on('click', function(e){
    marker.setLatLng([e.latlng.lat, e.latlng.lng]);
    map.setView([e.latlng.lat, e.latlng.lng], 14);
  })
  */

  //console.log("first we loop through the geojson data!");
  d3.json('data/parcelSubsetTest.geojson', function(data) {
    //console.log("got PARCEL data");
    parcelData = data;
    //console.log(parcelData.features[0]);
    //var polygonFeatures = L.mapbox.featureLayer(parcelData);
    //polygonFeatures.addTo(map);
    //console.log("now we're looping through a csv of coefficients. Each one corresponds to a land bin (range of values)");
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
/*
      function geocodeThis(){
        var address = document.getElementById('search').value();
        geocoder.query(address, showMap);
      }

      var count = 0;
      for(i=0; i<parcelData.features.length;i++){

        if(parcelData.features[i].coeff == 0){
          console.log(parcelData.features[i]);
          count += 1;
        }
      }
*/
      //console.log("there are " + count + " features with coeff = 0");
      //call updateMarker()
      console.log("<!-- calling updateMarker from outside geocoder condition, but still in getData -->");
      updateMarker();

    });
  });

}/* END getData */

function updateMarker(){
  $('path').remove();
  $('.leaflet-marker-pane *').not(':first').remove();

  console.log("<!-- IN updateMarker -->");
  //var parcelData = data;
  //console.log("Inside update marker, and parcelData = ");
  //console.log(parcelData);

  //make a turf point from the marker
  var position = marker.getLatLng();
  var point = turf.point(position.lng, position.lat);

  //marker properties for popup events/tooltip

  //console.log(point);

  //console.log("We have position " + position);
  for(var i = 0; i < parcelData.features.length; i++){
    /*
    var within = turf.featurecollection(fc.features.filter(function(shop){
      if(turf.inside(point, parcelData.features[i])) return true;
    }));
    */
    //
    if(turf.inside(point, parcelData.features[i])){
      console.log("True at i = " + i);
      console.log("The point is inside the lot at address " + parcelData.features[i].properties.addr_line2);
      //console.log("")
      coeffNum = parcelData.features[i].properties.coeff;
      console.log("coeff = " + coeffNum);
      landNum = parcelData.features[i].properties.land_sqft;
      paramA = coeffNum * landNum;
      console.log("coeffNum x landNum = " + coeffNum + " x " + landNum + " = " + paramA);
      getRainfall(paramA);
      break;
    }
    else{
      console.log("We don't have data for your lot");
    }
  }

};

/* FOR RAINFALL DATA, WE'RE ONLY LOOKING BACK ONE MONTH */
   // need to parse the date field, get current month
   // (or match to a user selected month) and sum ET and P
   // for only data from that month

function getRainfall(aValue){
  console.log("<!-- IN getRainfall -->");
  var varA = aValue;
  //instantiate variables so can access in all of getRainfall function
  var etSum = 0;
  var etAvg = 0;
  var precipSum = 0;
  var precipAvg = 0;
  var count = 0;

  //new date object, bc we will only look at weather data from previous month, so need to know what current month is
  var today = new Date();
  //assign variable to current month, +1 because jan. is zero
  var currentMonth = today.getMonth()+1;
  console.log("The month is " + currentMonth);

  d3.csv('data/weatherData.csv', function(data){
    weatherData = data;
    console.log("reading csv in getRainfall");

    for(i = 0; i < weatherData.length; i++){
      var station = weatherData[i].station;
      var stationDate = new Date(weatherData[i].date);
      var stationMonth = stationDate.getMonth()+1;
      //console.log("stationDate = " + stationDate);
      var precip = Number(weatherData[i].rainfall);
      var evap = Number(weatherData[i].evapotranspiration);
      //console.log(station);

      //for project, we will need to use Carter Creek Daily
      if(station == "Carter Creek Daily" && stationMonth == currentMonth-2){
        //for all inside carter creek, add one to count,
        console.log("condition worked! And stationMonth = " + stationMonth);
        precipSum += precip;
        etSum += evap;
        //count += 1;
      }

    }
    //etAvg = etSum / count;
    //precipAvg = precipSum / count;
    //we're using sum of rainfall and et for equation, not average as I had previously thought.

    //console.log("ET = " + etAvg);
    //console.log("Precip = " + precipAvg);
    doMath(etSum, precipSum, varA);
  });
};



/*  NOW WE NEED TO DO SOME MATH
     Q = (Kc*ET - P)*A*0.62
     Kc = coeff attribute in parcelData...0.8
     ET is evapotranspiration
     P = Precipitation
     A = coefficient * land_sqft

*/

function doMath(evap, precip, aVar){
  console.log("<!-- Inside doMath! -->");
  var kCoeff = 0.8;
  var et = evap;
  var p = precip;
  var a = aVar;
  //q is final val, units in gallons of water
  var q;

  //equation needs if statement, bc if (kCoeff*et - p) is < 0, then q is 0
  if(kCoeff*et-p <= 0){
    q = 0;
  }
  else{
    q = ((kCoeff * et) - p) * a * 0.62;
  }

  console.log("et = " + et);
  console.log("p = " + p);
  console.log("a = " + a);
  printResult(q);

}

function printResult(qValue){
  q = qValue.toFixed(2);
  //$('map').on(click)
  alert("You needed " + q + " gallons of water last month");
  console.log("inside printResult!");
  console.log("your Q value is " + q);
}


//console.log("before call getData");
//getData();
marker.addTo(map);

/*
var parcels = L.mapbox.featureLayer()
    .loadURL('data/parcelSubset.geojson')
    .addTo(map);

$('#map').on('click', '.trigger', function() {
  alert('Hello from College Station!');
});

*/
