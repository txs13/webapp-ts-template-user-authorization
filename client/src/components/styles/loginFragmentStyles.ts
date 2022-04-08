import { ComponentStylesDatatype } from "./componentStylesDatatype";

const loginFragmentStyles: ComponentStylesDatatype = {
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
    height: { xs: "100%", sm: "auto" },
    width: { xs: "100%", sm: "400px" },
    borderRadius: { xs: "none", sm: 5 },
    boxShadow: { xs: "none", sm: 3 },
    backgroundColor: "Window",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
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
  // alert infobox block
  alertSection: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  alert: {

  },
  // user input block
  userInputSection: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  emailInput: {
    width: "100%",
  },
  passwordInput: {
    width: "100%",
  },
  rememberUserEmailChkBox: {},
  // button block
  buttonsSection: {
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "10px",
  },
  buttonGroup: {
    width: "100%",
  },
  loginButton: {},
  registerButton: {},
};

export default loginFragmentStyles;