//This fi=unction is used to capitalise the first alphabet of a string
function capitaliseFirstAlphabetsOfAllWordsOfASentence(str: string): string {
    let words = str.split(' ')
    let capitalizedWords = words.map(word => word.trim().charAt(0).toUpperCase() + word.slice(1))
    let result = capitalizedWords.join(' ')
    return result;
}

function capitalizeFirstLetterOfAString(string: string): string {
    // Check if the string is not empty
    if (string && typeof string === 'string') {
        // Capitalize the first letter and concatenate the rest of the string
        return string.charAt(0).toUpperCase() + string.slice(1);
    } else {
        // Return the original string if it's empty or not a string
        return string;
    }
}

function countWordsInAString(string: string): number {
    // Remove leading and trailing whitespaces
    const trimmedStr = string.trim();

    // If the string is empty, return 0
    if (trimmedStr === "") {
        return 0;
    }

    // Split the string into words based on whitespaces
    const words = trimmedStr.split(/\s+/);

    // Return the number of words
    return words.length;
}
  


export {
    capitaliseFirstAlphabetsOfAllWordsOfASentence,
    capitalizeFirstLetterOfAString,
    countWordsInAString
}