import { UserDocument } from "../interfaces/inputInterfaces";

// this function is needed in order to convert user email into path string to be included to the browser
// the situation when function returns null theoretically should never happen, but I decided to include this double check

export const emailToPath = (user: UserDocument | null): string => {
  if (!user) {
    return "noname"
  }
  let path = user.email
    .toLowerCase()
    .replace(/@.*$/, "")
    .replace(/\./g, "-")
    .replace(/[^0-9a-z\-_]/gi, "");
  if (path) {
    return path;
  } else {
    return "noname";
  }
};

export default emailToPath;
