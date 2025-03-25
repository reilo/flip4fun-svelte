import { expect, test } from 'vitest'
import { IsValidType, CalcStrength } from './TourUtil';

test('Verify TourUtil.IsValidType', () => {
    expect(IsValidType("flipliga")).toBeTruthy;
    expect(IsValidType("flipfinal")).toBeTruthy;
    expect(IsValidType("fliptwin")).toBeTruthy;
    expect(IsValidType("flipnone")).toBeFalsy;
});

test('Verify TourUtil.CalcStrength', () => {
    expect(CalcStrength(1, 8)).toBe(4);
    expect(CalcStrength(2, 8)).toBe(3);
    expect(CalcStrength(7, 8)).toBe(1);
    expect(CalcStrength(1, 10)).toBe(4);
    expect(CalcStrength(1, 33)).toBe(8);
    expect(CalcStrength(7, 33)).toBe(5);
    expect(CalcStrength(31, 33)).toBe(1);
});