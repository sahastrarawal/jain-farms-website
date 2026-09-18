import { Breadcrumbs, Button } from '../components/ui/Primitives'
import { Icon } from '../components/ui/Icon'

export function AboutPage() {
  return (
    <>
      <section className="content-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Our story' }]} />
          <p className="eyebrow">Jain Farms, Pune</p>
          <h1>Fresh food, brought closer.</h1>
          <p>
            Jain Farms helps Pune households shop for produce and pantry staples with more clarity,
            care and confidence.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container editorial-grid">
          <div>
            <p className="eyebrow">Why we exist</p>
            <h2>Make everyday ingredients feel worth choosing.</h2>
          </div>
          <div>
            <p>
              Freshness is not a marketing flourish. It is a series of choices: who to source from,
              what to accept, how to pack it and when to bring it home.
            </p>
            <p>
              Our role is to make those choices thoughtfully, so the weekly fruit bowl, everyday
              sabzi and pantry shelf all begin with better ingredients.
            </p>
          </div>
        </div>
      </section>
      <section className="section section--tint">
        <div className="container values-grid">
          {[
            [
              '01',
              'Season first',
              'We let availability and natural seasonality guide the assortment.',
            ],
            [
              '02',
              'Quality always',
              'Every batch is assessed before it becomes part of your order.',
            ],
            [
              '03',
              'Pune at heart',
              'A neighbourhood-scale service designed around the city we call home.',
            ],
          ].map((v) => (
            <article key={v[0]}>
              <span>{v[0]}</span>
              <h3>{v[1]}</h3>
              <p>{v[2]}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
export function ContactPage() {
  return (
    <section className="section contact-page">
      <div className="container contact-grid">
        <div>
          <Breadcrumbs items={[{ label: 'Contact' }]} />
          <p className="eyebrow">We’re here to help</p>
          <h1>Let’s talk fresh.</h1>
          <p>Questions about an order, delivery area or product? Reach the Jain Farms care team.</p>
          <div className="contact-details">
            <a href="tel:+917719991999">
              <Icon name="user" />
              <span>
                <small>Call or WhatsApp</small>
                <strong>+91 77199 91999</strong>
              </span>
            </a>
            <a href="mailto:care@jainfarms.co.in">
              <Icon name="arrow" />
              <span>
                <small>Email</small>
                <strong>care@jainfarms.co.in</strong>
              </span>
            </a>
            <div>
              <Icon name="pin" />
              <span>
                <small>Visit</small>
                <strong>Maharshi Nagar, Pune — 37</strong>
              </span>
            </div>
          </div>
        </div>
        <form
          className="contact-form"
          onSubmit={(e) => {
            e.preventDefault()
            alert('Thanks — this form is ready to connect to your support backend.')
          }}
        >
          <label>
            Name
            <input required name="name" />
          </label>
          <label>
            Email
            <input required type="email" name="email" />
          </label>
          <label>
            Phone
            <input type="tel" name="phone" />
          </label>
          <label>
            How can we help?
            <textarea required rows="5" name="message" />
          </label>
          <Button type="submit">Send message</Button>
        </form>
      </div>
    </section>
  )
}
