export = class PrometheanError extends Error {
    constructor(message: string) {
        super(parseBrackets(message));
    }
}

function parseBrackets(text: string) {
    return text.replaceAll("{", '"').replaceAll("}", '"');
}