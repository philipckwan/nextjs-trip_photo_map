import {timeLog} from "@/lib/PCKUtils";
import {useState, useRef, createContext} from "react";
import {Constants} from "@/lib/Constants";
import {TripInputs} from "@/components/TripInputs";
import {TripLoaded} from "@/components/TripLoaded";

//const PLACEHOLDER_TRIP_NAME = "Fukuoka202304";

export const TripInputsContext = createContext();

export default function TripLogin() {
  const [tripName, setTripName] = useState("");
  const [username, setUsername] = useState("");

  const [mainState, setMainState] = useState(Constants.TRIP_STATE_INPUT);

  const viewTokenRef = useRef(undefined);
  const writeTokenRef = useRef(undefined);
  const isNewTripRef = useRef(false);
  
  const value = {tripName, setTripName, username, setUsername, setMainState, viewTokenRef, writeTokenRef, isNewTripRef};

  timeLog(`TripLogin: 1.0;`);// ENV_SOURCE:[${process.env.NEXT_PUBLIC_ENV_SOURCE}]; SERVER_URL:[${process.env.SERVER_URL}]; GOOGLE_MAP_API_KEY:[${process.env.GOOGLE_MAP_API_KEY}]`);

  function tripStateRender() {
    if (mainState == Constants.TRIP_STATE_INPUT) {
      return <TripInputs></TripInputs>;
    } else if (mainState == Constants.TRIP_STATE_LOADED) {
      return <TripLoaded></TripLoaded>;
    }
    /*
    } else if (mainState == Constants.TRIP_STATE_PHOTOSB64_LOADED) {
      return <><TripLoaded></TripLoaded><PhotosList></PhotosList></>;
    } else if (mainState == Constants.TRIP_STATE_SHOW_MAP) {
      return <><TripLoaded></TripLoaded><PhotosList></PhotosList><TripMap></TripMap></>
    } else {
      return <></>;
    }
    */
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-6 pt-12">
      <div className="flex flex-col justify-center items-center h-[100vh]">
        <p>[TripLogin] Trip-Photo-Map App, by philipckwan [{Constants.APP_VERSION}]</p>  
        <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[600px] md:max-w-[800px] bg-white dark:bg-gray-800 dark:text-gray-200 bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-6 3xl:p-![18px]">                
          <div className="mb-3">              
              <TripInputsContext.Provider value={value}>
                {tripStateRender()}                
              </TripInputsContext.Provider>
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