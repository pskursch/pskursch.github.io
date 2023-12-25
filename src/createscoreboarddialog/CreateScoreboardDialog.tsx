import React, {useState} from "react"
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";
import {createScoreboard} from "../data.ts";
import styles from "./CreateScoreboardDialog.module.css"

interface Props {
    open: boolean;
    closeDialog: () => void;
}

const CreateScoreboardDialog: React.FC<Props> = ({open, closeDialog}) => {
    const [name, setName] = useState("");
    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={"sm"}
        >
            <DialogTitle>
                Create scoreboard
            </DialogTitle>
            <DialogContent>
                <div className={styles.content}>
                    <div>
                        <Typography variant="subtitle1">
                            Name
                        </Typography>
                    </div>
                    <div>
                        <TextField
                            className={styles.textfield}
                            variant="outlined"
                            label=""
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    setName("");
                    closeDialog();
                }}>
                    Cancel
                </Button>
                <Button onClick={() => {
                    createScoreboard(name);
                    setName("");
                    closeDialog();
                }}>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default CreateScoreboardDialog;
