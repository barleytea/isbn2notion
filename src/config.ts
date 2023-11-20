import { Env } from "./env";

const setProperties = (): void => {
  PropertiesService.getScriptProperties().setProperties(Env.properties);
};

const getProperties = (): void => {
  const properties = PropertiesService.getScriptProperties().getProperties();
  console.log(properties);
};
