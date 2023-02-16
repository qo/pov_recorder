import prompts from 'prompts';

async function create_record_config() {
    throw new Error("Not implemented yet");
}

async function edit_record_config() {
    throw new Error("Not implemented yet");
}

async function rename_record_config() {
    throw new Error("Not implemented yet");
}

async function duplicate_record_config() {
    throw new Error("Not implemented yet");
}

async function delete_record_config() {
    throw new Error("Not implemented yet");
}

async function import_record_config() {
    throw new Error("Not implemented yet");
}

async function export_record_config() {
    throw new Error("Not implemented yet");
}

export default async function manage_record_configs() {

    // Path config can only be created or edited

    const action_selection = await prompts({
        type: 'select',
        name: 'selected_action',
        message: 'What do you want to do with Recording Config?',
        choices: [
            { title: "Create Record Config", value: "create" },
            { title: "Edit Record Config", value: "edit" },
            { title: "Rename Record Config", value: "rename" },
            { title: "Duplicate Record Config", value: "duplicate" },
            { title: "Delete Record Config", value: "delete" },
            { title: "Import Record Config", value: "import" },
            { title: "Export Record Config", value: "export" },
        ]
    });

    switch(action_selection.selected_action) {
        case "create":
            await create_record_config();
            break;
        case "edit":
            await edit_record_config();
            break;
        case "rename":
            await rename_record_config();
            break;
        case "duplicate":
            await duplicate_record_config();
            break;
        case "delete":
            await delete_record_config();
            break;
        case "import":
            await import_record_config();
            break;
        case "export":
            await export_record_config();
            break;
        default:
            throw new Error("Unexpected Recording Config Action");
    }

}