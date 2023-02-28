import prompts from 'prompts';

export default async function select<type>(message: string, choices: type[] | { title: string, value: type }[], initial?: type | { title: string, value: type }): Promise<type> {

    const choices_are_normalized = (
        typeof choices[0] === "object" &&
        "title" in choices[0] &&
        "value" in choices[0]
    );

    return (prompts({
        type: 'select',
        name: 'value',
        message: message,
        choices: choices_are_normalized ? choices : choices.map(
            choice => ({ title: choice, value: choice })
        ),
        initial: initial
    })).value;
}
