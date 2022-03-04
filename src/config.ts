import { Env } from "./env";

function setProperties() {
  PropertiesService.getScriptProperties().setProperties(Env.properties);
}

function getProperties() {
  const properties = PropertiesService.getScriptProperties().getProperties();
  console.log(properties);
}
