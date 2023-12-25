import React, {useState} from 'react'
import './App.css'
import {Button} from "@mui/material";
import {useGetScoreboards} from "./data.ts";
import CreateScoreboardDialog from "./createscoreboarddialog/CreateScoreboardDialog.tsx";
import ScoreboardComponent from "./scoreboard/ScoreboardComponent.tsx";

interface Props {

}

const App: React.FC<Props> = () => {
    const [createScoreboardDialogOpen, setCreateScoreboardDialogOpen] = useState(false);
    const scoreboards = useGetScoreboards();

    return (
        <>
            <h1>Lumberjack darts!</h1>
            <div style={{
                marginBottom: 32
            }}>
                {scoreboards.map(sb => {
                    return (
                        <ScoreboardComponent
                            key={sb.id}
                            scoreboard={sb}
                        />
                    )
                })}
            </div>
            <Button
                variant="contained"
                onClick={() => setCreateScoreboardDialogOpen(true)}
            >
                Add new scoreboard
            </Button>
            <CreateScoreboardDialog
                open={createScoreboardDialogOpen}
                closeDialog={() => setCreateScoreboardDialogOpen(false)}
            />
        </>
    )
}

export default App
