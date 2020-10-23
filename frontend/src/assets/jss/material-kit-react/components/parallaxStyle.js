const parallaxStyle = {
  parallax: {
    height: "90vh",
    maxHeight: "800px",
    overflow: "hidden",
    position: "relative",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    // background: "rgba(60, 140, 177)",
    // background: "rgba(32, 119, 159)",
    // background: "#007EA7",    
    margin: "0",
    padding: "0",
    border: "0",
    display: "flex",
    alignItems: "center"
  },
  filter: {
    "&:before": {
      background: "rgba(0, 0, 0, 0.5)"
    },
    "&:after,&:before": {
      position: "absolute",
      zIndex: "1",
      width: "100%",
      height: "100%",
      display: "block",
      left: "0",
      top: "0",
      content: "''"
    }
  },
  small: {
    height: "380px"
  },
  image:{
    backgroundPosition: "center center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat"
  }
};

export default parallaxStyle;
