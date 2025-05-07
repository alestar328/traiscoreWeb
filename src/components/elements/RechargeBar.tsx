import {RechargeBarInterface} from "../../models/ChartInterfaces.tsx";
import "../../styles/RechargeBar.css";

const RechargeBar: React.FC<RechargeBarInterface> = ({ value, max = 100, label }) => {
    // Calculamos porcentaje y lo limitamos entre 0 y 100
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className="recharge-bar-container">
            {label && <span className="recharge-bar-label">{label}</span>}
            <div className="recharge-bar-track">
                <div
                    className="recharge-bar-fill"
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={max}
                    aria-valuenow={value}
                />
            </div>
        </div>
    );
};

export default RechargeBar;