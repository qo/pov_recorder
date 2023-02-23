export default function split_commands(commands: string, max_length: number = 255): string[] {
    const commands_list = commands.split(";");
    const commands_split = [""];
    let current_idx = 0;
    commands_list.forEach(
        command => {
            if (commands_split[current_idx].length + command.length >= max_length - 1) {
                commands_split.push("");
                current_idx++;
            }
            commands_split[current_idx] += command + ";";
        }
    );
    return commands_split;
}