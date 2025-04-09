export function getPinName(id, allPins) {
    const pin = allPins.find((item) => item.id === id);
    return pin ? pin.name : `Unbekannt (${id})`;
}

export function getPinManuMap() {
    return [
        { 'name': 'Bally', 'value': 'Bally' },
        { 'name': 'DataEast', 'value': 'DataEast' },
        { 'name': 'Gottlieb', 'value': 'Gottlieb' },
        { 'name': 'Sega', 'value': 'Sega' },
        { 'name': 'Stern', 'value': 'Stern' },
        { 'name': 'Williams', 'value': 'Williams' },
        { 'name': 'Zaccaria', 'value': 'Zaccaria' },
        { 'name': 'Andere', 'value': 'Other' }
    ]
}

export function getPinTypeMap() {
    return [
        { 'name': 'DataEast', 'value': 'DataEast' },
        { 'name': 'EM', 'value': 'EM' },
        { 'name': 'EE', 'value': 'EE' },
        { 'name': 'Gottlieb', 'value': 'Gottlieb' },
        { 'name': 'Pin2000', 'value': 'Pin2000' },
        { 'name': 'SAM', 'value': 'SAM' },
        { 'name': 'Spike', 'value': 'Spike' },
        { 'name': 'Sys11', 'value': 'Sys11' },
        { 'name': 'WPC', 'value': 'WPC' },
        { 'name': 'WPC95', 'value': 'WPC95' },
        { 'name': 'Whitestar', 'value': 'Whitestar' },
        { 'name': 'Andere', 'value': 'Other' }
    ]
}

export function mapPinType(pinType) {
    return getPinTypeMap().find((item) => item.value === pinType).name;
}