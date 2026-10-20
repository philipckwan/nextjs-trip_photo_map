import {timeLog} from "@/lib/PCKUtils";
import {photoToString, getUsernamesFromPhotos, filterPhotosByUsernames, getDatesFromPhotos, filterPhotosByDates} from "@/lib/PhotosHandler";
import { TripPhotoMapEngine } from "@/lib/TripPhotoMapEngine";

const TOKEN = "HWweJY6VgHOM";
export default function Test() {
  timeLog(`Test: 1.0;`);

  async function runTest() {
    let photos = await TripPhotoMapEngine.getPhotosMetadataAndThumbnailB64(TOKEN);
    timeLog(`__photos.length:[${photos.length}];`);
    for (let i = 0; i < photos.length; i++) {
      let aPhoto = photos[i];
      timeLog(`__photo[${i}]; [${photoToString(aPhoto)}];`)
    }
    /*
    timeLog(`__calling getUsernamesFromPhotos("philip");`);
    let usernames = getUsernamesFromPhotos(photos);
    usernames.map((aName) => {timeLog(`__aName:${aName};`)});

    timeLog(`__calling filterPhotosByUsernames(["philip"]);`);
    let filterUserNames = undefined;
    let photosFiltered = filterPhotosByUsernames(photos, filterUserNames);

    timeLog(`__photosFiltered.length:[${photosFiltered.length}];`);
    for (let i = 0; i < photosFiltered.length; i++) {
      let aPhoto = photosFiltered[i];
      timeLog(`__photo[${i}]; [${photoToString(aPhoto)}];`)
    }
    */
    timeLog(`__calling getDatesFromPhotos;`);
    let dates = getDatesFromPhotos(photos, true);
    dates.map((aDate) => {timeLog(`__aDate:${aDate};`)});
    timeLog(`__calling filterPhotosByDates(["2023-04-04", "2023-04-06"]);`);
    let filterDates = ["2023-04-04", "2023-04-06", "2023-04-08"];

    let photosFiltered = filterPhotosByDates(photos, filterDates);

    timeLog(`__photosFiltered.length:[${photosFiltered.length}];`);
    for (let i = 0; i < photosFiltered.length; i++) {
      let aPhoto = photosFiltered[i];
      timeLog(`__photo[${i}]; [${photoToString(aPhoto)}];`)
    }
  }

  return(
    <div>
      <div>Running Test</div>
      <div><button onClick={runTest} className="m-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white" >Run Test</button></div>
    </div>
  )
}