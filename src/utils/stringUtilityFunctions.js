const capitaliseFirstAlphabetsOfAllWordsOfASentence = (str) => {
    let words = str.split(' ')
    let capitalizedWords = words.map(word => word.trim().charAt(0).toUpperCase() + word.slice(1))
    let result = capitalizedWords.join(' ')
    return result;
}
export {capitaliseFirstAlphabetsOfAllWordsOfASentence}