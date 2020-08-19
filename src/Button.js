import React from 'react'

function Button({ text, handleClick, style, ...args}) {
    return (
        <div
            onClick={() =>handleClick(text)}
            className="button"
            style={{...style}}
            {...args}
        >
            {text}
        </div>
    )
}

export default Button
