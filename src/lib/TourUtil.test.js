import { expect, test } from 'vitest'
import { isValidTourType, calcStrength, calcInitialLevels } from './TourUtil';

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

test('Verify TourUtil.calcInitialLevels(7,2)', () => {
    const players = ["a", "b", "c", "d", "e", "f", "g"];
    const rankInit = calcInitialLevels(players, 2);

    expect(rankInit.length).toBe(4);
    rankInit.forEach((item, i) => {
        expect(item.level).toBe(i + 1);
    })
    expect(rankInit[0].players.length).toBe(1);
    expect(rankInit[0].players[0].id).toBe("g");
    expect(rankInit[0].players[0].fine).toBe(2);
    expect(rankInit[1].players.length).toBe(3);
    expect(rankInit[1].players[0].id).toBe("d");
    expect(rankInit[1].players[1].id).toBe("e");
    expect(rankInit[1].players[2].id).toBe("f");
    expect(rankInit[1].players[0].fine).toBe(2);
    expect(rankInit[1].players[1].fine).toBeOneOf([1.3333, 1.3334]);
    expect(rankInit[1].players[2].fine).toBeOneOf([0.6666, 0.6667]);
    expect(rankInit[2].players.length).toBe(2);
    expect(rankInit[2].players[0].id).toBe("b");
    expect(rankInit[2].players[1].id).toBe("c");
    expect(rankInit[2].players[0].fine).toBe(2);
    expect(rankInit[2].players[1].fine).toBe(1);
    expect(rankInit[3].players.length).toBe(1);
    expect(rankInit[3].players[0].id).toBe("a");
    expect(rankInit[3].players[0].fine).toBe(2);
})