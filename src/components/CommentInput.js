import {useState} from "react";
import {timeLog, timestampToDate} from "@/lib/PCKUtils";
import {TripPhotoMapEngine} from "@/lib/TripPhotoMapEngine";

export function CommentInput({photoID, comment, accessToken, cbToggleUpdate}) {
  timeLog(`CommentInput: photoID:[${photoID}];`)

  const [inputComment, setInputComment] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  async function saveComment() {
    //timeLog(`CommentInput.saveComment: photoID:[${photoID}]; inputComment:[${inputComment}];`);
    let updateResult = await TripPhotoMapEngine.updatePhotoComment(inputComment, accessToken, photoID);
    if (!updateResult) {
      timeLog(`CommentInput.saveComment: ERROR - comment update failed;`);
    }
    setIsUpdate(false);
    cbToggleUpdate();
  }

  return(
    <>
      {
        comment && !isUpdate &&
        <>
          <div className="border-2 border-lime-600 flex flex-row justify-center"><p>{comment}</p></div>
          <div className="border-2 border-lime-600 flex flex-row justify-center">
            <button onClick={() => {setInputComment(comment); setIsUpdate(true)}} className="m-1 p-1 rounded-md bg-indigo-500 text-white">Update Comment</button>
          </div>
        </>
      }
      {
        !comment && !isUpdate &&
        <>
          <div className="border-2 border-lime-600 flex flex-row justify-center">
            <button onClick={() => {setIsUpdate(true)}} className="m-1 p-1 rounded-md bg-indigo-500 text-white">Add Comment</button>
          </div>
        </>
        /*
        <>
          <div className="border-2 border-lime-600 flex flex-row justify-center">
            <input onChange={e => setInputComment(e.target.value)} value={inputComment} type="text" id="inputComment" name="inputComment" className="m-1 h-10 w-full rounded-lg border bg-white/0 p-3 text-sm outline-none border-gray-200"></input>
          </div>
          <div className="border-2 border-lime-600 flex flex-row justify-center">
            <button onClick={() => {saveComment()}} className="m-1 p-1 rounded-md bg-indigo-500 text-white">Save Comment</button>
          </div>
        </>
        */
      }
      {
        isUpdate && 
        <>
          <div className="border-2 border-lime-600 flex flex-row justify-center">
            <input onChange={e => setInputComment(e.target.value)} value={inputComment} type="text" id="inputComment" name="inputComment" className="m-1 h-10 w-full rounded-lg border bg-white/0 p-3 text-sm outline-none border-gray-200"></input>
          </div>
          <div className="border-2 border-lime-600 flex flex-row justify-center">
            <button onClick={() => {saveComment()}} className="m-1 p-1 rounded-md bg-indigo-500 text-white">Save Comment</button>
          </div>
        </>
      }
      
    </>
  );
}