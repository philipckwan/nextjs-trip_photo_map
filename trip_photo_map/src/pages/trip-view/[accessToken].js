import {timeLog} from "@/lib/PCKUtils";
import {useState, useEffect} from "react";
import {Constants} from "@/lib/Constants";
import {useRouter} from "next/router";
import {TripPhotoMapEngine} from "@/lib/TripPhotoMapEngine";
import Link from 'next/link';
import {PhotosMap} from "@/components/PhotosMap"


export default function TripViewDynamic() {
  const router = useRouter();
  const [photosData, setPhotosData] = useState([]);
  const [photoLeft, setPhotoLeft] = useState();
  const [photoLeftMid, setPhotoLeftMid] = useState();
  const [photoRightMid, setPhotoRightMid] = useState();
  const [photoRight, setPhotoRight] = useState();
  const [currentPos, setCurrentPos] = useState(0);
  const [isShowPhotoMap, setIsShowPhotoMap] = useState(false);

  useEffect(() => {
    async function fetchPhotosData() {
      let accessToken = router.query.accessToken;
      timeLog(`TripViewDynamic.useEffect: 1.0; accessToken:[${accessToken}];`);
      if (accessToken == undefined) {
        return;
      }
      let photosData = await TripPhotoMapEngine.getPhotosMetadataAndThumbnailB64(accessToken, true);  
      setPhotosData(photosData);
      setIsShowPhotoMap(true);
    }
    fetchPhotosData();
  }, [router]);

  useEffect(() => {
    timeLog(`TripViewDynamic.useEffect: currentPos:[${currentPos}];`);

    if (currentPos < photosData.length) {
      setPhotoLeft(photosData[currentPos].thumbnailB64);
    } else {
      setPhotoLeft(Constants.IMAGE_RIGHT_MOST);
    }
    
    if (currentPos + 1 < photosData.length) {
      setPhotoLeftMid(photosData[currentPos + 1].thumbnailB64);
    } else {
      setPhotoLeft(Constants.IMAGE_RIGHT_MOST);
    }

    if (currentPos + 2 < photosData.length) {
      setPhotoRightMid(photosData[currentPos + 2].thumbnailB64);
    } else {
      setPhotoLeft(Constants.IMAGE_RIGHT_MOST);
    }

    if (currentPos + 3 < photosData.length) {
      setPhotoRight(photosData[currentPos + 3].thumbnailB64);
    } else {
      setPhotoRight(Constants.IMAGE_RIGHT_MOST);
    }
  }, [photosData, currentPos]);
  
  function goLeft() {
    if (currentPos > 0) {
      setCurrentPos(currentPos - 1);
    }
  }

  function goRight() {
    if (currentPos + 4 < photosData.length) {
      setCurrentPos(currentPos + 1);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-row max-h-60">
        <img className="m-1" src={`data:image/jpeg;base64,${photoLeft}`} />
        <img className="m-1" src={`data:image/jpeg;base64,${photoLeftMid}`} />
        <img className="m-1" src={`data:image/jpeg;base64,${photoRightMid}`} />
        <img className="m-1" src={`data:image/jpeg;base64,${photoRight}`} />
      </div>
      <div className="flex flex-row">
        <Link className="m-2 text-blue-400 no-underline hover:underline" onClick={goLeft} href="#">Left</Link>
        <Link className="m-2 text-blue-400 no-underline hover:underline" onClick={goRight} href="#">Right</Link>
      </div>
      <div className="max-w-max max-h-max justify-center items-center">
        ------------------------------------------------------------------------------------------------------
        {isShowPhotoMap ? <PhotosMap photosAll={photosData}></PhotosMap> : <></>}
      </div>
    </div>
  );
}