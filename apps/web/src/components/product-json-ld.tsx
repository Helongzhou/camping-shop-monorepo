type ProductJsonLdProps = {
  data: Record<string, unknown>;
};

export function ProductJsonLd({ data }: ProductJsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
