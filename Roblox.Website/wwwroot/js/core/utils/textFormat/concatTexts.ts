enum connectors {
  at = '@',
  plus = '+'
}

const concat = (inputs: Array<string>, connector?: string, isHtmlWrapped?: boolean): string => {
  let returnValue = '';
  if (inputs?.length) {
    const len = inputs.length;
    let connectorToBeApplied = connector;
    if (!connectorToBeApplied) {
      connectorToBeApplied = connectors.at;
    }

    connectorToBeApplied = isHtmlWrapped
      ? `<span class="connector">${connectorToBeApplied}</span>`
      : connectorToBeApplied;

    inputs.forEach((elm: string, idx: number) => {
      const currentElm = isHtmlWrapped ? `<span class="element">${elm}</span>` : elm;

      if (idx < len - 1) {
        returnValue += currentElm + connectorToBeApplied;
      } else {
        returnValue += currentElm;
      }
    });
  }
  return returnValue;
};

export default {
  connectors,
  concat
};
