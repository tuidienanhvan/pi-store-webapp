import { Link } from "react-router-dom";

import { Button } from "../ui";

import "./PricingEnterprise.css";



export function PricingEnterprise({ copy }) {

  return (

    <div className="enterprise-card">

      <div className="enterprise-card__left">

        <div className="enterprise-badge">Enterprise</div>

        <h2 className="enterprise-title">{copy.title}</h2>

        <p className="enterprise-desc">{copy.description}</p>

        <div className="enterprise-features">

          {copy.features.map((f) => (

            <span key={f} className="enterprise-feature-chip">{f}</span>

          ))}

        </div>

      </div>

      <div className="enterprise-card__right">

        <Button as={Link} to="/contact" variant="primary" size="lg">

          {copy.cta}

        </Button>

        <p className="enterprise-response-note">{copy.note}</p>

      </div>

    </div>

  );

}

