interface PropPair {
    EN?: string;
    DE?: string;
    UA?: string;
    RU?: string;
}

interface TextResourses {
    [key: string]: PropPair
}

interface LocalizedTextResourses {
    [key: string]: string
}

const textResousesMultilang: TextResourses = {
  // general purposes text resourses
  appName: {
    EN: "Webapp template",
  },
};


const getTextResourses = (language: "EN" | "DE" | "UA" | "RU") => {
  const textResourses: LocalizedTextResourses = {};
  for (let prop in textResousesMultilang) {
    textResourses[prop] = textResousesMultilang[prop][language] as string;
  }
  return textResourses;
};

export default getTextResourses;
