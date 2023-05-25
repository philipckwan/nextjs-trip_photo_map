import {timeLog} from "../lib/PCKUtils";
import {useState, useRef, useEffect} from "react";
import {Constants} from "../lib/Constants";

const PLACEHOLDER_TRIP_NAME = "Fukuoka202304";

export default function TripLogin() {
  const [tripName, setTripName] = useState("");
  const [tripPassphrase, setTripPassphrase] = useState("");
  const [username, setUsername] = useState("");
  
  timeLog(`TripLogin: 1.0; ENV_SOURCE:[${process.env.NEXT_PUBLIC_ENV_SOURCE}]; SERVER_URL:[${process.env.SERVER_URL}]; GOOGLE_MAP_API_KEY:[${process.env.GOOGLE_MAP_API_KEY}]`);

  function handleTripNameChange(event) {
    setTripName(event.target.value);
  }

  function handleTripPassphraseChange(event) {
    setTripPassphrase(event.target.value);
  }

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handleCreateTrip() {

  }

  function handleLoginTrip() {

  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-6 pt-12">

      <div className="flex flex-col justify-center items-center h-[100vh]">
      <p>[TripLogin] Trip-Photo-Map App, by philipckwan [{Constants.APP_VERSION}]</p>  

        <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[600px] md:max-w-[800px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-6 3xl:p-![18px] bg-white undefined">                
          <div className="mb-3">
              <p><label className="text-base text-navy-700 dark:text-white font-bold">Input the Trip ID and password to create a new trip, or to access an existing trip</label></p>
              <p>Trip Name: <input onChange={handleTripNameChange} placeholder={PLACEHOLDER_TRIP_NAME} value={tripName} type="text" id="tripName" name="tripName" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200"></input></p>
              <p>Passphrase: <input onChange={handleTripPassphraseChange} value={tripPassphrase} type="text" id="tripPassphrase" name="tripPassphrase" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200"></input></p>              
              <p>Username: <input onChange={handleUsernameChange} value={username} type="text" id="username" name="username" className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200"></input></p>              
              <button onClick={handleCreateTrip} className="mt-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Create New Trip</button>
              <br/><button onClick={handleLoginTrip} className="mt-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Login to Existing Trip</button>
          </div>
        </div>
      </div>
      <br/>
      {/*
      <div>
        <button onClick={handleTest} className="mt-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Test</button>
      </div>
      */}
    </main>
  );

}