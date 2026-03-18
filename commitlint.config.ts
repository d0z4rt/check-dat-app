import { RuleConfigSeverity, type UserConfig } from '@commitlint/types'

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      RuleConfigSeverity.Error,
      'always',
      [
        'config',
        'scripts',
        'brain',
        'rust-md',
        'd0z',
        'j4rv1s',
        'force-graph',
        'pixel-sorter',
        'release'
      ]
    ]
  }
}

export default Configuration
