module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": ["standard-with-typescript", "prettier"],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-unused-vars": "off",
    }
}
