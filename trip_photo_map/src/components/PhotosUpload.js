import {timeLog} from "../lib/PCKUtils";
import {useContext, useMemo, useState, useRef, useEffect} from "react";
import {Constants} from "../lib/Constants";
import {TripInputsContext} from "../pages/trip-login";
import {TripPhotoMapEngine} from "@/lib/TripPhotoMapEngine";
import * as util from 'util'

export function PhotosUpload() {

  const {tripName, username, viewTokenRef, writeTokenRef, photos, setMainState} = useContext(TripInputsContext);
  const [statusAndMessage, setStatusAndMessage] = useState(Constants.STATUS_AND_MESSAGE_INITIAL);
  const dropAreaRef = useRef();
  const imgRef = useRef();
  const filesToUploadRef = useRef([]);
  const [numFiles, setNumFiles] = useState(0);

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
    dropAreaRef.current.addEventListener("drop", handleDrop);
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

  function handleDrop(e) {
    timeLog(`handleDrop: 1.0`);
    var dt = e.dataTransfer;
    var files = dt.files;

    handleFiles(files);
  }

  function handleFiles(files) {
    timeLog(`handleFiles: 1.0;`);
    //files = [...files];
    for (let aFile of files) {
      filesToUploadRef.current.push(aFile);
    }
    setNumFiles(filesToUploadRef.current.length);
  }

  function previewFile(file) {
    timeLog(`previewFile: 1.0; file:[${file}];`);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
        imgRef.current.src = reader.result;
    };
  }

  function handleUploadFile(event) {
    //timeLog(`handleUploadFile: 1.0;`);
    let aFile = event.target.files[0];
    timeLog(`__aFile: name:[${aFile.name}]; size:[${aFile.size}]`);
    handleFiles([aFile]);
  }

  function handleUploadFiles() {
    //timeLog(`handleUploadFiles: 1.0; writeToken:[${writeToken}];`);
    TripPhotoMapEngine.uploadPhotos(tripName, writeTokenRef.current, username, filesToUploadRef.current).then(
      ({status, message, photoIDs}) => {
        timeLog(`PhotosUpload.handleUploadFiles: status:[${status}]; message:[${message}];`)
        setStatusAndMessage({status, message});
        filesToUploadRef.current = [];
        setNumFiles(0);
        //timeLog(`handleUploadFiles: 2.0; msg: [${message}];`);
      }
    );
  }

  return (
    <>
      <div className="flex flex-col justify-evenly">
        <label className="text-base text-navy-700 dark:text-white font-bold">Drag and Drop photos to upload</label>
        <p>Total {numFiles} photos to be uploaded</p>
        {messageRender()}
      </div>
      <div ref={dropAreaRef} className="drop-area">
        <form className="my-form">
          <p>Select or drag and drop image files into this area</p>
          <input type="file" id="fileElem" accept="image/*" onChange={handleUploadFile} ></input>
          <label className="m-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white" htmlFor="fileElem">Upload an image file</label>
        </form>
        <img ref={imgRef} id="imagePreview1"></img>
      </div>
      <div>
        <button onClick={handleUploadFiles} className="m-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Upload files</button>
      </div>
    </>
  );
}