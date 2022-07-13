const {
  Program,
  Numeric,
  Additive,
  Multiple,
  Minus,
  Divide,
} = require('./nodeTypes')

function evaluate(ast) {
  let res
  switch (ast.type) {
    case Program:
      for (const node of ast.children) {
        res = evaluate(node) //node => Additive
      }
      break
    case Additive:
      res = evaluate(ast.children[0]) + evaluate(ast.children[1])
      break
    case Minus:
      res = evaluate(ast.children[0]) - evaluate(ast.children[1])
      break
    case Multiple:
      res = evaluate(ast.children[0]) * evaluate(ast.children[1])
      break
    case Divide:
      res = evaluate(ast.children[0]) / evaluate(ast.children[1])
      break
    default:
      res = parseFloat(ast.value)
      break
  }
  return res
}

module.exports = evaluate
