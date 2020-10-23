import { makeStyles } from "@material-ui/core/styles";

makeStyles({
    root: {
      color: "#eaeaf0",
      display: "flex",
      height: 22,
      alignItems: "center"
    },
    active: {
      color: "#784af4"
    },
    circle: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      backgroundColor: "currentColor"
    },
    completed: {
      color: "#784af4",
      zIndex: 1,
      fontSize: 18
    }
});