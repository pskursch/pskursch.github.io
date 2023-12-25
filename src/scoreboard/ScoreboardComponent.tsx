import React from "react"
import {Scoreboard} from "../data.ts";
import {Divider} from "@mui/material";
import {ChevronRight, Dashboard} from "@mui/icons-material";
import {useRouter} from "@tanstack/react-router";
import {rootRoute, scoreboardRoute} from "../router.tsx";
import styles from "./ScoreboardComponent.module.css"

interface Props {
    scoreboard: Scoreboard
}

const ScoreboardComponent: React.FC<Props> = ({scoreboard}) => {
    const {navigate} = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.content} onClick={() =>
                navigate({
                    from: rootRoute.to,
                    to: scoreboardRoute.to,
                    params: {
                        scoreboardId: scoreboard.id
                    }
                })
            }>
                <div className={styles.innerContent}>
                    <div className={styles.title}>
                        {scoreboard.name}
                    </div>
                    <div className={styles.icon}>
                        <Dashboard style={{
                            color: "blue"
                        }}/>
                    </div>
                </div>
                <Divider className={styles.divider}/>
                <div className={styles.actions}>
                    <ChevronRight/>
                </div>
            </div>
        </div>
    )
}
export default ScoreboardComponent;
