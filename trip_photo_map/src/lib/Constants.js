export class Constants {

  static APP_VERSION = "v0.11";
  static APP_UUID = "BF0879EC-1A7A-4D70-9C57-1415E5A29170";

  static RESULTS_OK = "OK";
  static RESULTS_ERROR = "ERROR";

  static TRIP_STATE_INPUT = "TRIP_STATE_INPUT";
  //static TRIP_STATE_INPUT_COMPLETED = "TRIP_STATE_INPUT_COMPLETED";
  //static TRIP_STATE_CREATED = "TRIP_STATE_CREATED";
  static TRIP_STATE_LOADED = "TRIP_STATE_LOADED";
  static TRIP_STATE_PHOTOSB64_LOADED = "TRIP_STATE_PHOTOSB64_LOADED";
  static TRIP_STATE_SHOW_MAP = "TRIP_STATE_SHOW_MAP";

  static STATUS_AND_MESSAGE_INITIAL = {status:"", message:""};

  static SLIDER_LEFT_MOST = "SLIDER_LEFT_MOST";
  static SLIDER_LEFT = "SLIDER_LEFT";
  static SLIDER_RIGHT = "SLIDER_RIGHT";
  static SLIDER_RIGHT_MOST = "SLIDER_RIGHT_MOST";

  static PHOTO_UPLOAD_STATE = {
    FREE: "free",
    BUSY: "busy",
  }

  static PHOTO_UPLOAD_RESULT = {
    SUCCESS: "success",
    FAIL: "fail",
  }

  static CLASS_BUTTON_ACTIVE = "m-2 inline-block p-3 rounded-lg shadow-sm bg-indigo-500 text-white";
  static CLASS_BUTTON_INACTIVE = "m-2 inline-block p-3 rounded-lg shadow-sm bg-gray-500 text-white";
}
