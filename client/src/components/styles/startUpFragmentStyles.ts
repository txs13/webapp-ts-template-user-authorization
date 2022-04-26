import { ComponentStylesDatatype } from "./componentStylesDatatype";

const startUpFragmentStyles: ComponentStylesDatatype = {
  //main fragment frame
  fragmentFrame: {
    height: "100%",
    width: "100%",
    display: "grid",
    gridTemplateColumns: "auto",
    gridTemplateRows: "auto",
    alignItems: "center",
    justifyItems: "center",
  },
  // login box
  loginBoxFrame: {
    height: { xs: "100%", sm: "400px" },
    width: { xs: "100%", sm: "400px" },
    borderRadius: { xs: "none", sm: 5 },
    boxShadow: { xs: "none", sm: 3 },
    backgroundColor: "Window",
    display: "grid",
    gridTemplateColumns: "auto",
    gridTemplateRows: "auto",
    alignItems: "center",
    justifyItems: "center",
  },
  // logo and app name block
  logoSection: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "4px",
    borderRadius: "4px",
    userSelect: "none",
    marginTop: "20px",
    marginBottom: "10px",
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
};

export default startUpFragmentStyles;