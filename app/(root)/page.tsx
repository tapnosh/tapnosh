import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  return (
    <section className="section">
      <h1>{t("title")}</h1>
    </section>
  );
}
