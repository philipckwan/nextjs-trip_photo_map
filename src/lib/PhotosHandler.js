import {timeLog} from "./PCKUtils";

/**
 * usernames == undefined --> select all
 * usernames == [] --> select none
 * usernames == [...] --> select names
 */
export function filterPhotosByUsernames(photos, usernames = undefined) {
  if (usernames == undefined) return photos;
  if (usernames.length == 0) return [];
  let usernameSet = new Set();
  usernames.map(aName => usernameSet.add(aName));
  timeLog(`filterPhotosByUsernames: usernameSet.size:[${usernameSet.size}];`);
  let photosFiltered = photos.filter(({uploadedBy}) => usernameSet.has(uploadedBy));
  return photosFiltered;
}

export function getUsernamesFromPhotos(photos) {
  let usernameSet = new Set();
  photos.map(({uploadedBy}) => {usernameSet.add(uploadedBy)});
  return Array.from(usernameSet);
}

/**
 * dates == undefined --> select all
 * dates == [] --> select none
 * dates == [...] --> select dates
 */
export function filterPhotosByDates(photos, dates = undefined) {
  if (dates == undefined) return photos;
  if (dates.length == 0) return [];
  let dateSet = new Set();
  dates.map(aDate => dateSet.add(aDate));
  timeLog(`filterPhotosByDates: dateSet.size:[${dateSet.size}];`);
  let photosFiltered = photos.filter(({timestamp}) => {
    let d = new Date(timestamp);
    let year = d.getFullYear();
    let month = d.getMonth()+1;
    let date = d.getDate();
    let dateStr = `${year}-${month.toString().padStart(2,"0")}-${date.toString().padStart(2,"0")}`;
    return dateSet.has(dateStr);
  });
  return photosFiltered;
}

export function getDatesFromPhotos(photos, isSortAscending = false) {
  let dateSet = new Set();

  if (isSortAscending) {
    photos.sort((a, b) => {return a.timestamp - b.timestamp});
  }

  photos.map(({timestamp}) => {
    let d = new Date(timestamp);
    let year = d.getFullYear();
    let month = d.getMonth()+1;
    let date = d.getDate();
    let dateStr = `${year}-${month.toString().padStart(2,"0")}-${date.toString().padStart(2,"0")}`;
    dateSet.add(dateStr);
  });
  return Array.from(dateSet);
}

export function photoToString(aPhoto) {
  return `[ photoID:${aPhoto.photoID}, datetime:${aPhoto.datetime}, timestamp:${aPhoto.timestamp}, latitude:${aPhoto.latitude.toFixed(4)}, longitude:${aPhoto.longitude.toFixed(4)}, uploadedBy:${aPhoto.uploadedBy}, thumbnailB64:${aPhoto.thumbnailB64.substring(0, 10)}..., ]`;
}