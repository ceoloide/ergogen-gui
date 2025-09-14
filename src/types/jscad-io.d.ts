declare module '@jscad/io' {
    export const stlDeSerializer: {
        deserialize: (options: any, stl: string) => any;
    };
}
