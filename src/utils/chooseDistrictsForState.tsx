import { haryanaDistricts, punjabDistricts } from "./tehsilsAndDistricts/districts"

const chooseDistrictsForState = (state: string): string[] => {
    if (state === 'punjab') {
        return punjabDistricts
    } else if (state === 'chandigarh') {
        return ['chandigarh']
    } else if (state === 'haryana') {
        return haryanaDistricts
    } else {
        return []
    }
}

export { chooseDistrictsForState }