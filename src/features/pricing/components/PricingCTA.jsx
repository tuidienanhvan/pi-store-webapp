import React from "react";

import { Link } from "react-router-dom";

import { Card, Button } from "@/_shared/components/ui";
import './PricingCTA.css';




export function PricingCTA() {

  return (

    <section className="pricing-bottom-cta">

      <Card className="pricing-bottom-card">

        <h2 className="pricing-bottom-title">Chua ch?c gi no h?p?</h2>

        <p className="pricing-bottom-desc muted">

          B?t d?u v?i <strong>Starter $9</strong>  nng c?p sau khi bi?t traffic th?t.

        </p>

        <div className="pricing-bottom-actions">

          <Button as={Link} to="/signup" variant="primary" size="lg">B?t d?u v?i Starter</Button>

          <Button as={Link} to="/contact" variant="ghost" size="lg">Lin h? sales (Enterprise)</Button>

        </div>

      </Card>

    </section>

  );

}

