import "./SimpleCard.css";

type SimpleCardProps = {
  title: string;
  body: string;
};

export function SimpleCard({ title, body }: SimpleCardProps) {
  return (
    <article className="simple-card">
      <h2>{title}</h2>
      <p>{body}</p>
    </article>
  );
}

export type { SimpleCardProps };
