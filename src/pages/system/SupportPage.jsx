import { Link } from "react-router-dom";

import { Badge, Card, Icon, Table } from "@/components/ui";



export function SupportPage() {

  return (

    <div className="stack gap-8">

      <header className="stack gap-2">

        <h1 className="m-0 text-32">Support</h1>

        <p className="m-0 text-lg muted">Fastest channels to get help.</p>

      </header>



      <div className="grid grid-cols-3 gap-4">

        <SupportLink href="mailto:support@piwebagency.com" icon="mail" title="Email" desc="support@piwebagency.com - response within 24h." />

        <SupportLink href="https://zalo.me/pi-ecosystem" icon="chat" title="Zalo chat" desc="Priority support for Pro/Max." external />

        <SupportLink to="/docs" icon="book" title="Documentation" desc="Setup, API and troubleshooting." />

        <SupportLink to="/faq" icon="info" title="FAQ" desc="Common questions and answers." />

        <SupportLink href="https://github.com/piwebagency/issues" icon="activity" title="Bug tracker" desc="Public GitHub issues." external />

        <SupportLink href="https://status.piwebagency.com" icon="check" title="System status" desc="Live uptime and incidents." external />

      </div>



      <section className="stack gap-4">

        <h2 className="m-0 text-2xl">SLA</h2>

        <Card className="p-0 overflow-hidden">

          <Table>

            <thead>

              <tr><th>Tier</th><th>Channel</th><th>Response time</th><th>Priority</th></tr>

            </thead>

            <tbody>

              <tr><td>Free</td><td>Email, community</td><td>3-5 days</td><td><Badge tone="neutral">Low</Badge></td></tr>

              <tr><td>Pro</td><td className="font-medium">Email, Zalo</td><td className="font-medium">24h</td><td><Badge tone="info">Medium</Badge></td></tr>

              <tr><td>Max</td><td className="font-medium text-primary">Direct support</td><td className="font-medium text-primary">4h</td><td><Badge tone="warning">High</Badge></td></tr>

              <tr><td>Founder</td><td className="font-medium text-success">Dev team line</td><td className="font-medium text-success">2h</td><td><Badge tone="danger">VIP</Badge></td></tr>

            </tbody>

          </Table>

        </Card>

      </section>

    </div>

  );

}



function SupportLink({ href, to, icon, title, desc, external = false }) {

  const Comp = to ? Link : "a";

  const props = to ? { to } : { href, target: external ? "_blank" : undefined, rel: external ? "noreferrer" : undefined };

  return (

    <Card as={Comp} {...props} className="stack hover-lift gap-3 p-5 no-underline text-inherit">

      <div className="w-10 h-10 rounded-md bg-base-200-2 flex items-center justify-center text-primary">

        <Icon name={icon} size={20} />

      </div>

      <h3 className="m-0 text-lg">{title}</h3>

      <p className="m-0 text-sm muted">{desc}</p>

    </Card>

  );

}

