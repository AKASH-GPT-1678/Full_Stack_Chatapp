import { useRef } from "react";
export function OtpInput() {
    const inputRef = useRef([]);

    const handleClick = (index) => {
        inputRef.current[index].focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            console.log("Backspace pressed");
            // move to previous input
            if (index > 0) inputRef.current[index - 1].focus();
        }

        if (e.key === " ") {
            console.log("Space pressed");
            if(index  < 6) inputRef.current[index + 1 ].focus();
            e.preventDefault(); // stop space
        }
    };

    return (
        <div style={{ display: "flex", gap: "8px" }}>
            {[...Array(6)].map((_, i) => (
                <input
                    key={i}
                    ref={(el) => (inputRef.current[i] = el)}
                    type="text"
                    maxLength={1}
                    onClick={() => handleClick(i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="otp-box outline-1 w-10 h-10"
                />
            ))}
        </div>
    );
}
