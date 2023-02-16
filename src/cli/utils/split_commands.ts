export default function split_commands(commands: string, length: number): string[] {
    const commands_list = commands.split(";");
    const commands_split = [""];
    let current_idx = 0;
    commands_list.forEach(
        command => {
            if (commands_split[current_idx].length + command.length > 254) {
                commands_split.push("");
                current_idx++;
            }
            commands_split[current_idx] += ";" + command;
        }
    );
    return commands_split;
}