var map;
var chicago = {lat: 41.85, lng: -87.65};
var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

var markers = [];

var flightPath;
/**
 * The CenterControl adds a control to the map that recenters the map on
 * Chicago.
 * @constructor
 * @param {!Element} controlDiv
 * @param {!google.maps.Map} map
 * @param {?google.maps.LatLng} center
 */
function CenterControl(controlDiv, map, center) {
    // We set up a variable for this since we're adding event listeners
    // later.
    var control = this;

    // Set the center property upon construction
    control.center_ = center;
    controlDiv.style.clear = 'both';

    // Set CSS for the control border
    var goCenterUI = document.createElement('div');
    goCenterUI.id = 'goCenterUI';
    goCenterUI.title = 'Click to recenter the map';
    controlDiv.appendChild(goCenterUI);

    // Set CSS for the control interior
    var goCenterText = document.createElement('div');
    goCenterText.id = 'goCenterText';
    goCenterText.innerHTML = 'Center Map';
    goCenterUI.appendChild(goCenterText);

    // Set CSS for the setCenter control border
    var setCenterUI = document.createElement('div');
    setCenterUI.id = 'setCenterUI';
    setCenterUI.title = 'Click to change the center of the map';
    controlDiv.appendChild(setCenterUI);

    // Set CSS for the control interior
    var setCenterText = document.createElement('div');
    setCenterText.id = 'setCenterText';
    setCenterText.innerHTML = 'Set Center';
    setCenterUI.appendChild(setCenterText);

    // Set up the click event listener for 'Center Map': Set the center of
    // the map
    // to the current center of the control.
    goCenterUI.addEventListener('click', function() {
        var currentCenter = control.getCenter();
        map.setCenter(currentCenter);
    });

    // Set up the click event listener for 'Set Center': Set the center of
    // the control to the current center of the map.
    setCenterUI.addEventListener('click', function() {
        var newCenter = map.getCenter();
        control.setCenter(newCenter);
    });

}

/**
 * Define a property to hold the center state.
 * @private
 */
CenterControl.prototype.center_ = null;

/**
 * Gets the map center.
 * @return {?google.maps.LatLng}
 */
CenterControl.prototype.getCenter = function() {
    return this.center_;
};

/**
 * Sets the map center.
 * @param {?google.maps.LatLng} center
 */
