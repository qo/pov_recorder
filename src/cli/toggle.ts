import prompts from 'prompts';

export default async function toggle(message: string): Promise<boolean> {
    return (prompts({
        type: 'toggle',
        name: 'value',
        message: message,
    })).value;
}
