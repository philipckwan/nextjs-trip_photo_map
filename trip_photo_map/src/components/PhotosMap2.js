import {useState, useEffect, useRef, useCallback} from "react";
import {timeLog, timestampToDateTime} from "@/lib/PCKUtils";

import {GoogleMapProvider, useGoogleMap} from "@ubilabs/google-maps-react-hooks";

const DEFAULT_ZOOM = 12;
const DEFAULT_CENTER = {lat:32.9, lng:131.0};
const mapTypeControl = false;
const streetViewControl = false;
const fullscreenControl = false;
const height = "40vh";

export function PhotosMap2({init, photos, currentPhotoIdx}) {
  const [mapContainer, setMapContainer] = useState();
  const mapRef = useCallback(node => {
    node && setMapContainer(node);
  }, []);
  const [zoom, setZoom] = useState(init.zoom ? init.zoom : DEFAULT_ZOOM);
  const [center, setCenter] = useState(init.center ? init.center: DEFAULT_CENTER);

  //timeLog(`PhotosMap2: 1.0;`);

  return(
    <>
      <GoogleMapProvider
        googleMapsAPIKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
        options={{zoom, center, mapTypeControl, streetViewControl, fullscreenControl}}
        mapContainer={mapContainer}
      >
        {/*<div ref={(node) => {setMapContainer(node);}} style={{height}} />*/}
        <div className="h-full" ref={mapRef} />
        <PhotoMarkers2 photos={photos} currentPhotoIdx={currentPhotoIdx}></PhotoMarkers2> 
      </GoogleMapProvider>
    </>
  )
}

function PhotoMarkers2({photos, currentPhotoIdx}) {
  const {map} = useGoogleMap();
  const markersRef = useRef([]);
  const arrowsRef = useRef([]);
  const openedInfoWindowRef = useRef();


  useEffect(() => {
    //timeLog(`PhotoMarkers2.useEffect[map, photos]: 1.0;`);//map:[${map}]; photos:[${photos}];`);
    if (!map || !photos || photos.length == 0) return;

    let initialBounds = new google.maps.LatLngBounds();
    let photosLatLng = [];
    let latCenter;
    let lngCenter;
    for (let i = 0; i < photos.length; i++) {
      let aPhoto = photos[i];
      let lat = parseFloat(aPhoto.latitude);
      if (isNaN(lat)) {
        continue;
      }
      let lng = parseFloat(aPhoto.longitude);
      if (i == 0) {
        latCenter = lat;
        lngCenter = lng;
      }
      photosLatLng.push({lat, lng});
      let aNewMarker = new google.maps.Marker({map});
      markersRef.current.push(aNewMarker);
      aNewMarker.setPosition({lat, lng});
      if (!isNaN(lat)) {
        initialBounds.extend({lat, lng});
      }
    }
    if (!isNaN(latCenter)) {
      map.setCenter({lat: latCenter, lng: lngCenter});
    }
    for (let i = 0; i < photos.length - 1; i++) {
      let aPhotoLatLngPair = [photosLatLng[i], photosLatLng[i+1]];
      const aPhotoPairPath = new google.maps.Polyline({
        path: aPhotoLatLngPair,
        geodesic: true,
        strokeColor: "#FF0000",//"#64CCC5", 
        strokeOpacity: 1.0,
        strokeWeight: 2,
        icons: [{
          icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
          offset: "100%"
        }]
      });
      arrowsRef.current.push(aPhotoPairPath);
      aPhotoPairPath.setMap(map);
    }

  }, [map, photos]);

  useEffect(() => {
    //timeLog(`PhotoMarkers2.useEffect[currentPhotoIdx]: 1.0; currentPhotoIdx:[${currentPhotoIdx}];`);
    if (!map || !photos || !photos[currentPhotoIdx]) return;
    let lat = parseFloat(photos[currentPhotoIdx].latitude);
    if (isNaN(lat)) {
      return;
    }
    let lng = parseFloat(photos[currentPhotoIdx].longitude);
    map.panTo({lat, lng});
    if (openedInfoWindowRef.current) {
      openedInfoWindowRef.current.close();
      openedInfoWindowRef.current = undefined;
    }
    let aNewInfoWindow = new google.maps.InfoWindow({
      content: `<div><p>Uploaded by ${photos[currentPhotoIdx].uploadedBy}<br/> on ${timestampToDateTime(photos[currentPhotoIdx].timestamp)}</p></div>`,
      ariaLabel: "Trip Photo",
    });
    aNewInfoWindow.open({
      anchor: markersRef.current[currentPhotoIdx],
      map,
    });
    openedInfoWindowRef.current = aNewInfoWindow;
  }, [currentPhotoIdx]);

  return null;

}