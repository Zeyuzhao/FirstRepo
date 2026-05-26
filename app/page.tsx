export default function Home() {
  return (
    <main className="site">
      <section className="hero">
        <p className="eyebrow">Lotus Lane Yoga Shop</p>
        <h1>Ground your practice with mindful essentials.</h1>
        <p className="lede">
          Shop eco-conscious mats, breathable apparel, and props selected by
          experienced instructors for studio and home flow.
        </p>
        <div className="heroActions">
          <a className="button primary" href="#inquiry">
            Start an Inquiry
          </a>
          <a className="button secondary" href="#collections">
            View Collections
          </a>
        </div>
      </section>

      <section id="collections" className="collections">
        <article className="card">
          <h2>Performance Mats</h2>
          <p>
            Non-slip natural rubber mats with alignment guides for every
            practice style.
          </p>
        </article>
        <article className="card">
          <h2>Comfort Apparel</h2>
          <p>
            Stretch-knit tops and leggings designed for movement, breathability,
            and all-day wear.
          </p>
        </article>
        <article className="card">
          <h2>Studio Props</h2>
          <p>
            Cork blocks, cotton straps, and bolsters to support restorative and
            strength-building sequences.
          </p>
        </article>
      </section>

      <section id="inquiry" className="inquiryWrap">
        <div className="inquiryIntro">
          <p className="eyebrow">Need recommendations?</p>
          <h2>Send us your yoga product inquiry.</h2>
          <p>
            Tell us your level, goals, and preferred products. Our team will
            follow up with tailored suggestions within one business day.
          </p>
        </div>

        <form className="inquiryForm" action="#" method="post">
          <label htmlFor="name">Full Name</label>
          <input id="name" name="name" type="text" required />

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />

          <label htmlFor="interest">Primary Interest</label>
          <select id="interest" name="interest" required defaultValue="">
            <option value="" disabled>
              Select one
            </option>
            <option value="mats">Yoga Mats</option>
            <option value="apparel">Apparel</option>
            <option value="props">Props & Accessories</option>
            <option value="bundles">Starter Bundles</option>
          </select>

          <label htmlFor="message">Inquiry Details</label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Share your practice style, goals, and what you're looking for."
            required
          />

          <button className="button primary" type="submit">
            Submit Inquiry
          </button>
        </form>
      </section>
    </main>
  );
}
