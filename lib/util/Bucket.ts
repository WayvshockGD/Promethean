import { RatelimitDataTypes } from "../rest/Types";

export = class Bucket {
    private route: string;
    private data: RatelimitDataTypes;

    public constructor(route: string, data: RatelimitDataTypes) {
        this.route = route;
        this.data = data;
    }

    public handle(time: number) {
        if (!this.data[this.route]) {
            return false;
        }

        setTimeout(() => {
            delete this.data[this.route];
        }, time);
    }
}