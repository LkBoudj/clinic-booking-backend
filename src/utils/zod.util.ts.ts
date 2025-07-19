import z from "zod";

export function formatZodErrors(e: z.ZodError) {
  return e.issues.reduce((errors: any, issue) => {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = [issue.message];
    } else {
      errors[path].push(issue.message);
    }
    return errors;
  }, {});
}
