const { traverse } = require('./traverse')
const nodeTypes = require('./nodeTypes')
// const t = require('babel-types')

class t {
  static nullLiteral() {
    return { type: nodeTypes.NullLiteral }
  }
  static stringLiteral(value) {
    return { type: nodeTypes.StringLiteral, value }
  }
  static identifier(name) {
    return { type: nodeTypes.Identifier, name }
  }
  static memberExpression(object, property) {
    return { type: nodeTypes.MemberExpression, object, property }
  }
  static objectProperty(key, value) {
    return { type: nodeTypes.ObjectProperty, key, value }
  }
  static objectExpression(proterties) {
    return { type: nodeTypes.ObjectExpression, proterties }
  }
  static callExpression(callee, args) {
    return { type: nodeTypes.CallExpression, callee, args }
  }

  static isJSXElement(node) {
    return node.type === nodeTypes.JSXElement
  }
  static isJSXText(node) {
    return node.type === nodeTypes.JSXText
  }
}

function transformer(ast) {
  traverse(ast, {
    JSXElement(nodePath, parent) {
      // 传入一个JSXElement语法树节点，返回一个方法调用的新节点
      function transform(node) {
        if (!node) return t.nullLiteral() //null
        if (t.isJSXElement(node)) {
          // JSX元素 转换成方法调用
          let memberExpression = t.memberExpression(
            t.identifier('React'),
            t.identifier('createElement')
          )
          let elementType = t.stringLiteral(node.openingElement.name.name)
          let attributes = node.openingElement.attributes
          let objectExpression
          if (attributes.length > 0) {
            objectExpression = t.objectExpression(
              attributes.map((item) =>
                t.objectProperty(
                  t.identifier(item.name.name),
                  t.stringLiteral(item.value.name)
                )
              )
            )
          } else {
            objectExpression = t.nullLiteral()
          }
          let args = [
            elementType,
            objectExpression,
            ...node.children.map((item) => transform(item)),
          ]
          return t.callExpression(memberExpression, args)
        } else if (t.isJSXText(node)) {
          // 文本
          return t.stringLiteral(node.value)
        }
      }
      let newNode = transform(nodePath.node)
      nodePath.replaceWith(newNode)
    },
  })
}

module.exports = { transformer }
