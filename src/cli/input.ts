import prompts from 'prompts';

export default async function input(message: string): Promise<string> {
    return (prompts({
        type: 'text',
        name: 'value',
        message: message
    })).value;
}
