import { RatelimitDataTypes } from "../rest/Types";
import Util from "./Util";

export = class Bucket {
    private route: string;
    private data: RatelimitDataTypes;

    public constructor(route: string, data: RatelimitDataTypes) {
        this.route = route;
        this.data = data;
    }

    public handle(time: number) {
        let map = this.data.find(({ route }) => this.route === route);

        if (!map) {
            return false;
        }

        let d: RatelimitDataTypes;

        setTimeout(() => {
            d = this.data.filter((val) => val.route != this.route);
        }, time);

        return d!;
    }
}