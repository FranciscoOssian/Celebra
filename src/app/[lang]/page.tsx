import Button from "@/components/common/Button";
import InternalLayout from "@/components/layout/InternalLayout";
import Hero from "@/components/pages/home/Hero";
import FAQ from "@/components/pages/home/Faq";
import PriceCard from "@/components/pages/home/PriceCard";
import { getTranslations, translations } from "@/services/translations";
import { useMemo } from "react";
import Header from "@/components/layout/Header";

export default function Home({ params: { lang } }: never) {
  const t = getTranslations(lang, translations);

  const faqs = useMemo(
    () => [
      {
        question: t(`What is Celebra?`),
        answer: t(
          `Celebra is a platform designed to simplify the creation and management of events.`
        ),
      },
      {
        question: t(`How can I create an event on Celebra?`),
        answer: t(
          `To create an event, simply access the platform and fill out a simple form with the event details, such as name, date, time, location, and description.`
        ),
      },
      {
        question: t(
          `Is there a limit to the number of events I can create for free?`
        ),
        answer: t(
          `Yes, you can create up to three events for free. After that, a fee will be charged for each event created.`
        ),
      },
      {
        question: t(`How do I manage my guests?`),
        answer: t(
          `The platform allows you to add guests and manage the attendance list. You can track who confirmed attendance and who could not make it.`
        ),
      },
      {
        question: t(`Can I customize the invitations?`),
        answer: t(
          `Yes! Invitations can be customized to reflect the theme of your event. You can add images, text, and styles to the event page.`
        ),
      },
      {
        question: t(`What is Celebra's payment model?`),
        answer: t(
          `Celebra operates on a pay-per-event model, eliminating monthly fees. You only pay for the events you create.`
        ),
      },
      {
        question: t(`How does payment processing work?`),
        answer: t(
          `Payments are processed through integration with Stripe, ensuring a secure and efficient experience for paid events.`
        ),
      },
      {
        question: t(`Is the platform accessible on mobile devices?`),
        answer: t(
          `Yes, Celebra's design is responsive and adaptable to different devices, allowing event creation anywhere and anytime.`
        ),
      },
      {
        question: t(`How can I contact for more information?`),
        answer: t(
          `For more information, you can access the contact section on the platform or send an email to our support team.`
        ),
      },
    ],
    [t]
  );

  return (
    <>
      <Header />
      <div className="flex flex-col items-center">
        {/* Hero Section */}
        <Hero lang={lang} />

        <InternalLayout>
          {/* FAQ Section */}
          <section id="faq" className="!max-md:w-full">
            <FAQ list={faqs} />
          </section>
        </InternalLayout>

        {/* Sign Up Section */}
        <div className="flex flex-col gap-4 my-20 justify-center items-center w-full h-[300px] bg-slate-100">
          <h2 className="text-5xl font-bold text-black">
            {t("Sign up today.")}
          </h2>
          <Button href="/auth/signup">{t("Get Started")}</Button>
        </div>

        {/* Pricing Section */}
        <InternalLayout
          id="pricing"
          className="flex flex-wrap justify-around items-center mb-10"
        >
          <PriceCard
            product={t("month")}
            title={t("Free")}
            price={0}
            benefits={[
              t("Manage up to 3 events simultaneously, at no cost"),
              t("Create events"),
              t("Manage events"),
              t("Manage participants"),
            ]}
          />
          <PriceCard
            product={t("event")}
            single
            title={t("Per event / under construction")}
            price={2}
            benefits={[
              t("Manage as many events as you want simultaneously"),
              t("Create events"),
              t("Manage events"),
              t("Manage participants"),
            ]}
          />
        </InternalLayout>
      </div>
    </>
  );
}
