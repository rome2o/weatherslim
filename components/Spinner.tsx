import React from "react";
import styles from '../styles/Spinner.module.css'

type SpinnerProps = {
    isLoading: boolean
    center?: boolean
}

const Spinner:React.FC<SpinnerProps> = ({isLoading, center = false}) => {
    if(!isLoading) return null;
    return (
        <div className={styles.spinner}>
        <div className={styles.ldsRing}>
            <div></div>
            <div></div> 
            <div></div>
            <div></div>
        </div>
        </div>
    )
}
export default Spinner;