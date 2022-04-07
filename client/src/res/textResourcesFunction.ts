import {textResourcesMultilang} from './textResourcesConst'

export enum AppLanguageOptions {
  "EN",
  "DE",
  "UA",
  "RU",
}

interface PropPair {
  EN?: string;
  DE?: string;
  UA?: string;
  RU?: string;
}

export interface TextResources {
  [key: string]: PropPair;
}

export interface LocalizedTextResources {
  [key: string]: string;
}

const getTextResources = (language: AppLanguageOptions) => {
  const textResourses: LocalizedTextResources = {};
  for (let prop in textResourcesMultilang) {
    const item: PropPair = textResourcesMultilang[prop];
    const languageSettings = AppLanguageOptions[language] as keyof PropPair;
    if (item[languageSettings]) {
      textResourses[prop] = item[languageSettings] as string;
    } else {
      textResourses[prop] = "...";
    }
  }
  return textResourses;
};

export default getTextResources;
