import { ComponentStylesDatatype } from "../componentStylesDatatype";

const adminPanelUserListFragmentStyles: ComponentStylesDatatype = {
  mainFrame: {},
  inputsBlock: {},
  inputField: {
    marginTop: "4px",
    marginBottom: "4px",
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "black",
    },
  },
};

export default adminPanelUserListFragmentStyles;
