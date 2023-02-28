import prompts from 'prompts';

export default async function number_input(message: string): Promise<number> {
    return (prompts({
        type: 'number',
        name: 'value',
        message: message
    })).value;
}
