export default function escape(string: string): string {
    return string.replaceAll("\\", "\\\\")
        .replaceAll("\"", "\\\"");
}