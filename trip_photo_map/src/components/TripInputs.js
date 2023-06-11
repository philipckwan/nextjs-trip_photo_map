import {timeLog} from "../lib/PCKUtils";
import {useContext, useState} from "react";
import {Constants} from "@/lib/Constants";
import {TripInputsContext} from "@/pages/trip-login";
import {TripPhotoMapEngine} from "@/lib/TripPhotoMapEngine";

const PLACEHOLDER_TRIP_NAME = "Fukuoka202304";
const PLACEHOLDER_TRIP_PASSPHRASE = "mickey";
const PLACEHOLDER_USERNAME = "philip";

export function TripInputs() {

  const {tripName, setTripName, username, setUsername, setMainState, viewTokenRef, writeTokenRef, isNewTripRef} = useContext(TripInputsContext);
  const [tripPassphrase, setTripPassphrase] = useState("");
  const [message, setMessage] = useState("");
  //const {tripName} = useContext(TripInputsContext);
  
  
  function handleTripNameChange(event) {
    setTripName(event.target.value);
  }

  function handleTripPassphraseChange(event) {
    setTripPassphrase(event.target.value);
  }

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handleLoginTrip(isCreateTrip) {
    timeLog(`TripInputs.handleLoginTrip: 1.0; isCreateTrip:[${isCreateTrip}];`);
    let tripNameInput = tripName == "" ? PLACEHOLDER_TRIP_NAME : tripName;
    let tripPassphraseInput = tripPassphrase == "" ? PLACEHOLDER_TRIP_PASSPHRASE : tripPassphrase;
    let usernameInput = username == "" ? PLACEHOLDER_USERNAME : username;
    TripPhotoMapEngine.loginTrip(tripNameInput, tripPassphraseInput, usernameInput, isCreateTrip).then(
      ({status, message, viewToken, writeToken}) => {
        timeLog(`TripInputs.handleLoginTrip: status:[${status}]; message:[${message}]; viewToken:[${viewToken}]; writeToken:[${writeToken}];`);
        if (status != Constants.RESULTS_OK) {
          setMessage(message);
        } else {
          setTripName(tripNameInput);
          setUsername(usernameInput);
          viewTokenRef.current = viewToken;
          writeTokenRef.current = writeToken
          setMessage("");
          isNewTripRef.current = isCreateTrip ? true : false;
          setMainState(Constants.TRIP_STATE_LOADED);
        }
      }
    );
  }

  function messageRender() {
    if (message == "") {
      return <font>&nbsp;</font>;
    } else {
      return <font color="red">{message}</font>
    }
  }

  return (
    <>
      <div className="flex flex-col justify-evenly">
        <label className="text-base text-navy-700 dark:text-white font-bold">Input the Trip ID and password to create a new trip, or to access an existing trip</label>
        {messageRender()}
      </div>
      <div>
        <div className="flex flex-row h-12 w-full justify-evenly whitespace-nowrap items-baseline">
          <div className="w-40">Trip Name:</div>
          <input onChange={handleTripNameChange} placeholder={PLACEHOLDER_TRIP_NAME} value={tripName} type="text" id="tripName" name="tripName" className="m-1 h-10 w-full rounded-lg border bg-white/0 p-3 text-sm outline-none border-gray-200"></input>
        </div>
        <div className="flex flex-row h-12 w-full justify-evenly whitespace-nowrap items-baseline">
          <div className="w-40">Passphrase:</div>
          <input onChange={handleTripPassphraseChange} placeholder={PLACEHOLDER_TRIP_PASSPHRASE} value={tripPassphrase} type="text" id="tripPassphrase" name="tripPassphrase" className="m-1 h-10 w-full rounded-lg border bg-white/0 p-3 text-sm outline-none border-gray-200"></input>
        </div>
        <div className="flex flex-row h-12 w-full justify-evenly whitespace-nowrap items-baseline">
          <div className="w-40">Username:</div>
          <input onChange={handleUsernameChange} placeholder={PLACEHOLDER_USERNAME} value={username} type="text" id="username" name="username" className="m-1 h-10 w-full rounded-lg border bg-white/0 p-3 text-sm outline-none border-gray-200"></input>
        </div>
      </div>
      <div className="flex flex-row h-16 justify-evenly">
        <button onClick={() => {handleLoginTrip(true)}} className="m-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Create New Trip</button>
        <button onClick={() => {handleLoginTrip(false)}} className="m-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Login to Existing Trip</button>
      </div>
    </>
  );

}