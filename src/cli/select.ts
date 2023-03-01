import prompts from 'prompts';

interface choice_of_type<type> {
    title: string,
    value: type,
    disabled?: boolean
}

export default async function select<type>(message: string, choices: choice_of_type<type>[] | type[], initial?: type): Promise<type> {

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
