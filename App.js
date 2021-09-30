import * as React from "react";
import { LogBox } from "react-native";
import RootNavigation from "./app/navigation/Navigation";

LogBox.ignoreLogs(["Setting a timer"]);

export default function App() {
  return <RootNavigation />;
}
