import commands from "./commands";

/**
 * Writes a text on the clipboard
 *
 * @param {string} textToCopy - Text to copy on the clipboard
 */

const write = (textToCopy: string): void => {
    const inputField = document.createElement("input");
    inputField.value = textToCopy;
    document.body.appendChild(inputField);
    inputField.select();
    document.execCommand(commands.copy); 
    document.body.removeChild(inputField);
};

/*
 * Checks if a document command is supported by the browser
 */
export const isCommandSupported = (commandName: commands): boolean => {
    if(!commandName){
        return false;
    }
    return !!document.queryCommandSupported && !!document.queryCommandSupported(commandName);
}

export default {
    commands,
    isCommandSupported,
    write
};
