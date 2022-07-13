// 这个有bug

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
 用扩展的巴科范式一类表示
*正则表达式 表示0或多个 

add => minus | minus + additive
minus => multiple | multiple - minus
multiple => divide | divide * multiple
divide => primary | primary / divide
primary => NUMBER | (additive)

这样计算的结合性会有问题
add => + multiple|multiple + add 
这样结合性没问题，但是会左递归
add => add|add + multiple
 */

function toAst(tokenReader) {
  let rootNode = new AstNode(Program)
  // 开始推导假发 加法和乘法 先推导加法
  // 每个规则就是一个函数additive对应加法规则
  let child = additive(tokenReader)
  if (child) {
    rootNode.appendChild(child)
  }
  return rootNode
}

function additive(tokenReader) {
  let child1 = minus(tokenReader)
  let node = child1
  let token = tokenReader.peek()
  if (child1 !== null && token !== null) {
    if (token.type === PLUS) {
      token = tokenReader.read()
      let child2 = additive(tokenReader)
      if (child2 !== null) {
        node = new AstNode(Additive)
        node.appendChild(child1)
        node.appendChild(child2)
      }
    }
  }
  return node
}

function minus(tokenReader) {
  let child1 = multiple(tokenReader)
  let node = child1
  let token = tokenReader.peek()
  if (child1 !== null && token !== null) {
    if (token.type === MINUS) {
      token = tokenReader.read()
      let child2 = minus(tokenReader)
      if (child2 !== null) {
        node = new AstNode(Minus)
        node.appendChild(child1)
        node.appendChild(child2)
      }
    }
  }
  return node
}

function multiple(tokenReader) {
  let child1 = divide(tokenReader)
  let node = child1
  let token = tokenReader.peek()
  if (child1 !== null && token !== null) {
    if (token.type === MULTIPLY) {
      token = tokenReader.read()
      let child2 = multiple(tokenReader)
      if (child2 !== null) {
        node = new AstNode(Multiple)
        node.appendChild(child1)
        node.appendChild(child2)
      }
    }
  }
  return node
}

function divide(tokenReader) {
  let child1 = primary(tokenReader)
  let node = child1
  let token = tokenReader.peek()
  if (child1 !== null && token !== null) {
    if (token.type == DIVIDE) {
      token = tokenReader.read()
      let child2 = divide(tokenReader)
      if (child2 !== null) {
        node = new AstNode(Divide)
        node.appendChild(child1)
        node.appendChild(child2)
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
