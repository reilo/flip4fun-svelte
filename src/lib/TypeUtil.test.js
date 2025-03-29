import { expect, test } from 'vitest'
import { cleanString } from './TypeUtil'

test('Verify TypeUtil.cleanString', () => {
    expect(cleanString("mü_ÄsCháblaßß")).toBe("mue_aesablass");
    expect(cleanString("Isar-Amper-Liga 2025")).toBe("isaramperliga2025");
});