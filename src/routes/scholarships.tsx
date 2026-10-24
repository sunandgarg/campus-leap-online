import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/scholarships")({
  head: () => ({ meta: [{ title: "Online Degree Scholarships & Fee Support | DekhoCampus" }] }),
  component: () => (
    <div className="profile-container scholarship-guide">
      <p className="profile-eyebrow">FEES & FINANCIAL SUPPORT</p>
      <h1>Understand the offer before you apply.</h1>
      <p>
        Scholarships, payment benefits and financing are different. There is no site-wide guaranteed
        scholarship or discount on DekhoCampus.
      </p>
      <h2>Check these details with the university</h2>
      <ul>
        <li>The exact programme, intake and eligibility conditions.</li>
        <li>The benefit amount, expiry date and whether it applies to every payment option.</li>
        <li>The total payable including registration, exams and any lender charges.</li>
        <li>The written refund policy and how any benefit affects a refund.</li>
      </ul>
      <p>
        Use the university’s official scholarship page and written fee quote as your final
        reference. An EMI or loan is not a scholarship.
      </p>
      <div className="profile-hero-actions">
        <a className="profile-button" href="/contact">
          Ask about fee support
        </a>
        <a className="profile-button profile-button-outline" href="/compare">
          Compare universities
        </a>
      </div>
    </div>
  ),
});
