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

interface TextResourses {
  [key: string]: PropPair;
}

export interface LocalizedTextResourses {
  [key: string]: string;
}

const textResousesMultilang: TextResourses = {
  // general purposes text resourses
  appName: {
    EN: "Webapp template",
    DE: "Webapp Vorlage",
    UA: "Webapp шаблон",
    RU: "Webapp шаблон",
  },
  // navbar text resorses
  aboutAppLink: {
    EN: "About app",
    DE: "Über app",
    UA: "Про aплiкaцiю",
    RU: "Про приложение",
  },
  loginMenuItemText: {
    EN: "log in",
  },
  logoutMenuItemText: {
    EN: "log out",
  },
  registerMenuItemText: {
    EN: "register",
  },
  profileMenuItemText: {
    EN: "profile",
  },
  startingAppMenuItemText: {
    EN: "starting page",
  },
  startingAdminMenuItemText: {
    EN: "admin control panel",
  },
};

const getTextResourses = (language: AppLanguageOptions) => {
  const textResourses: LocalizedTextResourses = {};
  for (let prop in textResousesMultilang) {
    const item: PropPair = textResousesMultilang[prop];
    const languageSettings = AppLanguageOptions[language] as keyof PropPair;
    if (item[languageSettings]) {
      textResourses[prop] = item[languageSettings] as string;
    } else {
      textResourses[prop] = "...";
    }
  }
  return textResourses;
};

export default getTextResourses;
