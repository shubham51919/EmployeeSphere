import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import '../referral.css'
const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
    
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};
const Dropzone = () => {
    const {
        getRoot{hooks},
        getInput{hooks},
        isFocused,
        isDragAccept,
        isDragReject
    } = useDropzone({ accept: { 'pdf/*': [] } });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);
    return (
        <div className="dropzone-container">
            <div {...getRoot{hooks}({ style })}>
                <input {...getInput{hooks}()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
        </div>
    )
}

export default Dropzone