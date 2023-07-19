import {timeLog, timestampToDate} from "@/lib/PCKUtils";
import {useState, useEffect, useRef, useReducer, useCallback, useMemo} from "react";
import {Constants} from "@/lib/Constants";
import {useRouter} from "next/router";
import {TripPhotoMapEngine} from "@/lib/TripPhotoMapEngine";
import {PhotosMap2} from "@/components/PhotosMap2"
import * as util from 'util'

const rootMarginCenter = "-50% 0% -50% 0%";
const rootMarginViewport = "50%";

export default function TripViewDynamic3() {
  //timeLog(`TripViewDynamic3: 1.0; [${new Date().getTime()}];`);
  //const [photosViewed, photosViewedDispatch] = useReducer(photosViewedReducer, { numLoaded:0 })
  const router = useRouter();
  const [tripName, setTripName] = useState();
  const [tripStartDate, setTripStartDate] = useState();
  const [tripEndDate, setTripEndDate] = useState();
  const [photos, setPhotos] = useState();
  const loadedPhotoIdxRef = useRef(-1);
  //const [loadedPhotoIdx, setLoadedPhotoIdx] = useState(-1);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(-1);
  const numObserversRef = useRef(0);

  useEffect(() => {
    timeLog(`TripViewDynamic3.useEffect[router];`);
    async function fetchPhotos() {
      let accessToken = router.query.accessToken;
      //timeLog(`TripViewDynamic3.useEffect[router].fetchPhotos: accessToken:[${accessToken}];`);
      if (accessToken == undefined) {
        return;
      }
      let tripMetadata = await TripPhotoMapEngine.getTripMetadata(accessToken);
      setTripName(tripMetadata.tripName ? tripMetadata.tripName : "n/a");
      let photos = await TripPhotoMapEngine.getPhotosMetadata(accessToken, true);  
      setTripStartDate(timestampToDate(photos[0].timestamp));
      setTripEndDate(timestampToDate(photos[photos.length - 1].timestamp));
      //timeLog(`__photos.length:[${photos.length}];`)
      setPhotos(photos);
      //setLoadedPhotoIdx(0);
      loadedPhotoIdxRef.current = 1;
    }
    if (!photos || photos.length == 0) {
      fetchPhotos();
    }
  }, [router]);

  function addRefNode(node) {
    timeLog(`addRefNode; numObserversRef:[${numObserversRef.current}];`);// node:[${node}];`);
    if (!node || numObserversRef.current >= photos.length) return;
    let moveMarkerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          for (let i = 0; i < photos.length; i++) {
            let aPhoto = photos[i];
            if (aPhoto.photoID == node.id) {
              let centerIdx = i;
              let loadToIdx = i + 2;
              setCurrentPhotoIdx(centerIdx);   
              if (loadedPhotoIdxRef.current < loadToIdx) {
                //let newloadedPhotoIdxRef = i + 1;
                timeLog(`__setting loadedPhotoIdx from [${loadedPhotoIdxRef.current}] to [${loadToIdx}];`);
                //setLoadedPhotoIdx(newLoadedPhotoIdx); 
                loadedPhotoIdxRef.current = loadToIdx;
              }
            }
          }          
          //anObserver.unobserve(node);
        }
      },
      {rootMargin: rootMarginCenter},
    );
    moveMarkerObserver.observe(node);
    /*
    let loadImageObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {  
          for (let i = 0; i < photos.length; i++) {
            let aPhoto = photos[i];
            if (aPhoto.photoID == node.id) {
              if (!aPhoto.photoB64 || aPhoto.photoB64.length == 0) {

              }          
            }
          }          
          //anObserver.unobserve(node);
        }
      },
      {rootMargin: rootMarginViewport},
    );
    loadImageObserver.observe(node);
    */
    numObserversRef.current++;
  }

  //timeLog(`TripViewDynamic3: 2.0; [${new Date().getTime()}];`);
  return (
    <div className="p-2 flex flex-col justify-center h-screen">
      <div className="h-1/3">
        <div className="h-full border-2 border-indigo-600">
          {/*
          <div>accessToken: {router.query.accessToken}</div>
          <div>photos.length: {photos && photos.length}</div>
          <div><button onClick={checkRefs} className="m-1 inline-block p-1 rounded-lg shadow-sm bg-indigo-500 text-white">Check Refs</button></div>
          */}
          <PhotosMap2 init={{}} photos={photos} currentPhotoIdx={currentPhotoIdx}></PhotosMap2>
        </div>
      </div>
      <div className="h-2/3 overflow-y-auto">
        <div className="border-2 border-indigo-400 h-1/3 flex flex-row justify-center">
          Start of trip: [{tripName}]<br/>
          From [{tripStartDate}] to [{tripEndDate}]
        </div>        
        {photos && photos.map(({photoID}, index) => {
          return(
            <div key={index} id={photoID} idx={index} ref={(node) => addRefNode(node)} className="h-1/2 flex flex-row justify-center">
              {
                //photos[index].photoB64 != undefined ? <img className="border-2 border-lime-600" src={`data:image/jpeg;base64,${photos[index].photoB64}`} /> : photoID
                loadedPhotoIdxRef.current >= index ? 
                <img className="border-2 border-lime-600" src={`/api/trip/access/${router.query.accessToken}/photosBinary/${photoID}`} />
                :
                photoID
              }
            </div>
          )}
        )}
        <div className="border-2 border-indigo-400 h-1/3 flex flex-row justify-center">
          End of trip: [{tripName}]<br/>
          From [{tripStartDate}] to [{tripEndDate}]
        </div>
      </div>   
    </div>
  );
}