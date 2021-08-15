module.exports = {
    presets: [
        [
            'next/babel',
            {
                'class-properties': {
                    loose: true,
                },
            },
        ],
    ],
    plugins: [
        'babel-plugin-transform-typescript-metadata',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
}
