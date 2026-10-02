"use client";

import { useEffect } from "react";
import { dictionaries } from "@/i18n/dictionaries";
import { useLocale } from "@/i18n/use-translation";

const ORIGINAL_TEXT = "data-w2v-original-text";
const ORIGINAL_ATTRIBUTE = "data-w2v-original-";
const TRANSLATABLE_ATTRIBUTES = ["placeholder", "aria-label", "title", "alt"];

/**
 * Applies the dictionary to legacy UI markup that predates `useT`. New
 * components should still use `useT` directly; this keeps older page bodies
 * (Activity, Discover, Exchange and Scanner) in step during their migration.
 */
export function LocaleTextRenderer() {
  const locale = useLocale();

  useEffect(() => {
    const french = dictionaries.fr ?? {};
    const translate = (value: string) =>
      locale === "fr" ? (french[value] ?? value) : value;

    const apply = (root: ParentNode) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const textNodes: Text[] = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode as Text);
      for (const node of textNodes) {
        const parent = node.parentElement;
        if (!parent || ["SCRIPT", "STYLE"].includes(parent.tagName)) continue;
        const original =
          parent.getAttribute(ORIGINAL_TEXT) ?? node.nodeValue ?? "";
        if (!original.trim()) continue;
        if (!parent.hasAttribute(ORIGINAL_TEXT))
          parent.setAttribute(ORIGINAL_TEXT, original);
        node.nodeValue = translate(original);
      }

      for (const element of root.querySelectorAll<HTMLElement>("*")) {
        for (const attribute of TRANSLATABLE_ATTRIBUTES) {
          const key = `${ORIGINAL_ATTRIBUTE}${attribute}`;
          const original =
            element.getAttribute(key) ?? element.getAttribute(attribute);
          if (!original) continue;
          if (!element.hasAttribute(key)) element.setAttribute(key, original);
          element.setAttribute(attribute, translate(original));
        }
      }
    };

    apply(document.body);
    const observer = new MutationObserver(() => apply(document.body));
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);

  return null;
}
