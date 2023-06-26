import {timeLog} from "./PCKUtils";
import {Constants} from "./Constants";

export class TripPhotoMapEngine {

  static uploadPhotosAsync(tripName, accessToken, username, photos, cbUploadResult) {
    timeLog(`TripPhotoMapEngine.uploadPhotosAsync: 1.0;`);
    let uploadPromises = [];
    for (let aPhoto of photos) {
      let anUploadPromise = fetch(`/api/trip/access/${accessToken}/upload/${username}`, {
        method: 'post',
        body: aPhoto,
      }); 
      uploadPromises.push(anUploadPromise);
    }
    for (const anUploadPromise of uploadPromises) {
      anUploadPromise.then((response) => {
        response.json().then((respJson) => {
          if (respJson.status == Constants.RESULTS_OK) {
            cbUploadResult(Constants.PHOTO_UPLOAD_RESULT.SUCCESS);
          } else {
            cbUploadResult(Constants.PHOTO_UPLOAD_RESULT.FAIL);
          }
        });
      });
    }
    return uploadPromises;
  }

  static async loginTrip(tripName, passphrase, username, isCreateTrip = false) {
    timeLog(`TripPhotoMapEngine.loginTrip: tripName:${tripName}; passphrase:${passphrase}; username:${username}; isCreateTrip:${isCreateTrip};`);

    let status = Constants.RESULTS_ERROR;
    let message = "";
    let viewToken = "";
    let writeToken = "";
    let url = isCreateTrip ? "/api/trip/create" : "/api/trip/login";
    const response = await fetch(url, {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
       tripName,
       passphrase,
      })
    });
    let respJson = await response.json();
    //timeLog(`__respJson:[${JSON.stringify(respJson)}];`)
    status = respJson.status;
    message = respJson.message;
    if (status != Constants.RESULTS_OK) {
    } else {
      viewToken = respJson.data.viewToken;
      writeToken = respJson.data.writeToken;
    }
    return {status, message, viewToken, writeToken};
  }

  static async getPhotosMetadata(accessToken, isSortAscending = false) {
    const response = await fetch(`/api/trip/access/${accessToken}/photosMetadata`, {
      method: "get",
      headers: {'Content-Type':'application/json'},
    });
    let respJson = await response.json();
    let data = respJson.data;
    let photosMetadata = data.photosMetadata != undefined ? data.photosMetadata : [];
    if (isSortAscending) {
      photosMetadata.sort((a, b) => {return a.timestamp - b.timestamp});
    }
    return photosMetadata;
  }

  static async getPhotoThumbnailB64(accessToken, photoId) {
    //timeLog(`TripPhotoMapEngine.getPhotoThumbnailB64: accessToken:${accessToken}; photoId:${photoId};`);
    
    const responseThumbnail = await fetch(`/api/trip/access/${accessToken}/thumbnails/${photoId}`, {
      method: "get",
      headers: {'Content-Type':'application/json'},
    });
    let thumbnailJson = await responseThumbnail.json();
    return thumbnailJson.data.thumbnailB64;
  }

  static async getPhotoB64(accessToken, photoId) {
    //timeLog(`TripPhotoMapEngine.getPhotoThumbnailB64: accessToken:${accessToken}; photoId:${photoId};`);
    
    const responsePhoto = await fetch(`/api/trip/access/${accessToken}/photos/${photoId}`, {
      method: "get",
      headers: {'Content-Type':'application/json'},
    });
    let photoJson = await responsePhoto.json();
    return photoJson.data.photoB64;
  }

  static async getPhotosMetadataAndThumbnailB64(accessToken, isSortAscending = false) {
    let photosMetadataAndThumbnailB64 = [];
    let photosMetadata = await TripPhotoMapEngine.getPhotosMetadata(accessToken, isSortAscending);
    for (let i = 0; i < photosMetadata.length; i++) {
      let aPhotoMetadata = photosMetadata[i];
      let thumbnailB64 = await TripPhotoMapEngine.getPhotoThumbnailB64(accessToken, aPhotoMetadata.photoID);
      //timeLog(`__photoID:[${aPhotoMetadata.photoID}]:b64:[${thumbnailB64}];`);
      photosMetadataAndThumbnailB64.push({...aPhotoMetadata, thumbnailB64});
    }
    return photosMetadataAndThumbnailB64;
  }

  static async deletePhoto(accessToken, photoId) {
    timeLog(`TripPhotoMapEngine.deletePhoto: accessToken:${accessToken}; photoId:${photoId};`);

    const responseDeleted = await fetch(`/api/trip/access/${accessToken}/photos/${photoId}`, {
      method: "delete",
      headers: {'Content-Type':'application/json'},
    });
    let deletedJson = await responseDeleted.json();
    //timeLog(`TripPhotoMapEngine.deletePhoto: deletedJson:[${JSON.stringify(deletedJson)}];`);
    let status = deletedJson.status;
    let message = deletedJson.message;
    //timeLog(`__status:[${status}]; message:[${message}];`)
    return {status, message};
  }
}