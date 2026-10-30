import { useT } from "@margince/frontend/app";
import { Card, SectionHeader } from "@margince/frontend/design-system";

// A number to try the card on, in the international form WhatsApp and Zalo need.
const SAMPLE = "+84 28 3822 9999";

// #/ext/click-to-call: what the call card does, and a number to try it on.
export function AboutPage() {
  const t = useT();
  return (
    <div className="wrap">
      <SectionHeader title={t("extClickToCall.title")} level={1} />
      <p>{t("extClickToCall.sub")}</p>
      <Card>
        <p>
          {t("extClickToCall.try")} <a href={`tel:${SAMPLE.replaceAll(" ", "")}`}>{SAMPLE}</a>
        </p>
        <p className="t-caption">{t("extClickToCall.international")}</p>
      </Card>
    </div>
  );
}
