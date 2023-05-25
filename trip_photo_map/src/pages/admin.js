import {timeLog} from "../lib/PCKUtils";
import {useState, useRef, useEffect} from "react";
import {Constants} from "../lib/Constants";

export  function getServerSideProps() {
  //let props = {hi:"bye"};
  timeLog(`admin.js: getServerSideProps: 1.1;`);
  return {props:{hi:"bye"}};
}

export default function Admin() {
  const [serverVersion, setServerVersion] = useState("n/a");
  const [serverUUID, setServerUUID] = useState("n/a");
  timeLog(`Admin: 1.7;`);

  async function handlePingServer() {
    timeLog(`Admin.handlePingServer: 1.0;`);

    const response = await fetch("/api/version", {
      method: 'get',
      headers: {'Content-Type':'application/json'},
    });
    let respJson = await response.json();
    //timeLog(`respJson:${JSON.stringify(respJson)}`);
    setServerVersion(respJson.version);
    setServerUUID(respJson.uuid.substring(0,4));

  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-6 pt-12">

      <div className="flex flex-col justify-center items-center h-[100vh]">
      <p>[Admin] Trip-Photo-Map App, by philipckwan [{Constants.APP_VERSION}]</p>  

        <div className="!z-5 relative flex flex-col rounded-[20px] max-w-[600px] md:max-w-[800px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-6 3xl:p-![18px] bg-white undefined">                
          <div className="mb-3">
              <p><label className="text-base text-navy-700 dark:text-white font-bold">Admin dashboard</label></p>
              <br/><button onClick={handlePingServer} className="mt-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white">Ping Server</button>
              <p>Server UUID: {serverUUID}</p>
              <p>Server Version: {serverVersion}</p>
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