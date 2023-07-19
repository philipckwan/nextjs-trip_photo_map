import {timeLog} from "../lib/PCKUtils";
import {useContext, useState, useEffect} from "react";
import {Constants} from "@/lib/Constants";
import {TripInputsContext} from "@/pages/trip-login";
import {PhotosUpload} from "@/components/PhotosUpload";
import {PhotosTable} from "@/components/PhotosTable";
import {PhotosMap} from "@/components/PhotosMap";
import {TripPhotoMapEngine} from "@/lib/TripPhotoMapEngine";
import Link from 'next/link';

const STATE_LIST = "STATE_LIST";
const STATE_UPLOAD = "STATE_UPLOAD";
const STATE_MAP = "STATE_MAP";

export function TripLoaded() {

  const {tripName, username, viewTokenRef} = useContext(TripInputsContext);
  const [stateTripLoaded, setStateTripLoaded] = useState(STATE_LIST);
  const [statusAndMessage, setStatusAndMessage] = useState(Constants.STATUS_AND_MESSAGE_INITIAL);
  const [photosAll, setPhotosAll] = useState([]);
  const [numStateUpdate, setNumStateUpdate] = useState(0);
  
  //timeLog(`TripLoaded: 1.0; tripName:[${tripName}]; username:[${username}]; isNewTripRef:[${isNewTripRef.current}];`);// photosB64.length:[${photosB64.length}];`);

  useEffect(() => {
    async function stateChange() {
      timeLog(`TripLoaded.useEffect[stateTripLoaded, numStateUpdate].stateChange: stateTripLoaded:[${stateTripLoaded}];`);
      if (stateTripLoaded == STATE_LIST) {
        let photosMetadata = await TripPhotoMapEngine.getPhotosMetadata(viewTokenRef.current, true);
        //timeLog(`TripView.viewPhotoListing: photosMetadata.length:[${photosMetadata.length}];`);
        setPhotosAll(photosMetadata);
      } else if (stateTripLoaded == STATE_UPLOAD) {
        
      } else if (stateTripLoaded == STATE_MAP) {
        let photosData = await TripPhotoMapEngine.getPhotosMetadataAndThumbnailB64(viewTokenRef.current, true);  
        setPhotosAll(photosData);
      }
    }
    stateChange();
    setStatusAndMessage(Constants.STATUS_AND_MESSAGE_INITIAL);
  }, [stateTripLoaded, numStateUpdate]);

  function messageRender() {
    if (statusAndMessage.status == "") {
      return <font>&nbsp;</font>;
    } else if (statusAndMessage.status == Constants.RESULTS_OK) {
      return <font className="text-lime-500">{statusAndMessage.message}</font>
    } else {
      return <font className="text-red-500">{statusAndMessage.message}</font>
    }
  }

  function handleStateTripLoadedChange(state) {
    setStateTripLoaded(state);
    setNumStateUpdate(numStateUpdate + 1);
  }

  return (
    <div className="my-2">
      <div className="flex flex-col justify-evenly">
        <label className="text-base text-navy-700 dark:text-white font-bold">[TripLoaded] you may view the trip and upload more photos to the trip</label>
      </div>
      <div>
        <div className="flex">
          <div>Trip Name:</div>
          <div>{tripName}</div>
        </div>
        <div className="flex">
          <div>Username:</div>
          <div>{username}</div>
        </div>
        <div className="flex">
          <div><Link className="text-blue-400 no-underline hover:underline" href={(`trip-view3/${viewTokenRef.current}`)}>View Link (for sharing)</Link></div>
        </div>
        <div className="flex">
          {messageRender()}
        </div>
      </div>
      <div className="flex flex-row justify-evenly">
        <button onClick={() => handleStateTripLoadedChange(STATE_LIST)} className="m-2 inline-block p-2 rounded-lg shadow-sm bg-indigo-500 text-white">Photos List</button>
        <button onClick={() => handleStateTripLoadedChange(STATE_MAP)} className="m-2 inline-block p-2 rounded-lg shadow-sm bg-indigo-500 text-white">Trip Map</button>
        <button onClick={() => handleStateTripLoadedChange(STATE_UPLOAD)} className="m-2 inline-block p-2 rounded-lg shadow-sm bg-indigo-500 text-white">Upload Photos</button>
      </div>
      <div className="mt-2">
        {stateTripLoaded == STATE_LIST ? <PhotosTable setTripViewStatusAndMessage={setStatusAndMessage} photosAll={photosAll} numStateUpdate={numStateUpdate} setNumStateUpdate={setNumStateUpdate}></PhotosTable> : stateTripLoaded == STATE_MAP ? <PhotosMap photosAll={photosAll} currentPos={0} ></PhotosMap> : <PhotosUpload></PhotosUpload>}
      </div>
    </div>
  );
}