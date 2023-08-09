import {timeLog} from "../lib/PCKUtils";
import Link from 'next/link';
import {Constants} from "../lib/Constants";

export default function Landing() {
  timeLog(`index.Landing: 1.2;`);
  return (
    <div>
      <p>This is Landing. [{Constants.APP_VERSION}]<br/>APP_UUID:[{Constants.APP_UUID.substring(0,4)}]</p>
      <p>Go to <Link href="admin">Admin page</Link></p>
      <p>Go to <Link href="trip-login">Trip Login page</Link></p>
    </div>
  );
}