import {Constants} from "@/lib/Constants";
import {timeLog} from "@/lib/PCKUtils";
import {TripInputsContext} from "@/pages/trip-login";
import {useState, useContext} from "react";
import {TripPhotoMapEngine} from "@/lib/TripPhotoMapEngine";
import { Modal } from "@/components/Modal";

export function PhotosTable({setTripViewStatusAndMessage, photosAll, numStateUpdate, setNumStateUpdate}) {
  const {writeTokenRef} = useContext(TripInputsContext);
  const TABLE_HEAD = ["ID", "Date and Time", "User", "GPS", "Actions"];
  const [showModal, setShowModal] = useState(false);
  const [modalPhoto, setModalPhoto] = useState("");

  function showDateTime(datetimeOrig) {
    let d = new Date(datetimeOrig);
    if (d == "Invalid Date") {
      return `n/a`;
    }
    let year = d.getFullYear();
    let month = d.getMonth()+1;
    let date = d.getDate();
    let hour = d.getHours();
    let minute = d.getMinutes();
    return `${year}-${month.toString().padStart(2,"0")}-${date.toString().padStart(2,"0")} ${hour.toString().padStart(2,"0")}:${minute.toString().padStart(2,"0")}`;
  }

  function showGPS(latOrig, lngOrig) {
    let lat = parseFloat(latOrig);
    if (isNaN(lat)) {
      return `n/a`;
    }
    let lng = parseFloat(lngOrig);
    return `[${lat.toFixed(2)},${lng.toFixed(2)}]`;
  }

  async function deletePhoto(index, photoID) {
    timeLog(`deletePhoto: index:[${index}]; photoID:[${photoID}];`);
    let {status, message} = await TripPhotoMapEngine.deletePhoto(writeTokenRef.current, photoID);
    //timeLog(`deletePhoto: about to call messageCB with message:[${message}];`);
    setTripViewStatusAndMessage({status, message});
    //timeLog(`deletePhoto: done calling messageCB with message:[${message}];`);
    setNumStateUpdate(numStateUpdate + 1);
  }

  async function viewPhoto(index, photoID) {
    timeLog(`viewPhoto: index:[${index}]; photoID:[${photoID}];`);
    let photoB64 = await TripPhotoMapEngine.getPhotoB64(writeTokenRef.current, photoID);  
    setModalPhoto({...photosAll[index], photoB64});
    setShowModal(true);
  }

  return(
    <div onClick={() => setShowModal(false)} >
    <div>
      <table className="border-2 border-slate-300 my-2 w-full min-w-max table-auto text-left text-xs">
        <thead>
          <tr className="bg-gray-100">
            {TABLE_HEAD.map((head) => (
              <th key={head} className="text-sm p-2">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {photosAll.map(({photoID, datetime, uploadedBy, latitude, longitude}, index) => {
            const trClass = index % 2 == 1 ? "bg-gray-200" : "bg-gray-400";
            const tdClass = "p-2";
            const buttonClass = "m-1 p-1 rounded-md bg-indigo-500 text-white";
            return (
              <tr key={photoID} className={trClass}>
                <td className={tdClass}>
                    {photoID}
                </td>
                <td className={tdClass}>
                    {showDateTime(datetime)}
                </td>
                <td className={tdClass}>
                    {uploadedBy}
                </td>
                <td className={tdClass}>
                    {showGPS(latitude, longitude)}
                </td>
                <td className={tdClass}>
                  <button onClick={() => {deletePhoto(index, photoID)}} className={buttonClass}>Delete</button>
                  <button onClick={() => {viewPhoto(index, photoID)}} className={buttonClass}>View</button>
                </td>
              </tr>
            )}
          )}
        </tbody>
      </table>
    </div>
    <div>
      {showModal ? <Modal photo={modalPhoto} setShowModal={setShowModal}></Modal> : <></>}
    </div>
    </div>
  );

}