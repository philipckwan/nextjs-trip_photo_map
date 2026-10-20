import { useState, useEffect, useContext , useRef} from "react";
import {timeLog, timestampToDateTime} from "@/lib/PCKUtils";
//import * as util from 'util'

import {
  GoogleMapProvider,
  useGoogleMap,
} from "@ubilabs/google-maps-react-hooks";

export function PhotosMap({photosAll, currentPos}) {
  //timeLog(`PhotosMap: 1.0; photosAll.length:[${photosAll.length}];`);
  const [mapContainer, setMapContainer] = useState(null);

  useEffect(() => {
    timeLog(`PhotosMap.useEffect[mapContainer]: 1.0;`);
  }, [mapContainer])

  return(
    <>
    <GoogleMapProvider
    googleMapsAPIKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
    options={{zoom:10, center: {lat:0, lng:0}, mapTypeControl: false, streetViewControl: false, fullscreenControl: false}}
    mapContainer={mapContainer}
    >
      <div ref={(node) => {setMapContainer(node);}} style={{height: "70vh"}} />
      <PhotoMarkers photosAll={photosAll} currentPos={currentPos}/>
    </GoogleMapProvider>
    </>
  );
  
}

//let openInfoWindow = undefined;

function PhotoMarkers({photosAll, currentPos}) {
  const {map} = useGoogleMap();
  const [openedInfoWindow, setOpenedInfoWindow] = useState(undefined);
  const markersRef = useRef([]);
  const arrowsRef = useRef([]);
  //timeLog(`PhotoMarkers: 1.0;`);

  function clearMarkersAndArrows() {
    //timeLog(`PhotoMarkers.clearMarkersAndArrows: 1.0;`);
    for (let aMarker of markersRef.current) {
      aMarker.setMap(null);
    }
    for (let anArrow of arrowsRef.current) {
      anArrow.setMap(null);
    }
    markersRef.current = [];
    arrowsRef.current = [];
  }

  useEffect(() => {
    if (!map) return;
    clearMarkersAndArrows();
    if (photosAll == undefined || photosAll.length == 0) return;
      
    timeLog(`PhotosMap.useEffect[map, photosAll]; 1.0; photosAll.length:[${photosAll.length}];`);

    let initialBounds = new google.maps.LatLngBounds();
    let photosLatLng = [];
    let latCenter;
    let lngCenter;
    for (let i = 0; i < photosAll.length; i++) {
      let aPhoto = photosAll[i];
      let photoID = aPhoto.photoID;
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
    
      let uploadUser = aPhoto.uploadedBy;
      let photoB64 = aPhoto.thumbnailB64;
      let timestamp = aPhoto.timestamp;
      //timeLog(`PhotoMarkers.useEffect[map, photosAll]: 1.2; [${i}]; photoID:[${photoID}]; lat:${lat}; lng:${lng};`);
      let aNewMarker = new google.maps.Marker({map});
      markersRef.current.push(aNewMarker);
      aNewMarker.setPosition({lat, lng});
      let aNewInfoWindow = new google.maps.InfoWindow({
        content: `<div><p>ID:[${photoID}]<br/>Photo taken datetime:[${timestampToDateTime(timestamp)}]<br/>Uploaded By:[${uploadUser}];</p><img src="data:image/jpeg;base64,${photoB64}" width="300" height="300" /></div>`,
        ariaLabel: "Trip Photo",
      });
      aNewMarker.addListener("click", () => {
        
        aNewInfoWindow.open({
          anchor: aNewMarker,
          map,
        });
        if (openedInfoWindow != undefined) {
          //timeLog(`__about to close openedInfoWindow:[${openedInfoWindow}];`);
          openedInfoWindow.close();
        } else {
          //timeLog(`__openedInfoWindow is undefined;`);
        }
        //timeLog(`__about to setOpenedInfoWindow;`);
        setOpenedInfoWindow(aNewInfoWindow);
      });
      if (!isNaN(lat)) {
        //timeLog(`PhotoMarkers: adding {${lat}, ${lng}} to initialBounds;`);
        initialBounds.extend({lat, lng});
      }
      
    }
    //map.setCenter(initialBounds.getCenter());
    if (!isNaN(latCenter)) {
      map.setCenter({lat: latCenter, lng: lngCenter});
    }
    
    for (let i = 0; i < photosLatLng.length - 1; i++) {
      let aPhotoLatLngPair = [photosLatLng[i], photosLatLng[i+1]]
      const aPhotoPairPath = new google.maps.Polyline({
        path: aPhotoLatLngPair,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        icons: [
          {
            icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,},
            offset: "100%",
          },
        ],
      });
      arrowsRef.current.push(aPhotoPairPath);
      aPhotoPairPath.setMap(map);
    }
  }, [map, photosAll]);

  useEffect(() => {
    //timeLog(`PhotosMap.useEffect[currentPos]: 1.0`);
    if (!map) return;
    if (photosAll[currentPos] == undefined) return;
    let lat = parseFloat(photosAll[currentPos].latitude);
    if (isNaN(lat)) {
      return;
    }
    let lng = parseFloat(photosAll[currentPos].longitude);
    map.panTo({lat, lng});
  }, [currentPos]);
  
  //timeLog(`PhotoMarkers: 2.0; END;`);
  return null;
}
