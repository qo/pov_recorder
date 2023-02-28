type steam_id_type = "steam_id" | "community_id" | "vanity_url";

interface props {
    steam_id: string,
    steam_id_type: steam_id_type
};

export default function convert_steam_id_to_xuid(props: props) {
    // https://wiki.teamfortress.com/wiki/WebAPI/ResolveVanityURL
    // https://developer.valvesoftware.com/wiki/SteamID
    if (props.steam_id_type === "community_id")
        return props.steam_id;
    if (props.steam_id_type === "steam_id")
        throw new Error("Not Implemented Yet. Use Community ID");
    if (props.steam_id_type === "vanity_url")
        throw new Error("Not Implemented Yet. Use Community ID");
}
