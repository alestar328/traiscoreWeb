import '../styles/Button.css';
import {ButtonProps, STYLES, SIZES, ButtonStyle, ButtonSize} from '../models/ButtonProps.tsx';

export const Button: React.FC<ButtonProps> = ({
    className,
    children,
    type = "button",
    onClick,
    buttonStyle,
    buttonSize
}) => {
    const checkButtonStyle:ButtonStyle = STYLES.includes(buttonStyle as ButtonStyle)
        ? buttonStyle!
        :STYLES[0];

    const checkButtonSize:ButtonSize  = SIZES.includes(buttonSize as ButtonSize)
        ? buttonSize!
        :SIZES[0];

    return (
            <button
                    className={`btn ${checkButtonStyle} ${checkButtonSize} ${className ?? ''}`}
                    onClick={onClick}
                    type={type}
            >
                    {children}
            </button>
    )
}