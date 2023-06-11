import { useState, useEffect, useContext } from "react";
import {timeLog, timestampToDateTime} from "@/lib/PCKUtils";
//import * as util from 'util'

import {
  GoogleMapProvider,
  useGoogleMap,
} from "@ubilabs/google-maps-react-hooks";

export function PhotosMap({photosAll}) {
  //timeLog(`PhotosMap: 1.0; photosAll.length:[${photosAll.length}];`);
  const [mapContainer, setMapContainer] = useState(null);
  //const {photos, photosB64} = useContext(TripInputsContext);

  //timeLog(`PhotosMap: 1.1: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY:[${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}];`);

  //return(<div>hello</div>);
  return(
    <>
    <GoogleMapProvider
    googleMapsAPIKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}
    options={{zoom:10, center: {lat:0, lng:0}}}
    mapContainer={mapContainer}
    >
      <div ref={(node) => {setMapContainer(node);}} style={{ height: "100vh" }} />
      <PhotoMarkers photosAll={photosAll}/>
    </GoogleMapProvider>
    </>
  );
  
}

//let openInfoWindow = undefined;

function PhotoMarkers({photosAll}) {
  const {map} = useGoogleMap();
  const [openedInfoWindow, setOpenedInfoWindow] = useState(undefined);

  useEffect(() => {
    if (!map) return;

    //let photosCombined = [];

    let initialBounds = new google.maps.LatLngBounds();
    let photosLatLng = [];
    for (let i = 0; i < photosAll.length; i++) {
      let aPhoto = photosAll[i];
      let photoID = aPhoto.photoID;
      //timeLog(`PhotosMap.useEffect: aPhoto[${i}]; photoID:[${aPhoto.photoID}]; datetime:[${aPhoto.datetime}]; timestamp:[${aPhoto.timestamp}];`)
      let lat = parseFloat(aPhoto.latitude);
      timeLog(`PhotosMap.useEffect: aPhoto[${i}]; photoID:[${aPhoto.photoID}]; datetime:[${aPhoto.datetime}]; timestamp:[${aPhoto.timestamp}]; lat:[${lat}];`)
      if (isNaN(lat)) {
        continue;
      }
      let lng = parseFloat(aPhoto.longitude);
      photosLatLng.push({lat, lng});
    
      let uploadUser = aPhoto.uploadedBy;
      let photoB64 = aPhoto.thumbnailB64;
      let timestamp = aPhoto.timestamp;
      //timeLog(`PhotoMarkers.useEffect: 1.2; i:${i}; lat:${lat}; lng:${lng}; photoID:${photoID}; photoB64:[${photoB64}];`);
      let aNewMarker = new google.maps.Marker({map});
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
    map.setCenter(initialBounds.getCenter());

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
      aPhotoPairPath.setMap(map);
    }

    //timeLog(`PhotoMarkers.useEffect: 1.5; END;`); 
  }, [map, photosAll]);
  
  //timeLog(`PhotoMarkers: 2.0; END;`);
  return null;
}
