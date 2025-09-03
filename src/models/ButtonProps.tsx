
export const STYLES = ['btn--primary', 'btn--outline', 'btn--presentation'] as const;
export const SIZES = ['btn--medium', 'btn--large'] as const;

export type ButtonStyle = (typeof STYLES)[number];
export type ButtonSize = (typeof SIZES)[number];

export interface ButtonProps {
    className?: string,
    children: React.ReactNode;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    buttonStyle?: ButtonStyle;
    buttonSize?: ButtonSize;
}