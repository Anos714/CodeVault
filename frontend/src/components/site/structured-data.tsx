import {
  author,
  faqs,
  features,
  siteDescription,
  siteName,
  siteUrl,
  socials,
  steps,
} from "@/lib/site-content";

/**
 * JSON-LD structured data (schema.org). Rendered on the server so crawlers
 * and answer engines see it in the raw HTML — it is invisible chrome, never
 * styled, and mirrors the copy in src/lib/site-content.ts.
 */

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // escape "<" so the JSON can never terminate the script element early
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** Organization + WebSite + SoftwareApplication — sits in the root layout. */
export function SiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": `${siteUrl}/#organization`,
            name: siteName,
            url: siteUrl,
            logo: `${siteUrl}/icon-512.png`,
            description: siteDescription,
            founder: {
              "@type": "Person",
              name: author.name,
              url: author.url,
            },
            sameAs: [socials.repo, socials.x, socials.linkedin],
          },
          {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            name: siteName,
            url: siteUrl,
            description: siteDescription,
            inLanguage: "en",
            publisher: { "@id": `${siteUrl}/#organization` },
          },
          {
            "@type": "SoftwareApplication",
            name: siteName,
            url: siteUrl,
            description: siteDescription,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Web, Chrome, VS Code",
            browserRequirements: "Requires JavaScript",
            license: socials.license,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: features.map(
              (feature) => `${feature.title}: ${feature.description}`,
            ),
            author: {
              "@type": "Person",
              name: author.name,
              url: author.url,
            },
            image: `${siteUrl}/icon-512.png`,
          },
        ],
      }}
    />
  );
}

/** FAQPage + HowTo — sits on the homepage next to the sections they describe. */
export function HomeJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "FAQPage",
            "@id": `${siteUrl}/#faq`,
            mainEntity: faqs.map(({ question, answer }) => ({
              "@type": "Question",
              name: question,
              acceptedAnswer: {
                "@type": "Answer",
                text: answer,
              },
            })),
          },
          {
            "@type": "HowTo",
            "@id": `${siteUrl}/#how-to`,
            name: "How CodeVault works",
            description:
              "Capture, organize, and reuse your code snippets in three steps.",
            step: steps.map(({ step, title, description }) => ({
              "@type": "HowToStep",
              name: `${step} — ${title}`,
              text: description,
            })),
          },
        ],
      }}
    />
  );
}
