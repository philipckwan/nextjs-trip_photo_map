import '../app/globals.css';
import {timeLog} from "../lib/PCKUtils";

export default function MyApp({ Component, pageProps }) {
  timeLog(`_app.MyApp: 1.2;`);
  return <Component {...pageProps} />;
}