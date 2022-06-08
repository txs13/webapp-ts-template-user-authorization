import { ComponentStylesDatatype } from "./componentStylesDatatype";

const profileFragmentStyles: ComponentStylesDatatype = {
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
  userCardFrame: {
    backgroundColor: "Window",
    borderRadius: { xs: "none", sm: 5 },
    boxShadow: { xs: "none", sm: 3 },
    padding: "10px",
    width: {
      xs: "100%",
      sm: "80%",
      md: "70%",
      lg: "60%",
      xl: "50%",
    },
    display: "grid",
    gridTemplateColumns: { sx: "auto", md: "auto auto" },
    gap: "10px",
  },
  inputField: {
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "black",
    },
  },
  buttonGroup: {
    gridColumn: { xs: "span 1", md: "span 2" },
  },
  cardHeader: {
      marginTop: "auto",
      marginBottom: "auto",
      marginLeft: "5px"
  },
};

export default profileFragmentStyles;
