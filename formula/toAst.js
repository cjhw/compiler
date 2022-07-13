const AstNode = require('./AstNode')

const {
  NUMBER,
  PLUS,
  MULTIPLY,
  MINUS,
  DIVIDE,
  LEFT_PARA,
  RIGHT_PARA,
} = require('./tokenTypes')
const {
  Program,
  Numeric,
  Additive,
  Multiple,
  Minus,
  Divide,
} = require('./nodeTypes')

/**
add => minus | minus + add
minus => multiple | multiple - minus
multiple => divide | divide * multiple
divide => primary | primary / divide
primary => NUMBER | (add)  基础规则
从右往左算
这种出现连续减 或者 连续除 会有问题
 */
/**
正确的文法
add => minus + add | minus
minus =>  multiple - minus | multiple
multiple =>  divide * multiple | divide
divide =>  NUMBER / divide | NUMBER
从左往右算
左递归的问题
要解决这个问题 用扩展的巴科范式一类表示
*正则表达式 表示0或多个 
add => multiple ( + multiple)*
multiple=> NUMBER (* NUMBER)*
 */

function toAst(tokenReader) {
  let rootNode = new AstNode(Program)
  // 开始推导加法 加法和乘法 先推导加法
  // 每个规则就是一个函数
  let child = additive(tokenReader)
  if (child) {
    rootNode.appendChild(child)
  }
  return rootNode
}
//2+3+4+5+6
function additive(tokenReader) {
  let child1 = multiple(tokenReader) //2
  let node = child1
  if (child1 != null) {
    while (true) {
      let token = tokenReader.peek() //看下一个符合是不是 +
      if (token && (token.type == PLUS || token.type == MINUS)) {
        token = tokenReader.read() //消耗+
        let child2 = multiple(tokenReader) //3
        node = new AstNode(token.type == PLUS ? Additive : Minus)
        node.appendChild(child1)
        node.appendChild(child2)
        child1 = node
      } else {
        break
      }
    }
  }
  return node
}

function multiple(tokenReader) {
  let child1 = primary(tokenReader)
  let node = child1
  if (child1 != null) {
    while (true) {
      let token = tokenReader.peek() //+
      if (token && (token.type == MULTIPLY || token.type == DIVIDE)) {
        // NUMBER * multiple
        token = tokenReader.read() //读取并且消耗 *
        let child2 = primary(tokenReader)
        node = new AstNode(token.type == MULTIPLY ? Multiple : Divide)
        node.appendChild(child1)
        node.appendChild(child2)
        child1 = node
      } else {
        break
      }
    }
  }
  return node
}

function primary(tokenReader) {
  let node = number(tokenReader)
  if (!node) {
    let token = tokenReader.peek()
    if (token !== null && token.type === LEFT_PARA) {
      tokenReader.read()
      node = additive(tokenReader)
      tokenReader.read()
    }
  }
  return node
}

function number(tokenReader) {
  let node = null
  let token = tokenReader.peek()
  if (token != null && token.type == NUMBER) {
    token = tokenReader.read() //读取并消耗这个token
    node = new AstNode(Numeric, token.value)
  }
  return node
}

module.exports = toAst
