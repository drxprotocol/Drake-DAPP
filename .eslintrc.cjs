module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: ['alloy', 'alloy/react'],
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        parser: {
            js: '@babel/eslint-parser',
            jsx: '@babel/eslint-parser',

            ts: '@typescript-eslint/parser',
            tsx: '@typescript-eslint/parser',
            // Leave the template parser unspecified, so that it could be determined by `<script lang="...">`
        },
    },
    plugins: ['react'],
    rules: {
        camelcase: 'warn',
        indent: ['warn', 4],
        'max-depth': ['warn', 4],
        'no-var': 'warn',
        'no-empty-function': 'warn',
        'no-duplicate-case': 'warn',
        'no-empty': 'warn',
        'default-case': 'warn',
        'no-unused-vars': 'warn',
        'prefer-promise-reject-errors': 'warn',
        'max-params': 'warn',
        'one-var': 'warn',
        'no-debugger': 'warn',
        'react/jsx-curly-brace-presence': ['off', { props: 'never', children: 'never' }],
        'react/self-closing-comp': 'off',
        complexity: 'off',
    },
};
