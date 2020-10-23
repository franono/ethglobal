import { container, title } from "../../material-kit-react.js";

const landingPageStyle = {
  container: {
    zIndex: "12",
    color: "#000000",
    ...container
  },
  title: {
    ...title,
    display: "inline-block",
    fontSize: "2.25rem",
    position: "center",
    marginTop: "0px",
    minHeight: "32px",
    color: "#630000",
    textDecoration: "none"
  },
  title2: {
    textAlign: 'center', // <-- the magic
    fontSize: "2.25rem",
    marginTop: "0px",
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: "1.313rem",
    maxWidth: "500px",
    margin: "10px auto 0"
  },
  subtitle2: {
    fontSize: "1.313rem",
    maxWidth: "500px",
    margin: "10px auto 0",
    color: "#FFFFFF",
  },
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },
  submain: {
    background: "#630000",
    position: "relative",
    zIndex: "3"
  },
  submainRaised: {
    margin: "0px 30px 30px 30px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  },
  mainRaised: {
    margin: "-140px 30px 0px 30px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  },
  particleswrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: "20"
  }
};

export default landingPageStyle;
