export let ColorPalletsObject: ColorObject = {
    red: 0xf94144,
    orange: 0xf3722c,
    yellow: 0xf9c74f,
    green: 0x90be6d,
    blue: 0x43aa8b,
    purple: 0x390099,
    pas_red: 0xffadad,
    pas_orange: 0xffd6a5,
    pas_yellow: 0xfdffb6,
    pas_green: 0xcaffbf,
    pas_blue: 0xbdb2ff,
    pas_purple: 0xffc6ff,
    white: 0xfffffc
}

export class ColorPallets {
    static parse(color: AllColors) {
        if (color === "random") {
            return this.getRandomHexInt();
        }

        let col = ColorPalletsObject[color];

        if (!col) {
            return ColorPalletsObject.white;
        }

        return col;
    }

    // https://github.com/moriarty83/js-rando/blob/main/js-rando.js#L30
    static getRandomHexInt() {
        let randomInt = Math.floor(Math.random() * ((16) - 0) + 0);
        let randomHex = randomInt.toString(16);
        let hex;
        for(let i = 0; i < 6; i++){
            hex = "0x" + randomHex;
        }
        return parseInt(hex as string) as number;
    }
}

export type AllColorsWithoutRandom = Colors | ColorPastel | "white";
export type Colors = "red" | "orange" | "yellow" | "green" | "blue" | "purple";
export type AllColors = "random" | Colors | "white";
export type ColorPastel = `pas_${Colors}`;
export type ColorObject = { [color in AllColorsWithoutRandom]: number };