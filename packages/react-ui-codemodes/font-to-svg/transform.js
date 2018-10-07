module.exports = function(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const components = ["Icon", "Link", "Button", "MenuItem"];

  const iconNames = new Set();

  let preserveIconImport = false;

  root
    .find(j.JSXOpeningElement, node => components.includes(node.name.name))
    .forEach(path => {
      if (path.node.name.name == "Icon") {
        const nameAttrIndex = path.node.attributes.findIndex(
          attr => attr.name && attr.name.name == "name"
        );
        const nameAttr = path.node.attributes[nameAttrIndex];

        if (!nameAttr) {
          preserveIconImport = true;
          return;
        }

        if (
          nameAttr.value.type == "Literal" ||
          nameAttr.value.expression.type == "Literal"
        ) {
          const iconName =
            nameAttr.value.value || nameAttr.value.expression.value;

          iconNames.add(iconName);
          path.node.name.name = `${iconName}Icon`;
          path.node.attributes.splice(nameAttrIndex, 1);
        } else if (
          nameAttr.value.expression.type == "ConditionalExpression" &&
          nameAttr.value.expression.consequent.type == "Literal" &&
          nameAttr.value.expression.alternate.type == "Literal"
        ) {
          const consequentIconName = nameAttr.value.expression.consequent.value;
          const alternateIconName = nameAttr.value.expression.alternate.value;
          iconNames.add(consequentIconName);
          iconNames.add(alternateIconName);

          const iconProps = path.node.attributes.slice(nameAttrIndex, 1);
          const iconNodeIndex = path.parent.parent.node.children.findIndex(
            child => child == path.parent.node
          );

          path.parent.parent.node.children[
            iconNodeIndex
          ] = j.jsxExpressionContainer(
            j.conditionalExpression(
              nameAttr.value.expression.test,
              j.jsxElement(
                j.jsxOpeningElement(
                  j.jsxIdentifier(`${consequentIconName}Icon`),
                  iconProps,
                  true
                )
              ),
              j.jsxElement(
                j.jsxOpeningElement(
                  j.jsxIdentifier(`${alternateIconName}Icon`),
                  iconProps,
                  true
                )
              )
            )
          );
          // Add icons
          // replace path
        } else {
          preserveIconImport = true;
        }
      } else {
        const iconAttrIndex = path.node.attributes.findIndex(
          attr => attr.name && attr.name.name == "icon"
        );
        const iconAttr = path.node.attributes[iconAttrIndex];

        if (iconAttr && iconAttr.value.type == "Literal") {
          const iconName = iconAttr.value.value;
          iconNames.add(iconName);

          // replace
          iconAttr.value = j.jsxExpressionContainer(
            j.jsxElement(
              j.jsxOpeningElement(j.jsxIdentifier(`${iconName}Icon`), [], true)
            )
          );
        }
      }
    });

  if (iconNames.size == 0) return root.toSource();

  let iconImportsInserted = false;
  const iconImports = [...iconNames].map(iconName =>
    j.importDeclaration(
      [j.importDefaultSpecifier(j.identifier(`${iconName}Icon`))],
      j.stringLiteral(`@skbkontur/react-icons/${iconName}`)
    )
  );

  const imports = root.find(j.ImportDeclaration);

  if (!preserveIconImport) {
    imports.replaceWith((path, index) => {
      const specifiers = path.node.specifiers;
      const filteredSpecifiers = specifiers.filter(
        spec => spec.local.name != "Icon"
      );

      if (specifiers.length == filteredSpecifiers.length) return path.node;

      iconImportsInserted = true;

      if (filteredSpecifiers.length == 0) return iconImports;

      path.node.specifiers = filteredSpecifiers;

      return [path.node, ...iconImports];
    });
  }

  if (!iconImportsInserted) imports.at(-1).insertAfter(iconImports);

  return root.toSource();
};
