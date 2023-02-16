/*
* XUID in CS:GO is stored in form of { high: number, low: number }.
* Most of the people, however, see XUID as one number.
* For example, my XUID is 76561199101834053
* and you can access my Steam profile
* at https://steamcommunity.com/profiles/76561199101834053.
* To convert full XUID to { high, low } form,
* it is needed to take 25 highest bits (bits 0-25)
* and 32 lowest bits (bits 25-57) of full XUID.
* */

import convert_string_to_bigint_with_radix from "./string_to_bigint_with_radix";

const highStart = 0;
const highEnd = 25;
const lowStart = 26;
const lowEnd = 57;

const binaryRadix = 2;

// todo: test it
export function convert_full_to_high_low(full: BigInt) {
    const bin = full.toString(binaryRadix);
    const high = Number(bin.substring(highStart, highEnd+1));
    const low = Number(bin.substring(lowStart, lowEnd+1));
    return {
        high: high,
        low: low
    }
}

export function convert_high_low_to_full(xuid: {high: number, low: number}) {
    const highStr = xuid.high.toString(binaryRadix);
    const lowStr = xuid.low.toString(binaryRadix);

    // The amount of leading zeroes needed to make it 32-bits-long
    const amtOfLeadingZeroes = 32 - lowStr.length;
    const lowStrWithLeadingZeroes = "0".repeat(amtOfLeadingZeroes) + lowStr;

    const fullStr = highStr + lowStrWithLeadingZeroes;
    const full = convert_string_to_bigint_with_radix(fullStr, binaryRadix);
    return full;
}