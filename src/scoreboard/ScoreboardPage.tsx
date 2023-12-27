import React, {useState} from "react"
import {getRoundScoreForTeam, getRows, Team, useGetScoreboard, useGetTeams} from "../data.ts";
import {useParams} from "@tanstack/react-router";
import {scoreboardPageRoute} from "../router.tsx";
import {IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@mui/material";
import styles from "./ScoreboardPage.module.css"
import CreateTeamDialog from "./CreateTeamDialog.tsx";
import NumberScoreDialog from "./NumberScoreDialog.tsx";
import {Add} from "@mui/icons-material";

interface Props {

}

const ScoreboardPage: React.FC<Props> = () => {
    const {scoreboardId} = useParams({from: scoreboardPageRoute.id})
    const scoreboard = useGetScoreboard(scoreboardId);
    const teams = useGetTeams(scoreboard!);
    const [createTeamDialogOpen, setCreateTeamDialogOpen] = useState(false);
    const rows = getRows();
    const [currentTeam, setCurrentTeam] = useState<undefined | Team>(undefined);
    const [currentScoreLabel, setCurrentScoreLabel] = useState<undefined | string>(undefined);
    if (!scoreboard) {
        return null
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.title}>
                    <Typography variant="h6">
                        {scoreboard.name}
                    </Typography>
                    <IconButton
                        size={"small"}
                        onClick={() => setCreateTeamDialogOpen(true)}
                    >
                        <Add style={{
                            color: "whitesmoke"
                        }}/>
                    </IconButton>
                </div>
                <Table sx={{minWidth: 300}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className={styles.tableCell}></TableCell>
                            {teams.sort((a, b) => a.throwIndex - b.throwIndex).map(t => {
                                return (
                                    <TableCell
                                        className={styles.tableCell}
                                        key={t.id}
                                    >
                                        {t.name}
                                    </TableCell>
                                )
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row.index}
                            >
                                <TableCell className={styles.tableCell} style={{
                                    borderRight: "1px solid rgba(224, 224, 224, 1)",
                                    borderLeft: "1px solid rgba(224, 224, 224, 1)"
                                }}>
                                    {row.label}
                                </TableCell>
                                {teams.sort((a, b) => a.throwIndex - b.throwIndex).map(t => {
                                    const latestCompletedRound = t.rounds.slice(-1)[0];
                                    let clickable = false;
                                    if (row.label === "15" && !latestCompletedRound) {
                                        clickable = true;
                                    } else if (latestCompletedRound && (row.index === latestCompletedRound.index + 1 || row.index === latestCompletedRound.index)) {
                                        clickable = true;
                                    }

                                    const score = getRoundScoreForTeam(t, row.label);

                                    return (
                                        <TableCell
                                            key={t.id}
                                            className={styles.clickableCell}
                                            onClick={() => {
                                                if (clickable) {
                                                    setCurrentScoreLabel(row.label);
                                                    setCurrentTeam(t);
                                                }
                                            }}
                                        >
                                            {score ? score : ""}
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <CreateTeamDialog
                scoreboard={scoreboard}
                open={createTeamDialogOpen}
                closeDialog={() => setCreateTeamDialogOpen(false)}
            />
            <NumberScoreDialog
                open={currentTeam !== undefined && currentScoreLabel !== undefined}
                closeDialog={() => {
                    setCurrentScoreLabel(undefined);
                    setCurrentTeam(undefined)
                }}
                team={currentTeam}
                scoreLabel={currentScoreLabel}
            />
        </>
    )
}

export default ScoreboardPage;
