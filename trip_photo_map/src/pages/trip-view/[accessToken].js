import {timeLog} from "@/lib/PCKUtils";
import {useState, useEffect} from "react";
import {Constants} from "@/lib/Constants";
import {useRouter} from "next/router";
import {TripPhotoMapEngine} from "@/lib/TripPhotoMapEngine";
import Link from 'next/link';
import Image from 'next/image'
import {PhotosMap} from "@/components/PhotosMap"
import { Modal } from "@/components/Modal";
import { DummyImage } from "@/components/DummyImage";
import {photoToString, getUsernamesFromPhotos, filterPhotosByUsernames, getDatesFromPhotos, filterPhotosByDates} from "@/lib/PhotosHandler";


export default function TripViewDynamic() {
  const router = useRouter();
  const [photosData, setPhotosData] = useState([]);
  const [photosDataFull, setPhotosDataFull] = useState([]);
  const [photoLeft, setPhotoLeft] = useState();
  const [photoLeftMid, setPhotoLeftMid] = useState();
  const [photoMid, setPhotoMid] = useState();
  const [photoRightMid, setPhotoRightMid] = useState();
  const [photoRight, setPhotoRight] = useState();
  const [currentPos, setCurrentPos] = useState(0);
  const [isShowPhotoMap, setIsShowPhotoMap] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalPhoto, setModalPhoto] = useState("");
  const [accessToken, setAccessToken] = useState();
  const [users, setUsers] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    timeLog(`TripViewDynamic.useEffect[router]: 1.0`); 
    async function fetchPhotosData() {
      let accessToken = router.query.accessToken;
      timeLog(`TripViewDynamic.useEffect: 1.0; accessToken:[${accessToken}];`);
      if (accessToken == undefined) {
        return;
      }
      let photosData = await TripPhotoMapEngine.getPhotosMetadataAndThumbnailB64(accessToken, true);  
      let users = getUsernamesFromPhotos(photosData);
      let dates = getDatesFromPhotos(photosData);
      /*
      let usersSet = new Set();
      for (let i = 0; i < photosData.length; i++) {
        usersSet.add(photosData[i].uploadedBy);
      }
      let newUsers = [];
      for (let aUser of usersSet) {
        newUsers.push({name:aUser,isShow:true});
      }
      */
      setUsers(users.map(name => ({name, isShow:true})));
      setDates(dates.map(date => ({date, isShow:true})));
      setPhotosDataFull(photosData);
      setPhotosData(photosData);
      setIsShowPhotoMap(true);
      setAccessToken(accessToken);
    }
    if (photosData.length == 0) {
      fetchPhotosData();
    }
  }, [router]);

  useEffect(() => {
    timeLog(`TripViewDynamic.useEffect[photosData, currentPos]: photosData.length:[${photosData.length}]; currentPos:[${currentPos}];`);
    //if (photosData.length == 0) {
    //  return;
    //}

    setPhotoMid(photosData[currentPos] != undefined ? photosData[currentPos].thumbnailB64 : "");
    setPhotoLeft(photosData[currentPos - 2] != undefined ? photosData[currentPos - 2].thumbnailB64 : "");
    setPhotoLeftMid(photosData[currentPos - 1] != undefined ? photosData[currentPos - 1].thumbnailB64 : "");
    setPhotoRightMid(photosData[currentPos + 1] != undefined ? photosData[currentPos + 1].thumbnailB64 : "");
    setPhotoRight(photosData[currentPos + 2] != undefined ? photosData[currentPos + 2].thumbnailB64 : "");

  }, [photosData, currentPos]);

  useEffect(() => {
    timeLog(`TripViewDynamic.useEffect[users, dates]: 1.0`);
    /*
    let showUsersSet = new Set();
    for (let aUser of users) {
      if (aUser.isShow) {
        showUsersSet.add(aUser.name);
      }
    }
    let filteredPhotosData = photosDataFull.filter(aPhotoData => showUsersSet.has(aPhotoData.uploadedBy));
    */
    let showUsersList = users.filter(({isShow}) => isShow).map(({name}) => name);
    let showDatesList = dates.filter(({isShow}) => isShow).map(({date}) => date);

    let filteredPhotosData = filterPhotosByDates(filterPhotosByUsernames(photosDataFull, showUsersList), showDatesList);

    timeLog(`TripViewDynamic.useEffect[users, dates]: filteredPhotosData.length:[${filteredPhotosData.length}];`)
    setPhotosData(filteredPhotosData);
    setCurrentPos(0);
  }, [users, dates]);
  
  function moveSlider(direction) {
    switch(direction) {
      case Constants.SLIDER_LEFT_MOST:
        setCurrentPos(0);
        break;
      case Constants.SLIDER_LEFT:
        setCurrentPos(currentPos > 0 ? currentPos - 1 : currentPos);
        break;
      case Constants.SLIDER_RIGHT:
        setCurrentPos(currentPos + 1 < photosData.length ? currentPos + 1 : currentPos);
        break;
      case Constants.SLIDER_RIGHT_MOST:
        setCurrentPos(photosData.length - 1);
        break;
    }
  }

  async function openImage(pos) {
    let openIdx = currentPos + pos;
    if (openIdx < 0 || openIdx >= photosData.length) {
      return;
    }
    let photoID = photosData[currentPos + pos].photoID;
    let photoB64 = await TripPhotoMapEngine.getPhotoB64(accessToken, photoID);  
    setModalPhoto({...photosData[currentPos + pos], photoB64});
    setShowModal(true);
  }

  async function toggleShowUser(name) {
    let newUsers = [];
    for (let i = 0; i < users.length; i++) {
      let aUser = users[i];
      if (aUser.name == name) {
        aUser.isShow = !aUser.isShow;
      } 
      newUsers.push(aUser);
    }
    setUsers(newUsers);
  }

  async function toggleShowUserAllNone() {
    timeLog(`TripViewDynamic.toggleShowUserAllNone: 1.0;`);
    let usersShow = users.filter(({isShow}) => isShow);
    if (usersShow.length > 0) {
      // set all to isShow:false
      setUsers(users.map(({name}) => ({name, isShow:false})));
    } else {
      // set all to isShow:true
      setUsers(users.map(({name}) => ({name, isShow:true})));
    }
  }

  async function toggleShowDate(date) {
    //timeLog(`TripViewDynamic.toggleShowDate: date.date:[${date.date}];`)
    let newDates = [];
    for (let i = 0; i < dates.length; i++) {
      let aDate = dates[i];
      if (aDate.date == date) {
        aDate.isShow = !aDate.isShow;
      } 
      newDates.push(aDate);
    }
    setDates(newDates);
  }

  async function toggleShowDateAllNone() {
    timeLog(`TripViewDynamic.toggleShowDateAllNone: 1.0;`);
    let datesShow = dates.filter(({isShow}) => isShow);
    if (datesShow.length > 0) {
      // set all to isShow:false
      setDates(dates.map(({date}) => ({date, isShow:false})));
    } else {
      // set all to isShow:true
      setDates(dates.map(({date}) => ({date, isShow:true})));
    }
  }

  return (
    <div onClick={() => setShowModal(false)} className="flex flex-col justify-center">
      
      <div className="flex flex-row m-2 justify-center">
        <div className="w-1/6">
          {photoLeft != undefined && photoLeft.length > 0 ? <img onClick={() => openImage(-2)} className="m-1 border shadow-lg" src={`data:image/jpeg;base64,${photoLeft}`} /> : <></>}
        </div>
        <div className="w-1/6">
          {photoLeftMid != undefined && photoLeftMid.length > 0 ? <img onClick={() => openImage(-1)} className="m-1 border shadow-lg" src={`data:image/jpeg;base64,${photoLeftMid}`} /> : <></>}
        </div>
        <div className="w-1/4">
          {photoMid != undefined && photoMid.length > 0 ? <img onClick={() => openImage(0)} className="my-1 mx-auto border border-lime-600 border-4 rounded-md shadow-lg" src={`data:image/jpeg;base64,${photoMid}`} /> : <></>}
        </div>
        <div className="w-1/6">
          {photoRightMid != undefined && photoRightMid.length > 0 ? <img onClick={() => openImage(1)} className="m-1 border shadow-lg" src={`data:image/jpeg;base64,${photoRightMid}`} /> : <></>}
        </div>
        <div className="w-1/6">
          {photoRight != undefined && photoRight.length > 0 ? <img onClick={() => openImage(2)} className="m-1 border shadow-lg" src={`data:image/jpeg;base64,${photoRight}`} /> : <></>}
        </div>
      </div>
      
      <div className="flex flex-row m-4 justify-evenly">
        <Image className="mx-2" src="/images/left_double_arrow.jpg" onClick={() => moveSlider(Constants.SLIDER_LEFT_MOST)} alt="left_arrow" width="50" height="50" />
        <Image className="mx-2" src="/images/left_arrow.jpg" onClick={() => moveSlider(Constants.SLIDER_LEFT)} alt="left_arrow" width="50" height="50" />
        <Image className="mx-2" src="/images/right_arrow.jpg" onClick={() => moveSlider(Constants.SLIDER_RIGHT)} alt="left_arrow" width="50" height="50" />
        <Image className="mx-2" src="/images/right_double_arrow.jpg" onClick={() => moveSlider(Constants.SLIDER_RIGHT_MOST)} alt="left_arrow" width="50" height="50" />
      </div>
      <div className="flex flex-row justify-center m-1">
        <div className="m-1 p-1">Uploaded By:</div>
        {users.map(({name, isShow}, index) => {
            const buttonClass = isShow ? "m-1 p-1 rounded-md bg-indigo-500 text-white" : "m-1 p-1 rounded-md bg-gray-500 text-white";
            return (
                  <button key={name} onClick={() => {toggleShowUser(name)}} className={buttonClass}>{name}</button>
            )}
        )}
        <button onClick={() => {toggleShowUserAllNone()}} className={users.filter(({isShow}) => isShow).length > 0 ? "m-1 p-1 rounded-md bg-indigo-500 text-white" : "m-1 p-1 rounded-md bg-gray-500 text-white"}>{ users.filter(({isShow}) => isShow).length > 0 ? "None" : "All"}</button>
      </div>
      <div className="flex flex-row justify-center m-1">
        <div className="m-1 p-1">Date:</div>
        {dates.map(({date, isShow}, index) => {
            const buttonClass = isShow ? "m-1 p-1 rounded-md bg-indigo-500 text-white" : "m-1 p-1 rounded-md bg-gray-500 text-white";
            return (
                  <button key={date} onClick={() => {toggleShowDate(date)}} className={buttonClass}>{date}</button>
            )}
        )}
        <button onClick={() => {toggleShowDateAllNone()}} className={dates.filter(({isShow}) => isShow).length > 0 ? "m-1 p-1 rounded-md bg-indigo-500 text-white" : "m-1 p-1 rounded-md bg-gray-500 text-white"}>{ dates.filter(({isShow}) => isShow).length > 0 ? "None" : "All"}</button>
      </div>
      <div className="justify-evenly w-4/5 mx-auto">
        {
          /*<DummyImage></DummyImage>*/
          isShowPhotoMap ? <div><PhotosMap photosAll={photosData} currentPos={currentPos}></PhotosMap></div> : <></>
        }
      </div>
      {
      <div>
        {showModal ? <Modal photo={modalPhoto} setShowModal={setShowModal}></Modal> : <></>}
      </div>
      }
    </div>
  );
}