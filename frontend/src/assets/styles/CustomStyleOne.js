import { makeStyles } from "@material-ui/core/styles";

makeStyles(theme => ({
    root: {
      width: "90%",
      padding: theme.spacing(3, 2)
    },
    button: {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      color: "#000000"
    },
    grid: {
      marginBottom: theme.spacing(2),
      color: "#000000"
    },
    steps: {
      margin: theme.spacing(2),
    }
  }));