const { ESLintUtils } = require('@typescript-eslint/utils');

module.exports = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce using .eventually() for methods that have an eventually property',
      category: 'Best Practices',
    },
    fixable: 'code',
    schema: [],
    messages: {
      useEventually: 'The data for "{{methodName}}" is eventually consistent. Use {{fullPath}}.eventually() and specify a timeout for this operation.',
    },
  },

  defaultOptions: [],

  create(context) {
    const services = ESLintUtils.getParserServices(context);
    const checker = services.program.getTypeChecker();

    function hasEventuallyProperty(type) {
      // Check if the type has an 'eventually' property
      const eventuallySymbol = type.getProperty('eventually');
      return !!eventuallySymbol;
    }

    function getMethodName(node) {
      if (node.type === 'Identifier') {
        return node.name;
      }
      if (node.type === 'MemberExpression' && node.property.type === 'Identifier') {
        return node.property.name;
      }
      return null;
    }

    function getFullPath(node) {
      const sourceCode = context.getSourceCode();
      return sourceCode.getText(node);
    }

    return {
      CallExpression(node) {
        // Skip if this is already calling .eventually
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'eventually'
        ) {
          return;
        }

        // Get the TypeScript node for type checking
        const tsNode = services.esTreeNodeToTSNodeMap.get(node.callee);
        if (!tsNode) return;

        // Get the type of the thing being called
        const type = checker.getTypeAtLocation(tsNode);
        if (!type) return;

        // Check if this type has an 'eventually' property
        if (hasEventuallyProperty(type)) {
          const methodName = getMethodName(node.callee);
          const fullPath = getFullPath(node.callee);

          context.report({
            node: node.callee,
            messageId: 'useEventually',
            data: { 
              methodName: methodName || 'method',
              fullPath 
            },
            fix(fixer) {
              // Auto-fix: add .eventually to the call
              return fixer.replaceText(node.callee, `${fullPath}.eventually`);
            },
          });
        }
      },
    };
  },
});