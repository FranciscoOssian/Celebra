import React from "react";

// Interface para representar o JSON gerado
interface JsonElement {
  type: string;
  props: { [key: string]: any; children?: (JsonElement | string | number)[] }; // children agora faz parte das props
}

// Função para converter React para JSON
export function reactToJSON(
  element: React.ReactElement
): JsonElement | string | number | null {
  if (!element) return null;

  if (typeof element === "string" || typeof element === "number") {
    return element;
  }

  const { type, props } = element;

  // Converte children recursivamente
  const children = props.children
    ? React.Children.map(props.children, reactToJSON)
    : [];

  return {
    type: typeof type === "string" ? type : (type as React.ComponentType).name, // Pega o nome do componente ou tag HTML
    props: { ...props, children }, // Mantém os children nas props
  };
}

// Função para converter JSON de volta para React, usando o mapeamento de componentes customizados
export function jsonToReact(
  json: JsonElement | string | number | null,
  componentMap: { [key: string]: React.ComponentType<any> }
): React.ReactNode {
  if (!json) return null;

  if (typeof json === "string" || typeof json === "number") {
    return json;
  }

  const { type, props } = json;
  const { children = [] } = props;

  // Verifica se o tipo é um componente customizado ou uma tag HTML padrão
  const Component = componentMap[type] || type;

  // Renderiza o componente com as props e os children convertidos recursivamente
  return React.createElement(
    Component,
    { ...props },
    children.map((child) => jsonToReact(child, componentMap)) // Passa o mapeamento para os children
  );
}
