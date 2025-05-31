import { expect, test } from 'vitest'
import { getPyramidLayout } from './PlayerUtil';

test('Verify PlayerUtil.getPyramidLayout', () => {
    let result = getPyramidLayout(8, 1000, 500, 1.33);
    console.log(result);
    expect(result.valid).toBeTruthy;
    expect(result.xpos.length).toBe(36);
    expect(result.ypos.length).toBe(36);
});