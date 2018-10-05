module.exports = function(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const components = ["Icon", "Link", "Button", "MenuItem"];

  const iconNames = new Set();

  root
    .find(j.JSXOpeningElement, node => components.includes(node.name.name))
    .forEach(path => {
      const nameAttr = path.node.attributes.find(
        attr => attr.name.name == "name" || attr.name.name == "icon"
      );
      if (nameAttr.value.type == "Literal") {
        iconNames.add(nameAttr.value.value);
      }
    });

  if (iconNames.size == 0) return root.toSource();

  // Найти import Icon -> Удалить
  // Добавить import ${iconName}Icon from '@skbkontur/react-icons'

  const typesForReplace = ["ImportDeclaration"];
  console.log(iconNames);
  // Найти все использования. Вытащить

  root
    .find(j.Node, node => typesForReplace.indexOf(node.type) > -1)
    .filter(path => {
      if (path.node.source.value.match(/\/Icon/)) {
        return path;
      }
    })
    .replaceWith(path => {
      const node = path.node;
      node.source.value = "react-ui-icons";
      return node;
    });

  return root.toSource();
};
