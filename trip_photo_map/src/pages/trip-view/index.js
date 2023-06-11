import {timeLog} from "@/lib/PCKUtils";
import {useState} from "react";
import {Constants} from "@/lib/Constants";
import Link from 'next/link';

const PLACEHOLDER_ACCESS_TOKEN = "enter_access_token_here"

export default function TripView() {
  const [accessToken, setAccessToken] = useState("");

  function handleViewTrip() {
    timeLog(`TripView: 1.0; accessToken:[${accessToken}];`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-6 pt-12">
      <div className="flex flex-col justify-center items-center h-[100vh]">
        <p>[TripView] Trip-Photo-Map App, by philipckwan [{Constants.APP_VERSION}]</p>  
        <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[600px] md:max-w-[800px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-6 3xl:p-![18px] bg-white undefined">                
          <div className="mb-3">           
            Input the access token below to navigate to the trip view page   
            <div className="flex flex-row h-12 w-full justify-evenly whitespace-nowrap items-baseline">
              <div className="w-40">Access Token:</div>
              <input onChange={(e) => setAccessToken(e.target.value)} placeholder={PLACEHOLDER_ACCESS_TOKEN} value={accessToken} type="text" id="accessToken" name="accessToken" className="m-1 h-10 w-full rounded-lg border bg-white/0 p-3 text-sm outline-none border-gray-200"></input>
            </div>
            <div className="flex flex-row h-2 justify-evenly"></div>
              <Link className="mt-1 inline-block p-2 rounded-md shadow-sm bg-indigo-500 text-white" href={(`trip-view/${accessToken == "" ? PLACEHOLDER_ACCESS_TOKEN : accessToken}`)}>Go to page</Link>
          </div>
        </div>          
      </div>
    </main>
  );
}