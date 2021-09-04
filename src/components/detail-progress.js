import React from 'react'

export const DetailProgress = React.forwardRef((props, ref) => {
    const { title, progress } = props // Destructuring

    return (
        <>
            <div className="col-3">{ title }</div>
            <div className="col-9">
                <div className="progress">
                    <div className="progress-bar"
                        role="progressbar"
                        aria-valuemin="0"
                        aria-valuemax="100" style={{ width: progress + '%' }}>
                    </div>
                </div>
            </div>
        </>
    )
});
