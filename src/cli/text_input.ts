import prompts from 'prompts';

export default async function text_input(message: string): Promise<string> {
    return (prompts({
        type: 'text',
        name: 'value',
        message: message
    })).value;
}
