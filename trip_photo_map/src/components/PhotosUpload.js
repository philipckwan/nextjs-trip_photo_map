import {timeLog, dateTimeToTimestamp, timestampToDateTime} from "@/lib/PCKUtils";
import {useContext, useMemo, useState, useRef, useEffect} from "react";
import {Constants} from "../lib/Constants";
import {TripInputsContext} from "../pages/trip-login";
import {TripPhotoMapEngine} from "@/lib/TripPhotoMapEngine";
import {StatusGreenAvailable} from "@/components/StatusGreenAvailable";
import {StatusRedBusy} from "@/components/StatusRedBusy";
//import exifr from "exifr";
import * as util from 'util'

export function PhotosUpload() {

  const {tripName, username, viewTokenRef, writeTokenRef, photos, setMainState} = useContext(TripInputsContext);
  const [statusAndMessage, setStatusAndMessage] = useState(Constants.STATUS_AND_MESSAGE_INITIAL);
  const dropAreaRef = useRef();
  const imgRef = useRef();
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [uploadState, setUploadState] = useState(Constants.PHOTO_UPLOAD_STATE.FREE);
  const [numUploadSuccess, setNumUploadSuccess] = useState(0);
  const [numUploadFail, setNumUploadFail] = useState(0);
  const [dateTime, setDateTime] = useState();
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [exifStr, setExifStr] = useState();

  useEffect(() => {
    // The DOM element is accessible here.
    // Prevent default drag behaviors
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      dropAreaRef.current.addEventListener(eventName, preventDefaults, false);
      document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Highlight drop area when item is dragged over it
    ["dragenter", "dragover"].forEach(eventName => {
      dropAreaRef.current.addEventListener(eventName, () => {dropAreaRef.current.classList.add("highlight")});
    });
    ["dragleave", "drop"].forEach(eventName => {
      dropAreaRef.current.addEventListener(eventName, () => {dropAreaRef.current.classList.remove("highlight")});
    });
    dropAreaRef.current.addEventListener("drop", handleDropFiles);
    //console.log(ref.current);
  }, []);

  timeLog(`PhotosUpload: 1.0; tripName:[${tripName}]; username:[${username}];`);// photosB64.length:[${photosB64.length}];`);

  function messageRender() {
    if (statusAndMessage.status == "") {
      return <font>&nbsp;</font>;
    } else if (statusAndMessage.status == Constants.RESULTS_OK) {
      return <font className="text-lime-500">{statusAndMessage.message}</font>
    } else {
      return <font className="text-red-500">{statusAndMessage.message}</font>
    }
  }

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDropFiles(e) {
    var dt = e.dataTransfer;
    var files = dt.files;
    addFilesToUploadList(files);
  }

  async function handleAddFileToUpload(event) {
    //timeLog(`handleAddFileToUpload: 1.0;`);
    if (uploadState == Constants.PHOTO_UPLOAD_STATE.BUSY) {
      timeLog(`handleAddFileToUpload: WARN - should not reach here, as checking should be done at earlier stage; System is busy uploading, please wait for it to complete;`);
      return;
    }
    let aFile = event.target.files[0];
    //timeLog(`handleAddFileToUpload: aFile: name:[${aFile.name}]; size:[${aFile.size}]`);

    addFilesToUploadList([aFile]);
    /*
    let exifObj;
    try {
      exifObj = await exifr.parse(aFile); 
    } catch (err) {
      timeLog(`PhotosUpload.handleUploadFile: ERROR - exifr.parse failed; ${err};`);
      return undefined;
    }

    let datetime = "n/a";
    let timestamp = "n/a";
    let latitude = "n/a";
    let longitude = "n/a";
    if (exifObj) {
      if (exifObj.DateTimeOriginal != undefined) {
        datetime = exifObj.DateTimeOriginal;
        timestamp = dateTimeToTimestamp(datetime);
      }
      if (exifObj.latitude != undefined) {
        latitude = exifObj.latitude;
        longitude = exifObj.longitude;
      }
    }
    timeLog(`PhotosUpload.handleUploadFile: datetime:[${datetime}]; latitude:[${latitude}]; longitude:[${longitude}];`);
    timeLog(`__exifrObj:[${JSON.stringify(exifObj)}];`);
    setDateTime(timestampToDateTime(datetime));
    setLatitude(latitude);
    setLongitude(longitude);
    setExifStr(JSON.stringify(exifObj));
    */
  }  

  function addFilesToUploadList(files) {
    setNumUploadSuccess(0);
    setNumUploadFail(0);
    setFilesToUpload(filesToUpload => [...filesToUpload, ...files]);

  }

  function previewFile(file) {
    timeLog(`previewFile: 1.0; file:[${file}];`);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
        imgRef.current.src = reader.result;
    };
  }



  function handleUploadFiles() {
    //timeLog(`handleUploadFiles: 1.0;`);

    if (uploadState == Constants.PHOTO_UPLOAD_STATE.BUSY) {
      timeLog(`handleUploadFiles: WARN - should not reach here, as checking should be done at earlier stage; System is busy uploading, please wait for it to complete;`);
      return;
    }

    setUploadState(Constants.PHOTO_UPLOAD_STATE.BUSY);
    let uploadPromises = TripPhotoMapEngine.uploadPhotosAsync(tripName, writeTokenRef.current, username, filesToUpload, cbUploadResult);

    Promise.allSettled(uploadPromises).then(() => {
      timeLog(`handleUploadFiles: 3.0; all uploads completed;`);
      setUploadState(Constants.PHOTO_UPLOAD_STATE.FREE);
      setFilesToUpload([]);
    })

  }

  function cbUploadResult(uploadResult) {
    if (uploadResult == Constants.PHOTO_UPLOAD_RESULT.SUCCESS) {
      setNumUploadSuccess(numUploadSuccess => numUploadSuccess + 1);
    } else if (uploadResult == Constants.PHOTO_UPLOAD_RESULT.FAIL) {
      setNumUploadFail(numUploadFail => numUploadFail + 1);
    } else {
      timeLog(`PhotosUpload.cbUploadResult: ERROR - unknown result: [${uploadResult}]; should not reach here;`);
    }

  }

  const buttonBusyClass = uploadState == Constants.PHOTO_UPLOAD_STATE.FREE ? Constants.CLASS_BUTTON_ACTIVE : Constants.CLASS_BUTTON_INACTIVE;

  return (
    <>
      <div className="flex flex-col justify-evenly">
        <div><label className="text-base text-navy-700 dark:text-white font-bold">Drag and Drop photos to upload</label></div>
        <div>{uploadState == Constants.PHOTO_UPLOAD_STATE.FREE ? <StatusGreenAvailable></StatusGreenAvailable> : <StatusRedBusy></StatusRedBusy>}</div>
        <div>Total {filesToUpload.length} photos to be uploaded</div>
        <div>Total {numUploadSuccess} photos uploaded successfully</div>
        <div>Total {numUploadFail} photos uploaded failed</div>
        <div>{messageRender()}</div>
      </div>
      <div ref={dropAreaRef} className="drop-area">
        <form className="my-form">
          <p>Select or drag and drop image files into this area</p>
          <input type="file" id="fileElem" onChange={handleAddFileToUpload} disabled={uploadState == Constants.PHOTO_UPLOAD_STATE.FREE ? false : true}></input>
          <label className={buttonBusyClass} htmlFor="fileElem">Upload an image file</label>
        </form>
        <img ref={imgRef} id="imagePreview1"></img>
      </div>
      <div>
        <button onClick={handleUploadFiles} className={buttonBusyClass} disabled={uploadState == Constants.PHOTO_UPLOAD_STATE.FREE ? false : true}>Upload files</button>
      </div>
      {/*
      <div>
        <div>dateTime:{dateTime}</div>
        <div>latitude:{latitude}</div>
        <div>longitude:{longitude}</div>
        <div>exifStr:{exifStr}</div>
      </div>
      */}
    </>
  );
}