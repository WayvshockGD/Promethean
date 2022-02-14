export = class Util {
    static filter<T extends string | number>(arr: T[], item: string | number) {
        return arr.filter((value) => value != item);
    }

    static sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}