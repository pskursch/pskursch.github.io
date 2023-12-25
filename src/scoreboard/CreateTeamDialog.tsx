import React, {useState} from "react"
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {createTeam, Scoreboard, useGetTeams} from "../data.ts";
import styles from "./CreateTeamDialog.module.css"

interface Props {
    open: boolean;
    closeDialog: () => void;
    scoreboard: Scoreboard
}

const CreateTeamDialog: React.FC<Props> = ({open, closeDialog, scoreboard}) => {
    const [name, setName] = useState("");
    const [numberOfPlayers, setNumberOfPlayers] = useState(0);
    const teams = useGetTeams(scoreboard);
    const throwIndex = teams ? teams.length : 0;

    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={"sm"}
        >
            <DialogTitle>
                Create team
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
                    <div>
                        <Typography variant="subtitle1">
                            Number of players
                        </Typography>
                    </div>
                    <div>
                        <FormControl fullWidth>
                            <Select
                                value={numberOfPlayers}
                                label=""
                                onChange={e => setNumberOfPlayers(e.target.value as number)}
                            >
                                <MenuItem value={0}>-</MenuItem>
                                <MenuItem value={1}>One</MenuItem>
                                <MenuItem value={2}>Two</MenuItem>
                                <MenuItem value={3}>Three</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    setName("");
                    setNumberOfPlayers(0);
                    closeDialog();
                }}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        createTeam(name, numberOfPlayers, throwIndex, scoreboard);
                        setName("");
                        setNumberOfPlayers(0);
                        closeDialog();
                    }}
                    disabled={name === "" || numberOfPlayers === 0}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default CreateTeamDialog;
