import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  output: {
    file: 'lib/index.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    commonjs({
      include: 'node_modules/**',
      extensions: [
        '.js'
      ],
      sourceMap: false
    }),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
}
