import { useLocale } from "@/context/LocaleContext";



export function AboutPage() {

  const { dict } = useLocale();

  const t = dict.about;



  return (

    <div className="doc-page">

      <h1>{t.title}</h1>

      <p className="lead">{t.lead}</p>



      <h2>{t.philosophy.title}</h2>

      <ul>

        {t.philosophy.items.map((item, i) => (

          <li key={i}>

            <strong>{item.title}</strong>  {item.desc}

          </li>

        ))}

      </ul>



      <h2>{t.team.title}</h2>

      <p>{t.team.desc}</p>



      <h2>{t.roadmap.title}</h2>

      <ul>

        {t.roadmap.items.map((item, i) => (

          <li key={i}>

            <strong>{item.time}</strong>: {item.task}

          </li>

        ))}

      </ul>



      <h2>{t.contact.title}</h2>

      <ul>

        <li>{t.contact.email}: <a href="mailto:hello@piwebagency.com">hello@piwebagency.com</a></li>

        <li>{t.contact.zalo}: <a href="https://zalo.me/pi-ecosystem" target="_blank" rel="noreferrer">pi-ecosystem</a></li>

        <li>{t.contact.github}: <a href="https://github.com/piwebagency" target="_blank" rel="noreferrer">github.com/piwebagency</a></li>

      </ul>

    </div>

  );

}


export default AboutPage;
