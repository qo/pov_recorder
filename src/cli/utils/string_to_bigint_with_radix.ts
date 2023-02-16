// https://github.com/tc39/proposal-bigint-math/issues/12
// https://stackoverflow.com/questions/55646698/base-36-to-bigint

export default function convert_string_to_bigint_with_radix(string: string, radix: number) {
    return [...string.toString()]
        .reduce((r, v) => r * BigInt(radix) + BigInt(parseInt(v, radix)), 0n);
}