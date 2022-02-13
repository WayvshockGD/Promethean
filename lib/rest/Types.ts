export type RatelimitDataTypes = {
    [route: string]: {
        remaining: number;
        limit: number;
    };
};