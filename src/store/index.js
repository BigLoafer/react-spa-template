import React from "react";
import { StoresContext } from "@/pages/main";

export const useStores = () => React.useContext(StoresContext);
