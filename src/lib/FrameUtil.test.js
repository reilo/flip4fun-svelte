import { expect, test } from 'vitest'
import { calcFrameResult } from './FrameUtil';

test('Verify FrameUtil.calcFrameResult', () => {
    const frame = { players: ["a", "b", "c", "d", "e"], scores: [123, 132, 231, 132, 312] }
    const result = calcFrameResult(frame);
    expect(result.length).toBe(5);
    console.log(result);
    for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].player).toBe(["e", "c", "b", "d", "a"][i]);
    }
    for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].score).toBe([312, 231, 132, 132, 123][i]);
    }
    for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].pos).toBe([1, 2, 3, 3, 5][i]);
    }
    for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].fine).toBe([1, 0.7404, 0.4231, 0.4231, 0.3942][i]);
    }
});
