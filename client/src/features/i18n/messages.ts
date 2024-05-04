import enUs from "./en-us";
import { LOCALES } from "./locales";
import zhCn from "./zh-cn";

export interface Message {
  menu: {
    monitoringGpus: string;
    gpuManagement: string;
    userManagement: string;
    notification: string;
    settings: string;
    help: string;
    about: string;
  };
}

export type LocalesKeys = keyof typeof LOCALES;
export type LocalesValues = (typeof LOCALES)[LocalesKeys];

export const messages: {
  [x in LocalesValues]: Message;
} = {
  [LOCALES.CHINESE]: zhCn,
  [LOCALES.ENGLISH]: enUs,
};
