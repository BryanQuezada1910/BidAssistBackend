import mustache from "mustache";
import fs from "node:fs";

export const loadTemplate = (templatePath, variables = {}) => {
  let template = fs.readFileSync(templatePath, "utf8");
  return mustache.render(template, variables);
}