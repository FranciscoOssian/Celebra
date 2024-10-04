"use client";

import Button from "@/components/common/Button";
import FAQ from "@/components/pages/home/Faq";
import PriceCard from "@/components/pages/home/PriceCard";

const faqs = [
  {
    question: "O que é o Celebra?",
    answer:
      "Celebra é uma plataforma SaaS projetada para facilitar a criação e o gerenciamento de eventos, inicialmente focada em aniversários, mas com a possibilidade de expansão para outros tipos de celebrações.",
  },
  {
    question: "Como posso criar um evento no Celebra?",
    answer:
      "Para criar um evento, basta acessar a plataforma e preencher um formulário simples com as informações do evento, como nome, data, horário, local e descrição.",
  },
  {
    question: "Existe um limite de eventos que posso criar gratuitamente?",
    answer:
      "Sim, você pode criar até três eventos gratuitamente. Após isso, será cobrada uma taxa por evento criado.",
  },
  {
    question: "Como gerencio meus convidados?",
    answer:
      "A plataforma permite que você adicione convidados e gerencie a lista de presença. Você pode acompanhar quem confirmou presença e quem não pôde comparecer.",
  },
  {
    question: "Posso personalizar os convites?",
    answer:
      "Sim! Os convites podem ser personalizados para refletir o tema do seu evento. Você pode adicionar imagens, textos e estilos à página do evento.",
  },
  {
    question: "Qual é o modelo de pagamento do Celebra?",
    answer:
      "O Celebra opera em um modelo de pagamento por evento, eliminando mensalidades. Você paga apenas pelos eventos que criar.",
  },
  {
    question: "Como funciona o processamento de pagamentos?",
    answer:
      "Os pagamentos são processados através da integração com o Stripe, garantindo uma experiência segura e eficiente para eventos pagos.",
  },
  {
    question: "A plataforma é acessível em dispositivos móveis?",
    answer:
      "Sim, o design do Celebra é responsivo e adaptável a diferentes dispositivos, permitindo a criação de eventos em qualquer lugar e a qualquer momento.",
  },
  {
    question: "Como posso entrar em contato para mais informações?",
    answer:
      "Para mais informações, você pode acessar a seção de contato na plataforma ou enviar um e-mail para nossa equipe de suporte.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="my-20 flex flex-col justify-center items-center text-center pt-20">
        <h2 className="text-[40px] font-bold tracking-tight text-[#001122]">
          🎉Celebra🎉
        </h2>
        <h2 className="mt-4 text-[24px] font-medium leading-[1.5em] text-[#888888] max-w-[400px] mx-auto">
          Celebra é a solução perfeita para quem deseja organizar eventos de
          forma descomplicada e divertida. Venha celebrar com a gente!
        </h2>
        <Button
          href="/auth/signin"
          className="mt-6 bg-[#00bfff] text-white rounded-md px-4 py-2 hover:bg-[#0099cc] transition duration-300"
        >
          Get Started
        </Button>
      </div>

      {/* FAQ Section */}
      <section id="faq" className="my-20 w-full">
        <FAQ list={faqs} />
      </section>

      {/* Sign Up Section */}
      <div className="flex flex-col gap-4 my-20 justify-center items-center w-full h-[300px] bg-slate-100">
        <h2 className="text-5xl font-bold text-black">Sign up today.</h2>
        <Button href="/auth/register">Get Started</Button>
      </div>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="flex flex-wrap justify-center items-center gap-5 mb-10"
      >
        <PriceCard
          product="mês"
          title="Free"
          price={0}
          benefits={[
            "Gerencie até 3 eventos simultaneamente, sem custo",
            "Crie eventos",
            "Gerencie eventos",
            "Gerencie participantes",
          ]}
          onClick={() => {}}
        />
        <PriceCard
          product="evento"
          single
          title="Por evento"
          price={3}
          benefits={[
            "Gerencie quantos eventos quiser simultaneamente",
            "Crie eventos",
            "Gerencie eventos",
            "Gerencie participantes",
          ]}
          onClick={() => {}}
        />
      </section>
    </div>
  );
}
