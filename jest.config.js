module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageThreshold: {
        global: {
            branches: 46,
            functions: 56,
            lines: 69,
            statements: 67
        }
    },
    collectCoverageFrom: [
        "src/**/*.ts",
    ]
};
