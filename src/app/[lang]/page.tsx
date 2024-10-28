import Button from "@/components/common/Button";
import InternalLayout from "@/components/layout/InternalLayout";
import Hero from "@/components/pages/home/Hero";
import FAQ from "@/components/pages/home/Faq";
import PriceCard from "@/components/pages/home/PriceCard";
import { getTranslations, translations } from "@/services/translations";
import { useMemo } from "react";
import Header from "@/components/layout/Header";
import React from "react";

export default function Home({ params: { lang } }: never) {
  const t = getTranslations(lang, translations);

  const faqs = useMemo(
    () => [
      {
        question: t(`What is Celebra?`),
        answer: t(
          `Celebra is a platform designed to streamline the event management process, making it easy and fun for organizers to create memorable experiences.`
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
          `Yes, with our free plan, you can manage up to 3 events simultaneously at no cost.`
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
          `Payments are processed securely through our platform, allowing you to focus on your event rather than on logistics.`
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

        <div className="bg-slate-200 w-full py-11">
          <InternalLayout>
            <h2 className="text-5xl max-md:text-3xl font-bold my-14 text-gray-800 text-center">
              {t("With Celebra you")}
            </h2>
            <div className="flex flex-col flex-wrap justify-center gap-5">
              {[
                [
                  t("Simplify your event organization"),
                  t(
                    "You can manage all aspects of your event in one place, saving time and reducing your workload."
                  ),
                ],
                [
                  t("Boost your productivity"),
                  t(
                    "The platform provides ready-made templates and resources, allowing you to focus on what really matters: delivering an amazing experience for attendees."
                  ),
                ],
                [
                  t("Customize event pages"),
                  t(
                    "Create personalized event sites that reflect your brand, ensuring your guests experience the uniqueness of your celebration."
                  ),
                ],
                [
                  t("Efficiently manage participants"),
                  t(
                    "Easily track RSVP and guest interactions, making it easy to engage before, during, and after the event."
                  ),
                ],
                [
                  t("Access from anywhere"),
                  t(
                    "The platform is mobile-optimized, allowing you to manage your events anytime, anywhere."
                  ),
                ],
              ].map((item, i, list) => (
                <React.Fragment key={i}>
                  <div
                    data-isOdd={i % 2 !== 0}
                    className="w-full flex flex-col justify-between py-5 px-2 data-[isOdd=true]:text-right"
                  >
                    <h3 className="text-2xl">{item[0]}</h3>
                    <div className="break-words">{item[1]}</div>
                  </div>
                  <hr
                    data-hidden={i === list.length - 1}
                    className="bg-black opacity-15 h-[2px] data-[hidden=true]:hidden"
                  />
                </React.Fragment>
              ))}
            </div>
          </InternalLayout>
        </div>

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
            title={t("Per event")}
            price={10}
            benefits={[
              t("Manage as many events as you want simultaneously"),
              t("Create events"),
              t("Manage events"),
              t("Manage participants"),
            ]}
          />
        </InternalLayout>
      </div>
      <footer className="w-full h-20 font-extralight bg-slate-200 flex justify-between items-center">
        <InternalLayout>
          <div>© Celebra Inc. {new Date().getFullYear()}</div>
          <div></div>
        </InternalLayout>
      </footer>
    </>
  );
}
