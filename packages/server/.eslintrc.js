module.exports = {
    extends: 'eslint-config-egg/typescript',
    rules: {
        '@typescript-eslint/indent': [
            'error', 4, {
                'SwitchCase': 1
            }
        ],
        'dot-notation': 0,
        'no-empty-pattern': 0,
        'indent': [
            'error', 4, {
                'SwitchCase': 1
            }
        ],
        'no-multi-spaces': 'error',
        'eol-last': 'off',
        'object-curly-spacing': ['error', 'always'],
        // see https://github.com/eslint/eslint/issues/6274
        // 允许使用async
        'generator-star-spacing': 'off',
        'babel/generator-star-spacing': 'off',
        'linebreak-style': 0,
        'eqeqeq': 0,
        // 强制在注释中 // 或 /* 使用一致的空格
        'spaced-comment': 0,
        // 关键字后面使用一致的空格
        'keyword-spacing': 2,
        // 强制在 function的左括号之前使用一致的空格
        'space-before-function-paren': 0,
        'jsdoc/check-tag-names': 'off',
        'jsdoc/require-param-description': 'off',
        'jsdoc/require-param-type': 'off',
        //对象字面量中冒号的前后空格
        'key-spacing': [
            2, {
                'beforeColon': false,
                'afterColon': true
            }
        ],
        // 引号类型
        'quotes': [
            1, 'single'
        ],
        // 禁止出现未使用过的变量
        'no-unused-vars': 1,
        // 要求或禁止末尾逗号
        'comma-dangle': 0,
        // js语句结尾必须使用分号
        'semi': [
            2, 'always'
        ],
        'object-shorthand': 'off',
        //强制对象字面量缩写语法
        'strict': [
            2, 'never'
        ],
        //是否使用严格模式
        'no-bitwise': 0,
        //禁止使用按位运算符
        'no-empty-function': 0,
        'newline-per-chained-call': [
            'error', {
                'ignoreChainWithDepth': 6
            }
        ],
        //方法链式调用 超过几个方法换行呢
        'array-bracket-spacing': [
            2, 'never'
        ],
        //是否允许非空数组里面有多余的空格
        'no-trailing-spaces': 2,
        //一行结束后面不要有空格
        'no-extend-native': 0,
        //禁止扩展native对象
        'no-loop-func': 'off'
    }
};
