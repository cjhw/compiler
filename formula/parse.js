let tokenizer = require('./tokenizer')
const toAst = require('./toAst')
// 将代码转换成抽象语法树

function parse(script) {
  let tokenReader = tokenizer(script)
  let ast = toAst(tokenReader)
  return ast
}

parse('5-1+3*4/2')

module.exports = parse