CenterControl.prototype.setCenter = function(center) {
    this.center_ = center;
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: chicago,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
        '<div id="bodyContent">'+
        '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
        'sandstone rock formation in the southern part of the '+
        'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
        'south west of the nearest large town, Alice Springs; 450&#160;km '+
        '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
        'features of the Uluru - Kata Tjuta National Park. Uluru is '+
        'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
        'Aboriginal people of the area. It has many springs, waterholes, '+
        'rock caves and ancient paintings. Uluru is listed as a World '+
        'Heritage Site.</p>'+
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
        'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
        '(last visited June 22, 2009).</p>'+
        '</div>'+
        '</div>';


    var flightPlanCoordinates = [
        {lat: 41.85, lng: -87.65},
        {lat: 41.291, lng: -87.821},
        {lat: 41.142, lng: -87.431},
        {lat: 41.467, lng: -87.027}
    ];

    var heatmapData = [
        new google.maps.LatLng(37.782, -122.447),
        new google.maps.LatLng(37.782, -122.445),
        new google.maps.LatLng(37.782, -122.443),
        new google.maps.LatLng(37.782, -122.441),
        new google.maps.LatLng(37.782, -122.439),
        new google.maps.LatLng(37.782, -122.437),
        new google.maps.LatLng(37.782, -122.435),
        new google.maps.LatLng(37.785, -122.447),
        new google.maps.LatLng(37.785, -122.445),
        new google.maps.LatLng(37.785, -122.443),
        new google.maps.LatLng(37.785, -122.441),
        new google.maps.LatLng(37.785, -122.439),
        new google.maps.LatLng(37.785, -122.437),
        new google.maps.LatLng(37.785, -122.435)
    ];


    flightPath = new google.maps.Polyline ({
        path: flightPlanCoordinates,
        editable: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    //addLine();

    flightPath.setMap(map);

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });


    var marker = new google.maps.Marker( {
        position: chicago,
        map:map,
        title: 'hello world'
    });

    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

    google.maps.event.addListener(map, 'click', function(event) {
        addMarker(event.latLng, map);
    });

    addMarker(sanFrancisco, map);


    map.data.loadGeoJson('https://storage.googleapis.com/maps-devrel/google.json');

    // Color each letter gray. Change the color when the isColorful property
    // is set to true.
    map.data.setStyle(function(feature) {
        var color = 'gray';
        if (feature.getProperty('isColorful')) {
            color = feature.getProperty('color');
        }
        return /** @type {google.maps.Data.StyleOptions} */({
            fillColor: color,
            strokeColor: color,
            strokeWeight: 2
        });
    });

    // When the user clicks, set 'isColorful', changing the color of the letters.
    map.data.addListener('click', function(event) {
        event.feature.setProperty('isColorful', true);
    });

    // When the user hovers, tempt them to click by outlining the letters.
    // Call revertStyle() to remove all overrides. This will use the style rules
    // defined in the function passed to setStyle()
    map.data.addListener('mouseover', function(event) {
        map.data.revertStyle();
        map.data.overrideStyle(event.feature, {strokeWeight: 8});
    });

    map.data.addListener('mouseout', function(event) {
        map.data.revertStyle();
    });

    map.data.setStyle(styleFeature);

    var layer = new google.maps.FusionTablesLayer({
        query: {
            select: 'geometry',
            from: '1ertEwm-1bMBhpEwHhtNYT47HQ9k2ki_6sRa-UQ'
        },
        styles: [{
            polygonOptions: {
                fillColor: '#00FF00',
                fillOpacity: 0.3
            }
        }, {
            where: 'birds > 300',
            polygonOptions: {
                fillColor: '#0000FF'
            }
        }, {
            where: 'population > 5',
            polygonOptions: {
                fillOpacity: 1.0
            }
        }]
    });
    layer.setMap(map);

    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData
    });
    heatmap.setMap(map);

    // Get the earthquake data (JSONP format)
    // This feed is a copy from the USGS feed, you can find the originals here:
    //   http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
    var script = document.createElement('script');
    script.setAttribute('src',
        'https://storage.googleapis.com/maps-devrel/quakes.geo.json');
    document.getElementsByTagName('head')[0].appendChild(script);

    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map, chicago);

    centerControlDiv.index = 1;
    centerControlDiv.style['padding-top'] = '10px';
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
}

function eqfeed_callback(data) {
    map.data.addGeoJson(data);
}

function styleFeature(feature) {
    var low = [151, 83, 34];   // color of mag 1.0
    var high = [5, 69, 54];  // color of mag 6.0 and above
    var minMag = 1.0;
    var maxMag = 6.0;

    // fraction represents where the value sits between the min and max
    var fraction = (Math.min(feature.getProperty('mag'), maxMag) - minMag) /
        (maxMag - minMag);

    var color = interpolateHsl(low, high, fraction);

    return {
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            strokeWeight: 0.5,
            strokeColor: '#fff',
            fillColor: color,
            fillOpacity: 2 / feature.getProperty('mag'),
            // while an exponent would technically be correct, quadratic looks nicer
            scale: Math.pow(feature.getProperty('mag'), 2)
        },
        zIndex: Math.floor(feature.getProperty('mag'))
    };
}

function interpolateHsl(lowHsl, highHsl, fraction) {
    var color = [];
    for (var i = 0; i < 3; i++) {
        // Calculate color based on the fraction.
        color[i] = (highHsl[i] - lowHsl[i]) * fraction + lowHsl[i];
    }

    return 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)';
}

var mapStyle = [{
    'featureType': 'all',
    'elementType': 'all',
    'stylers': [{'visibility': 'off'}]
}, {
    'featureType': 'landscape',
    'elementType': 'geometry',
    'stylers': [{'visibility': 'on'}, {'color': '#fcfcfc'}]
}, {
    'featureType': 'water',
    'elementType': 'labels',
    'stylers': [{'visibility': 'off'}]
}, {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [{'visibility': 'on'}, {'hue': '#5f94ff'}, {'lightness': 60}]
}];


function addLine() {
    flightPath.setMap(map);
}

function removeLine() {
    flightPath.setMap(null);
}

function addMarker(location, map) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    var marker = new google.maps.Marker({
        position: location,
        label: labels[labelIndex++ % labels.length],
        map: map
    });
    markers.push(marker);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function clearMarkers() {
    setMapOnAll(null);
}

function showMarkers() {
    setMapOnAll(map);
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
}

google.maps.event.addDomListener(window, 'load', initMap);
