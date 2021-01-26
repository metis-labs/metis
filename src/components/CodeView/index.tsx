import React from "react";
import {createStyles, makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            marginTop: "64px",
            height: "calc(100vh - 64px)",
            backgroundColor: "#eaeaeb",
        },
    }),
);

export default function CodeView() {
    const classes = useStyles();
    return <div className={classes.root}>CodeView</div>;
}
