import { ComponentStylesDatatype } from "../componentStylesDatatype";

const adminPanelStartingPageFragmentStyles: ComponentStylesDatatype = {
  fragmentFrame: {
    width: { xs: "100%", md: "100%" },
    height: { xs: "100%", md: "100%" },
  },
  container: {
    backgroundColor: "white",
    height: "100%"
  },
  gridFrame: {
    width: "100%",
  },
  textParagraph: {
    paddingTop: "1em",
    paddingBottom: "1em",
  },
  gridItem: {
  },
  chartBox: {
    width: "100%",
    height: "auto",
    display: "grid",
    gridTemplateRows: "auto",
    gridTemplateColumns: "auto",
    alignItems: "center",
    justifyItems: "center"
  },
};

export default adminPanelStartingPageFragmentStyles;