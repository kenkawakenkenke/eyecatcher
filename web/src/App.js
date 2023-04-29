import './App.css';
import { BrowserRouter, Routes, Route, Switch } from 'react-router-dom';
import TopPage from './pages/top';
import DebugPage from './pages/debug';
import { initializeApp, getApp } from 'firebase/app';
import 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

function App({ firebaseConfig }) {
  initializeApp(firebaseConfig);

  console.log("env: " + process.env.NODE_ENV + " Emulator:" + process.env.REACT_APP_FIREBASE_USE_EMULATOR);
  if (process.env.REACT_APP_FIREBASE_USE_EMULATOR == "true") {
    const functions = getFunctions(getApp());
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    console.log("set emulator");
  }
  // if (!firebase.apps.length) {
  // }

  return (
    <BrowserRouter>
      <Route exact path="/" component={TopPage} />
      <Route path="/debug" component={DebugPage} />
    </BrowserRouter>
  );
}

export default App;
