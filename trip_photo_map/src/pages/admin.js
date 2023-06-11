import {timeLog} from "../lib/PCKUtils";
import {useState} from "react";
import {Constants} from "../lib/Constants";

export  function getServerSideProps() {
  //let props = {hi:"bye"};
  timeLog(`admin.js: getServerSideProps: 1.1;`);
  return {props:{hi:"bye"}};
}

export default function Admin() {
  const [serverVersion, setServerVersion] = useState("n/a");
  const [serverUUID, setServerUUID] = useState("n/a");
  const [statusAndMessage, setStatusAndMessage] = useState(Constants.STATUS_AND_MESSAGE_INITIAL);
  timeLog(`Admin: 1.7;`);

  async function handlePingServer() {
    timeLog(`Admin.handlePingServer: 1.0;`);
    try {
      const response = await fetch("/api/version", {
        method: 'get',
        headers: {'Content-Type':'application/json'},
      });
      let respJson = await response.json();
      let status = respJson.status;
      let message = respJson.message;
      let dataObj = respJson.data;
      //timeLog(`respJson:${JSON.stringify(respJson)}`);
      setServerVersion(dataObj.version);
      setServerUUID(dataObj.uuid.substring(0,4));
      setStatusAndMessage({status, message});
    } catch (err) {
      timeLog(`Admin.handlePingServer: ERROR - in ping server: ${err};`);
      setServerVersion("n/a");
      setServerUUID("n/a");
      setStatusAndMessage({status:Constants.RESULTS_ERROR, message:"server unreachable"});
    }
  }

  function messageRender() {
    if (statusAndMessage.status == "") {
      return <font>&nbsp;</font>;
    } else if (statusAndMessage.status == Constants.RESULTS_OK) {
      return <font className="text-lime-500">{statusAndMessage.message}</font>
    } else {
      return <font className="text-red-500">{statusAndMessage.message}</font>
    }
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
              <p>{messageRender()}</p>
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