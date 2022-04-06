import { ComponentStylesDatatype } from "./componentStylesDatatype";

const navbarStyles: ComponentStylesDatatype = {
  // whole navbar frame
  appbar: {
    padding: "0",
    position: "relative",
  },
  toolbar: {
    padding: "0",
  },
  // log and appname box
  logoSection: {
    position: "absolute",
    left: "0px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "4px",
    borderRadius: "4px",
    "&:hover": {
      cursor: "pointer",
    },
    userSelect: "none",
  },
  logoSectionPictureBox: {
    height: "auto",
    marginLeft: "5px",
    display: "flex",
    flexDirection: "column",
  },
  logoPicture: {
    padding: "0",
    margin: "0",
    fill: "",
  },
  logoSectionText: {
    marginLeft: "10px",
    marginRight: "5px",
    fontWeight: "700",
  },
  // site navigation links box
  siteLinksSection: {
    position: "absolute",
    right: "80px",
  },
  aboutAppLink: {
    "&:hover": {
      cursor: "pointer",
    },
    userSelect: "none",
  },
  // site menu box
  siteMenuBox: {
    position: "absolute",
    right: "10px",
  },
  menuButton: {
    p: 0,
  },
  menuButtonIcon: {
    fill: "Window",
  },
};

export default navbarStyles;
