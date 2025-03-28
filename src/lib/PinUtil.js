export function getPinName(id, allPins) {
    const pin = allPins.find((item) => item.id === id);
    return pin ? pin.name : `Unbekannt (${id})`;
}