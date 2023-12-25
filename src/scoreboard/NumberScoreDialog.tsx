import React, {useEffect, useState} from "react"
import {getRows, Round, roundToIndexMap, setRoundForTeam, SuccessfulDart, Team} from "../data.ts";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import styles from "./ScoreDialog.module.css";

interface Props {
    team?: Team;
    scoreLabel?: string;
    open: boolean;
    closeDialog: () => void
}

type ButtonInput = {
    value: number;
    label: string;
}

const NumberScoreDialog: React.FC<Props> = ({team, scoreLabel, open, closeDialog}) => {

    const [successfulDarts, setSuccessfulDarts] = useState<Array<SuccessfulDart>>([])

    useEffect(() => {
        const sd = team?.rounds?.filter(r => r.label === scoreLabel)[0]?.successfulDarts;
        if (sd) {
            setSuccessfulDarts(sd)
        }
    }, [team, scoreLabel]);

    if (!team || !scoreLabel) {
        return null;
    }

    const getButtons = (): Array<ButtonInput> => {
        const buttonInputs: Array<ButtonInput> = getRows().filter(i => i.label !== "D" && i.label !== "T").map(r => {
            if (r.label === "B") {
                return {
                    value: 25,
                    label: r.label
                }
            } else {
                return {
                    value: Number(r.label),
                    label: r.label
                }
            }
        });
        if (scoreLabel === "D") {
            return buttonInputs.filter(bi => bi.label !== "41").map(bi => {
                return {
                    label: bi.label,
                    value: bi.value * 2
                }
            })
        } else if (scoreLabel === "T") {
            return buttonInputs.filter(bi => bi.label !== "41" && bi.label !== "B").map(bi => {
                return {
                    label: bi.label,
                    value: bi.value * 3
                }
            })
        }
        return buttonInputs.filter(bi => bi.label === scoreLabel);
    }

    const setRound = () => {
        const round: Round = {label: scoreLabel, index: roundToIndexMap.get(scoreLabel)!, successfulDarts: successfulDarts};
        setRoundForTeam(team, round);
    }

    let maxPossibleSuccessfulDarts = 0;
    if (scoreLabel === "B") {
        maxPossibleSuccessfulDarts = team.numberOfPlayers * 6;
    } else if (scoreLabel === "41") {
        maxPossibleSuccessfulDarts = team.numberOfPlayers * 1;
    } else if (scoreLabel === "D" || scoreLabel === "T") {
        maxPossibleSuccessfulDarts = team.numberOfPlayers * 3;
    } else {
        maxPossibleSuccessfulDarts = team.numberOfPlayers * 9;
    }

    const addSuccessfulDart = (dartToAdd: SuccessfulDart) => {
        if (successfulDarts.length < maxPossibleSuccessfulDarts) {
            setSuccessfulDarts(prevState => [...prevState, dartToAdd]);
        }
    }

    const subtractSuccessfulDart = (dartToRemove: SuccessfulDart) => {
        if (successfulDarts.length > 0) {
            const indexToRemove = successfulDarts.findIndex(dart => dart.score === dartToRemove.score);
            if (indexToRemove !== -1) {
                setSuccessfulDarts([...successfulDarts.slice(0, indexToRemove), ...successfulDarts.slice(indexToRemove + 1)]);
            }
        }
    }

    const getTotalScoreForRound = () => {
        let score = 0;
        successfulDarts.forEach(sd => {
            score = score + sd.score;
        })
        return score;
    }

    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth={"sm"}
        >
            <DialogTitle>
                Set score for {team.name} for {scoreLabel}
            </DialogTitle>
            <DialogContent>
                <div className={styles.content}>
                    <div>
                        Total score for round: {getTotalScoreForRound()}
                    </div>
                    {getButtons().map(button => {
                        return (
                            <div key={button.label} style={{
                                display: "flex",
                                alignItems: "center"
                            }}>
                                <Button onClick={() => addSuccessfulDart({score: button.value})}>
                                    Add {button.label}
                                </Button>
                                <Button onClick={() => subtractSuccessfulDart({score: button.value})}>
                                    Remove {button.label}
                                </Button>
                            </div>
                        )
                    })}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    setSuccessfulDarts([]);
                    closeDialog();
                }}>
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        setRound();
                        setSuccessfulDarts([])
                        closeDialog();
                    }}
                >
                    Set score
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default NumberScoreDialog;
