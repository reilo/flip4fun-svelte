import { expect, test } from 'vitest'
import { isValidTourType, calcStrength } from './TourUtil';

test('Verify TourUtil.isValidTourType', () => {
    expect(isValidTourType("flipliga")).toBeTruthy;
    expect(isValidTourType("flipfinal")).toBeTruthy;
    expect(isValidTourType("fliptwin")).toBeTruthy;
    expect(isValidTourType("flipnone")).toBeFalsy;
});

test('Verify TourUtil.calcStrength', () => {
    expect(calcStrength(1, 8)).toBe(4);
    expect(calcStrength(2, 8)).toBe(3);
    expect(calcStrength(7, 8)).toBe(1);
    expect(calcStrength(1, 10)).toBe(4);
    expect(calcStrength(1, 33)).toBe(8);
    expect(calcStrength(7, 33)).toBe(5);
    expect(calcStrength(31, 33)).toBe(1);
});