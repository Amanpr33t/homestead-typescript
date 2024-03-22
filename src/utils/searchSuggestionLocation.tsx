import { punjabDistricts } from "./tehsilsAndDistricts/districts"
import { states } from "./states"

interface SearchDataType {
    district?: string,
    state: string
}

function getRandomItemsFromArray(array: SearchDataType[]): SearchDataType[] {
    const maxLength: number = Math.min(10, array.length); // Ensure we don't try to get more items than the array has
    const randomItems: SearchDataType[] = [];
    const indices: number[] = [];

    // Fill indices array with all possible indices
    for (let i = 0; i < array.length; i++) {
        indices.push(i);
    }

    // Shuffle the indices array
    for (let i = indices.length - 1; i > 0; i--) {
        const j: number = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Pick the random items based on the shuffled indices
    for (let i = 0; i < maxLength; i++) {
        randomItems.push(array[indices[i]]);
    }

    // Sort randomItems alphabetically based on district and state
    randomItems.sort((a, b) => {
        if (a.state !== b.state) {
            return a.state.localeCompare(b.state);
        } else if (a.district && b.district && a.district !== b.district) {
            return a.district.localeCompare(b.district);
        } else {
            return 0;
        }
    });

    return randomItems;
}


const searchSuggestionsForLocation = (inputText: string): SearchDataType[] => {
    inputText = inputText.toLowerCase();

    let dataArray: SearchDataType[] = []

    states.forEach(state => {
        if (state.toLowerCase().includes(inputText)) {
            dataArray = [...dataArray, {
                state
            }]
        }
    })

    punjabDistricts.forEach(district => {
        if (district.toLowerCase().includes(inputText) || 'punjab'.includes(inputText)) {
            dataArray = [...dataArray, {
                district,
                state: 'punjab'
            }]
        }
    })

    return getRandomItemsFromArray(dataArray);
}

export { searchSuggestionsForLocation }