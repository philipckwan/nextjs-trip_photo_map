import '../app/globals.css';
import {timeLog} from "../lib/PCKUtils";
import {AppDisabled} from '@/components/AppDisabled';

export default function MyApp({ Component, pageProps }) {
  //timeLog(`_app.MyApp: 1.2;`);
  let isAppEnabled = process.env.NEXT_PUBLIC_APP_ENABLE == "true";
  //timeLog(`MyApp: 1.2: isAppEnabled:[${isAppEnabled}];`);
  if (isAppEnabled) {
    return <Component {...pageProps} />;
  } else {
    return <AppDisabled></AppDisabled>;
  }
  
}