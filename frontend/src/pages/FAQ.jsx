import React, { useState } from "react";
import Footer from "../components/Footer";
import "../styles/FAQ.css";

const faqData = [
  {
    question: "How can I book a property?",
    answer:
      "You can book a property by selecting your preferred unit and paying a booking amount through authorized methods.",
  },
  {
    question: "What documents are required?",
    answer:
      "You need Aadhar Card, PAN Card, passport photos, and income proof if applying for a loan.",
  },
  {
    question: "What payment options are available?",
    answer:
      "We offer construction-linked plans, down payment plans, and EMI options.",
  },
  {
    question: "When will I get possession?",
    answer:
      "Possession will be given after project completion and necessary approvals.",
  },
  {
    question: "Are there any additional charges?",
    answer:
      "Yes, GST, registration, maintenance, and parking charges may apply.",
  },
  {
    question: "How is maintenance handled?",
    answer: "Maintenance is handled by the society or management team.",
  },
  {
    question: "Are there hidden costs?",
    answer: "No, all costs are clearly mentioned in the cost sheet.",
  },
  {
    question: "Is property legally approved?",
    answer: "Yes, all approvals from authorities are obtained.",
  },
  {
    question: "How can I contact support?",
    answer: "You can contact via phone, email, or visit our office.",
  },
  {
    question: "Is it safe to invest?",
    answer: "Yes, the project follows all legal and safety standards.",
  },
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <div className="faq-container">
        <h1 className="faq-title">FAQs</h1>
        <div className="faq-line"></div>

        {faqData.map((item, index) => (
          <div key={index} className="faq-item">
            <h3 className="faq-question" onClick={() => handleClick(index)}>
              {item.question}
              <span className="toggle-icon">
                {activeIndex === index ? "-" : "+"}
              </span>
            </h3>

            {activeIndex === index && (
              <p className="faq-answer">{item.answer}</p>
            )}
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
}

export default FAQ;
