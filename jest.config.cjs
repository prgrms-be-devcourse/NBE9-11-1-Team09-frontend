// jest.config.cjs
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Next.js 프로젝트 루트 경로
});

/** @type {import('jest').Config} */
const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'node', // API 테스트용 Node 환경
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Next.js 경로 별칭 (@/) 매핑
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // 전역 설정 (선택)
};

module.exports = createJestConfig(customJestConfig);