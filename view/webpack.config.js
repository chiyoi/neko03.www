module.exports = {
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
        ]
    },
    resolve: {
        extensions: [".ts"]
    },
    entry: {
        chiyoi: "./src/chiyoi/main.ts",
        nacho: "./src/nacho/main.ts",
        shigure: "./src/shigure/main.ts",
        jigokutsuushin: "./src/jigokutsuushin/main.ts",
        upload: "./src/upload/main.ts"
    },
    output: {
        filename: "[name].js",
        clean: true
    }
}