import {useState} from "react";
import {timeLog, timestampToDateTime} from "@/lib/PCKUtils";

export function Modal({photo, setShowModal}) {
  //timeLog(`Modal: 1.0;`);

  //const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div className="flex bg-black/75 justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="w-auto my-6 mx-auto max-w-[80%] ">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

            <div className="relative p-2 flex flex-col">
              <div className="m-1 p-1 border-2 flex-auto h-2/3 w-2/3">
                <img className="w-full" src={`data:image/jpeg;base64,${photo.photoB64}`} />
              </div> 
              <div className="text-xs">
                Photo ID: {photo.photoID}<br/>
                Photo taken datetime: {timestampToDateTime(photo.datetime)}<br/>
                Uploaded By: {photo.uploadedBy}<br/>
              </div>    
              <button
                className="bg-transparent border-0 text-black float-right"
                onClick={() => setShowModal(false)}
              >
                <span className="text-black opacity-7 h-6 w-6 text-xl block bg-gray-400 py-0 rounded-full">
                  X
                </span>
              </button>
            </div>
       
          </div>
        </div>
      </div>
    </>
  );
};
