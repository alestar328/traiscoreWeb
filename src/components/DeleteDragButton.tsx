import {useEffect, useRef, useState} from "react";
import {FaTrash} from "react-icons/fa";


interface DeleteDragButtonProps {
    onClick?: () => void;
    initialX?: number;
    initialY?: number;
    boundsRef?: React.RefObject<HTMLElement | null>;
}

export default function DeleteDragButton({
                                             onClick,
                                             initialX,
                                             initialY,
                                             boundsRef,
                                         }: DeleteDragButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Estado de posición inicial
    const [pos, setPos] = useState({
        x: initialX ?? window.innerWidth - 84,
        y: initialY ?? window.innerHeight - 84,
    });
    const [dragging, setDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    // Mouse down inicia arrastre
    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setDragging(true);
        setOffset({ x: e.clientX - pos.x, y: e.clientY - pos.y });
    };

    useEffect(() => {
        // Solo definimos una vez
        const handleMouseMove = (e: globalThis.MouseEvent) => {
            if (!dragging) return;

            // posición deseada sin límites
            let newX = e.clientX - offset.x;
            let newY = e.clientY - offset.y;

            // si boundsRef está definido, limitamos al contenedor
            if (boundsRef?.current && buttonRef.current) {
                const containerRect = boundsRef.current.getBoundingClientRect();
                const btn = buttonRef.current;
                const btnWidth = btn.offsetWidth;
                const btnHeight = btn.offsetHeight;

                // clamp X entre containerRect.left y containerRect.right - btnWidth
                newX = Math.min(
                    Math.max(containerRect.left, newX),
                    containerRect.right - btnWidth
                );
                // clamp Y entre containerRect.top y containerRect.bottom - btnHeight
                newY = Math.min(
                    Math.max(containerRect.top, newY),
                    containerRect.bottom - btnHeight
                );
            }

            setPos({ x: newX, y: newY });
        };

        const handleMouseUp = () => {
            if (dragging) setDragging(false);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [dragging, offset, boundsRef]);

    return (
        <button
            ref={buttonRef}
            className="floating-delete-btn"
            style={{
                position: "absolute",
                left: pos.x,
                top: pos.y,
                bottom: "auto",
                right: "auto",
                cursor: dragging ? "grabbing" : "grab",
            }}
            onMouseDown={handleMouseDown}
            onClick={onClick}
            title="Eliminar"
        >
            <FaTrash />
        </button>
    );
}