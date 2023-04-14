import { useRef } from "react";

/*
NB:
This file isn't used right now. I decided to just use the vanilla file input for now
and see how it goes. In the future though, I might want to do it like this, so I've
decided to leave the file here just in case. The app is small so this extra file in 
the bundle shouldn't make much of a difference. Tbh Next might not even include it
since it isn't rendered anywhere.

By the way, this file is drawing inspiration from two links:

1. A medium article that uses a separate component and ref.current.click() handler
https://medium.com/@masakudamatsu/how-to-customize-the-file-upload-button-in-react-b3866a5973d8

2. A StackOverflow question that also uses a separate component but with <label> instead
   and also using {children} to allow for the label to have text.
https://stackoverflow.com/questions/69237598/react-js-customizing-the-input-of-type-file-using-css

In my opinion we should use the <label> method since the stackoverflow comment is more
recent (2022 vs. 2020 for the medium article). However, I think it looks cleaner to pass
a "text" prop to the component to facilitate label/button text instead of wrapping a 
"children" prop. Actually now that I think about it that would preclude us from adding an
icon to the label/button in the parent component (PDFInput). But could always just add
that in here right? Probably cleaner anyway.

Anyway, we can reasses that if we decide to start using this component. For now it's unused.
*/

const FileLoader = ({ handleFile, text, ...inputProps }) => {
    // create a reference for the file input element that will be hidden
    const hiddenFileInput = useRef(null);

    // programatically click hiden file input when button is clicked
    const handleButtonClick = (event) => {
        hiddenFileInput.current.click();
    };

    // call the given handleFile function on the user-inputted file
    const handleOnChange = (event) => {
        // prevent browser refresh
        event.preventDefault();

        // call handleFile on file if it exists
        if (event.target.files && event.target.files[0]) {
            handleFile(event.target.files[0]);
        }
    };

    return (
        <div>
            <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleOnChange}
                style={{ display: "none" }}
                {...inputProps}
            />
        </div>
    );
};

export default FileLoader;
