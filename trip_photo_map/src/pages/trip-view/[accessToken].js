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

  useEffect(() => {
    timeLog(`TripViewDynamic.useEffect[router]: 1.0`); 
    async function fetchPhotosData() {
      let accessToken = router.query.accessToken;
      timeLog(`TripViewDynamic.useEffect: 1.0; accessToken:[${accessToken}];`);
      if (accessToken == undefined) {
        return;
      }
      let photosData = await TripPhotoMapEngine.getPhotosMetadataAndThumbnailB64(accessToken, true);  
      let usersSet = new Set();
      for (let i = 0; i < photosData.length; i++) {
        usersSet.add(photosData[i].uploadedBy);
      }
      let newUsers = [];
      for (let aUser of usersSet) {
        newUsers.push({name:aUser,isShow:true});
      }
      setUsers(newUsers);
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
    timeLog(`TripViewDynamic.useEffect[users]: 1.0`);
    let showUsersSet = new Set();
    for (let aUser of users) {
      if (aUser.isShow) {
        showUsersSet.add(aUser.name);
      }
    }
    let filteredPhotosData = photosDataFull.filter(aPhotoData => showUsersSet.has(aPhotoData.uploadedBy));
    timeLog(`__filteredPhotosData.length:[${filteredPhotosData.length}];`)
    setPhotosData(filteredPhotosData);
    setCurrentPos(0);
  }, [users]);
  
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