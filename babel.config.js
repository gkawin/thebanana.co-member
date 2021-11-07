module.exports = {
    presets: [
        [
            'next/babel',
            {
                'preset-env': {},
                'class-properties': {},
            },
        ],
    ],
    plugins: [
        'babel-plugin-transform-typescript-metadata',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
        [
            'babel-plugin-import',
            {
                libraryName: '@mui/material',
                libraryDirectory: '',
                camel2DashComponentName: false,
            },
            'core',
        ],
        [
            'babel-plugin-import',
            {
                libraryName: '@mui/icons-material',
                libraryDirectory: '',
                camel2DashComponentName: false,
            },
            'icons',
        ],
    ],
}
