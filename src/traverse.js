const { parser } = require('./parser')
const nodeTypes = require('./nodeTypes')

function replace(parent, oldNode, newNode) {
  if (parent) {
    for (const key in parent) {
      if (parent.hasOwnProperty(key)) {
        if (parent[key] === oldNode) {
          parent[key] = newNode
        }
      }
    }
  }
}

function traverse(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach((item) => traverseNode(item, parent))
  }
  function traverseNode(node, parent) {
    let replaceWith = replace.bind(null, parent, node)
    let method = visitor[node.type]
    if (method) {
      if (typeof method === 'function') method({ node, replaceWith }, parent)
      else method.enter({ node, replaceWith }, parent)
    }
    switch (node.type) {
      case nodeTypes.Program:
        traverseArray(node.body, node)
        break
      case nodeTypes.ExpressionStatement:
        traverseNode(node.expression, node)
        break
      case nodeTypes.JSXElement:
        traverseNode(node.openingElement, node)
        traverseArray(node.children, node)
        traverseNode(node.closingElement, node)
        break
      case nodeTypes.JSXOpeningElement:
        traverseNode(node.name, node)
        traverseArray(node.attributes, node)
        break
      case nodeTypes.JSXAttribute:
        traverseNode(node.name, node)
        traverseNode(node.value, node)
        break
      case nodeTypes.JSXClosingElement:
        traverseNode(node.name, node)
        break
      case nodeTypes.JSXIdentifier:
      case nodeTypes.JSXText:
      case nodeTypes.Literal:
        break
      default:
        break
    }
    if (method && method.exit) {
      method.exit({ node, replaceWith }, parent)
    }
  }
  traverseNode(ast, null)
}

let source = '<h1 id="title" name="caicai"><span>hello</span>world</h1>'
let ast = parser(source)

// traverse(ast, {
//   JSXOpeningElement: {
//     enter(nodePath, parent) {
//       console.log('JSXOpeningElement enter', nodePath)
//     },
//     exit(nodePath, parent) {
//       console.log('JSXOpeningElement exit', nodePath)
//     },
//   },
// })
module.exports = { traverse }
