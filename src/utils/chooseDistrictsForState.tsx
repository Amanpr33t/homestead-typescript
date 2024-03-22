import { haryanaDistricts, punjabDistricts } from "./tehsilsAndDistricts/districts"
import { states } from "./states"

const chooseDistrictsForState = (state: string): string[] | null => {
    if (state === 'punjab') {
        return punjabDistricts
    } else if (state === 'chandigarh') {
        return ['chandigarh']
    } else if (state === 'haryana') {
        return haryanaDistricts
    }
    return null
}

export { chooseDistrictsForState }