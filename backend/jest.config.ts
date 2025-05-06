// jest.config.ts
import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  // テスト対象ファイルの拡張子
  moduleFileExtensions: ['js', 'json', 'ts'],
  // テストルートを src フォルダに指定
  rootDir: 'src',
  // .spec.ts がテストファイルとみなされる
  testRegex: '.*\\.spec\\.ts$',
  // ts-jest で TypeScript をトランスフォーム
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  // カバレッジ計測の対象
  collectCoverageFrom: ['**/*.(t|j)s'],
  // coverage レポートを backend/coverage に出力
  coverageDirectory: '../coverage',
  // Node.js 環境でテスト実行
  testEnvironment: 'node',
};

export default config;
