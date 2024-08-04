import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "@/components/mdx";

export function useMDXComponents(components: MDXComponents) {
  return {
    ...components,
    ...mdxComponents,
  };
}
